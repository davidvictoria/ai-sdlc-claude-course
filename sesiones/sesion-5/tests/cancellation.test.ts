import { describe, expect, it } from 'vitest';
import {
  CancellationConflictError,
  InvalidCancellationReasonError,
  MAX_CANCELLATION_REASON_LENGTH,
  normalizeCancellationReason,
} from '../src/domain/cancellation.js';
import { InvalidTransitionError } from '../src/domain/transitions.js';
import { PaymentNotFoundError } from '../src/domain/errors.js';
import { PaymentService } from '../src/service/payment-service.js';

const REASON = 'Customer asked to cancel before capture';

/** Builds a service whose audit lines are captured instead of discarded. */
function serviceWithAudit(): { service: PaymentService; lines: string[] } {
  const lines: string[] = [];
  return { service: new PaymentService((line) => lines.push(line)), lines };
}

describe('normalizeCancellationReason', () => {
  it('trims surrounding whitespace', () => {
    expect(normalizeCancellationReason('   duplicated charge   ')).toBe('duplicated charge');
  });

  it('collapses internal whitespace runs', () => {
    expect(normalizeCancellationReason('duplicated    charge')).toBe('duplicated charge');
  });

  it('rejects a missing reason', () => {
    expect(() => normalizeCancellationReason(undefined)).toThrow(InvalidCancellationReasonError);
    expect(() => normalizeCancellationReason(null)).toThrow(InvalidCancellationReasonError);
  });

  it('rejects a blank reason', () => {
    expect(() => normalizeCancellationReason('')).toThrow(InvalidCancellationReasonError);
    expect(() => normalizeCancellationReason('    ')).toThrow(InvalidCancellationReasonError);
  });

  it('accepts a reason at the maximum length', () => {
    const atLimit = 'x'.repeat(MAX_CANCELLATION_REASON_LENGTH);
    expect(normalizeCancellationReason(atLimit)).toHaveLength(MAX_CANCELLATION_REASON_LENGTH);
  });

  it('rejects a reason over the maximum length', () => {
    const tooLong = 'x'.repeat(MAX_CANCELLATION_REASON_LENGTH + 1);
    expect(() => normalizeCancellationReason(tooLong)).toThrow(InvalidCancellationReasonError);
  });
});

describe('PaymentService.cancelPayment', () => {
  it('cancels a pending payment and stores the normalized reason', () => {
    const service = new PaymentService();
    service.createPayment('pay-1');

    const cancelled = service.cancelPayment('pay-1', `  ${REASON}  `);

    expect(cancelled.status).toBe('CANCELLED');
    expect(cancelled.cancellationReason).toBe(REASON);
    expect(service.getPayment('pay-1').status).toBe('CANCELLED');
  });

  it('rejects cancelling an unknown payment', () => {
    const service = new PaymentService();
    expect(() => service.cancelPayment('missing', REASON)).toThrow(PaymentNotFoundError);
  });

  it('rejects a cancellation without a reason', () => {
    const service = new PaymentService();
    service.createPayment('pay-2');
    expect(() => service.cancelPayment('pay-2', '   ')).toThrow(InvalidCancellationReasonError);
    expect(service.getPayment('pay-2').status).toBe('PENDING');
  });

  it.each([
    ['APPROVED', 'APPROVED'],
    ['DECLINED', 'DECLINED'],
  ])('rejects cancelling a %s payment', (_label, providerStatus) => {
    const service = new PaymentService();
    service.createPayment('pay-3');
    service.applyProviderUpdate('pay-3', providerStatus);

    expect(() => service.cancelPayment('pay-3', REASON)).toThrow(InvalidTransitionError);
    expect(service.getPayment('pay-3').status).toBe(providerStatus);
  });

  it('rejects cancelling a REVERSED payment', () => {
    const service = new PaymentService();
    service.createPayment('pay-4');
    service.applyProviderUpdate('pay-4', 'APPROVED');
    service.applyProviderUpdate('pay-4', 'REVERSED');

    expect(() => service.cancelPayment('pay-4', REASON)).toThrow(InvalidTransitionError);
    expect(service.getPayment('pay-4').status).toBe('REVERSED');
  });

  it('is idempotent when repeated with the same reason', () => {
    const { service, lines } = serviceWithAudit();
    service.createPayment('pay-5');

    const first = service.cancelPayment('pay-5', REASON);
    const second = service.cancelPayment('pay-5', `${REASON}   `);

    expect(second).toEqual(first);
    expect(service.getPayment('pay-5').cancellationReason).toBe(REASON);
    expect(lines).toHaveLength(1);
  });

  it('reports a conflict when repeated with a different reason', () => {
    const service = new PaymentService();
    service.createPayment('pay-6');
    service.cancelPayment('pay-6', REASON);

    expect(() => service.cancelPayment('pay-6', 'a different reason')).toThrow(
      CancellationConflictError,
    );
    expect(service.getPayment('pay-6').cancellationReason).toBe(REASON);
  });

  it('never writes the full reason to the audit log', () => {
    const { service, lines } = serviceWithAudit();
    const sensitive = 'Cardholder Jane Doe called from +51 999 999 999 to cancel';
    service.createPayment('pay-7');

    service.cancelPayment('pay-7', sensitive);

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('pay-7');
    expect(lines[0]).not.toContain(sensitive);
    expect(lines[0]).not.toContain('999 999 999');
    expect(lines[0]).toContain(`len=${sensitive.length}`);
  });

  it('keeps a cancelled payment out of further provider transitions', () => {
    const service = new PaymentService();
    service.createPayment('pay-8');
    service.cancelPayment('pay-8', REASON);

    expect(() => service.applyProviderUpdate('pay-8', 'APPROVED')).toThrow(InvalidTransitionError);
    expect(service.getPayment('pay-8').status).toBe('CANCELLED');
  });
});

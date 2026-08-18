import { describe, expect, it } from 'vitest';
import { PaymentService } from '../src/service/payment-service.js';
import { PaymentNotFoundError } from '../src/domain/errors.js';
import { InvalidTransitionError } from '../src/domain/transitions.js';

describe('PaymentService', () => {
  it('creates a payment in PENDING status', () => {
    const service = new PaymentService();
    const payment = service.createPayment('pay-1');
    expect(payment).toEqual({ id: 'pay-1', status: 'PENDING' });
  });

  it('retrieves a previously created payment', () => {
    const service = new PaymentService();
    service.createPayment('pay-1');
    expect(service.getPayment('pay-1')).toEqual({ id: 'pay-1', status: 'PENDING' });
  });

  it('throws PaymentNotFoundError when the payment does not exist', () => {
    const service = new PaymentService();
    expect(() => service.getPayment('missing')).toThrow(PaymentNotFoundError);
  });

  it('applies a provider update, normalizing the raw status', () => {
    const service = new PaymentService();
    service.createPayment('pay-1');
    const updated = service.applyProviderUpdate('pay-1', 'APPROVED');
    expect(updated.status).toBe('APPROVED');
  });

  it('rejects an update whose normalized status is UNKNOWN (invalid transition)', () => {
    const service = new PaymentService();
    service.createPayment('pay-1');
    expect(() => service.applyProviderUpdate('pay-1', 'NOT_A_REAL_STATUS')).toThrow(
      InvalidTransitionError,
    );
    // and the stored status is left untouched
    expect(service.getPayment('pay-1').status).toBe('PENDING');
  });

  it('throws PaymentNotFoundError when updating a payment that does not exist', () => {
    const service = new PaymentService();
    expect(() => service.applyProviderUpdate('missing', 'APPROVED')).toThrow(
      PaymentNotFoundError,
    );
  });

  describe('transition rules', () => {
    it('allows PENDING -> APPROVED', () => {
      const service = new PaymentService();
      service.createPayment('pay-1');
      expect(service.applyProviderUpdate('pay-1', 'APPROVED').status).toBe('APPROVED');
    });

    it('allows PENDING -> DECLINED', () => {
      const service = new PaymentService();
      service.createPayment('pay-1');
      expect(service.applyProviderUpdate('pay-1', 'DECLINED').status).toBe('DECLINED');
    });

    it('is idempotent when the provider repeats the same status', () => {
      const service = new PaymentService();
      service.createPayment('pay-1');
      service.applyProviderUpdate('pay-1', 'APPROVED');
      const repeated = service.applyProviderUpdate('pay-1', 'APPROVED');
      expect(repeated.status).toBe('APPROVED');
    });

    it('rejects an APPROVED -> PENDING regression', () => {
      const service = new PaymentService();
      service.createPayment('pay-1');
      service.applyProviderUpdate('pay-1', 'APPROVED');
      expect(() => service.applyProviderUpdate('pay-1', 'PENDING')).toThrow(
        InvalidTransitionError,
      );
      // the invalid attempt does not change the stored status
      expect(service.getPayment('pay-1').status).toBe('APPROVED');
    });

    it('rejects any update once a payment is DECLINED', () => {
      const service = new PaymentService();
      service.createPayment('pay-1');
      service.applyProviderUpdate('pay-1', 'DECLINED');
      expect(() => service.applyProviderUpdate('pay-1', 'APPROVED')).toThrow(
        InvalidTransitionError,
      );
    });

    it('session 1 regression: PROCESSING still normalizes to PENDING and is a no-op on a PENDING payment', () => {
      const service = new PaymentService();
      service.createPayment('pay-1');
      const updated = service.applyProviderUpdate('pay-1', 'PROCESSING');
      expect(updated.status).toBe('PENDING');
    });
  });

  describe('PAY-104: REVERSED', () => {
    it('allows APPROVED -> REVERSED (the only valid transition into REVERSED)', () => {
      const service = new PaymentService();
      service.createPayment('pay-1');
      service.applyProviderUpdate('pay-1', 'APPROVED');
      const updated = service.applyProviderUpdate('pay-1', 'REVERSED');
      expect(updated.status).toBe('REVERSED');
    });

    it('rejects PENDING -> REVERSED', () => {
      const service = new PaymentService();
      service.createPayment('pay-1');
      expect(() => service.applyProviderUpdate('pay-1', 'REVERSED')).toThrow(
        InvalidTransitionError,
      );
      expect(service.getPayment('pay-1').status).toBe('PENDING');
    });

    it('rejects DECLINED -> REVERSED and leaves the stored status untouched', () => {
      const service = new PaymentService();
      service.createPayment('pay-1');
      service.applyProviderUpdate('pay-1', 'DECLINED');
      expect(() => service.applyProviderUpdate('pay-1', 'REVERSED')).toThrow(
        InvalidTransitionError,
      );
      expect(service.getPayment('pay-1').status).toBe('DECLINED');
    });

    it('is idempotent when REVERSED is reported again', () => {
      const service = new PaymentService();
      service.createPayment('pay-1');
      service.applyProviderUpdate('pay-1', 'APPROVED');
      service.applyProviderUpdate('pay-1', 'REVERSED');
      const repeated = service.applyProviderUpdate('pay-1', 'REVERSED');
      expect(repeated.status).toBe('REVERSED');
      expect(service.getPayment('pay-1').status).toBe('REVERSED');
    });

    it('rejects any further update once a payment is REVERSED', () => {
      const service = new PaymentService();
      service.createPayment('pay-1');
      service.applyProviderUpdate('pay-1', 'APPROVED');
      service.applyProviderUpdate('pay-1', 'REVERSED');
      expect(() => service.applyProviderUpdate('pay-1', 'APPROVED')).toThrow(
        InvalidTransitionError,
      );
      expect(service.getPayment('pay-1').status).toBe('REVERSED');
    });
  });
});

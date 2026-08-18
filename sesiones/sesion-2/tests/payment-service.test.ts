import { describe, expect, it } from 'vitest';
import { PaymentService } from '../src/service/payment-service.js';
import { PaymentNotFoundError } from '../src/domain/errors.js';

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

  it('applies UNKNOWN when the raw status is not recognized', () => {
    const service = new PaymentService();
    service.createPayment('pay-1');
    const updated = service.applyProviderUpdate('pay-1', 'NOT_A_REAL_STATUS');
    expect(updated.status).toBe('UNKNOWN');
  });

  it('throws PaymentNotFoundError when updating a payment that does not exist', () => {
    const service = new PaymentService();
    expect(() => service.applyProviderUpdate('missing', 'APPROVED')).toThrow(
      PaymentNotFoundError,
    );
  });
});

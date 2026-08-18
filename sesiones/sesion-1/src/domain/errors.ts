/**
 * Base class for every typed error raised by the payment domain. Concrete
 * subclasses should set a stable `name` so callers can discriminate errors
 * without relying on `instanceof` across module boundaries when that is not
 * available (e.g. serialized errors).
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/**
 * Raised when a payment lookup does not find a matching record.
 */
export class PaymentNotFoundError extends DomainError {
  constructor(paymentId: string) {
    super(`Payment not found: ${paymentId}`);
  }
}

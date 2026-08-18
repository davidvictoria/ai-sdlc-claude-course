import { normalizeProviderStatus, type PaymentStatus } from '../domain/payment-status.js';
import { PaymentNotFoundError } from '../domain/errors.js';
import { assertValidTransition } from '../domain/transitions.js';

export interface Payment {
  readonly id: string;
  readonly status: PaymentStatus;
}

/**
 * In-memory payment service used for the training exercises. It intentionally
 * has no persistence and no network calls: state lives only in the Map for
 * the lifetime of the process.
 */
export class PaymentService {
  private readonly store = new Map<string, Payment>();

  createPayment(id: string): Payment {
    const payment: Payment = { id, status: 'PENDING' };
    this.store.set(id, payment);
    return payment;
  }

  getPayment(id: string): Payment {
    const payment = this.store.get(id);
    if (!payment) {
      throw new PaymentNotFoundError(id);
    }
    return payment;
  }

  /**
   * Applies a status update coming from the provider. The raw status is
   * normalized first, then the transition from the current status to the
   * normalized status is validated against the domain's transition rules
   * before the payment record is updated.
   *
   * Moving to the same status is idempotent (no error, no change).
   *
   * @throws InvalidTransitionError when the transition is not allowed.
   */
  applyProviderUpdate(id: string, rawStatus: string | null | undefined): Payment {
    const current = this.getPayment(id);
    const nextStatus = normalizeProviderStatus(rawStatus);
    assertValidTransition(current.status, nextStatus);

    if (nextStatus === current.status) {
      return current;
    }

    const updated: Payment = { id: current.id, status: nextStatus };
    this.store.set(id, updated);
    return updated;
  }
}

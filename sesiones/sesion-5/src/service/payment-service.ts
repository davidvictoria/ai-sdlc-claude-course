import { normalizeProviderStatus, type PaymentStatus } from '../domain/payment-status.js';
import { PaymentNotFoundError } from '../domain/errors.js';
import { assertValidTransition } from '../domain/transitions.js';
import {
  CancellationConflictError,
  describeReasonForLog,
  normalizeCancellationReason,
} from '../domain/cancellation.js';

export interface Payment {
  readonly id: string;
  readonly status: PaymentStatus;
  /** Only present once the payment has been cancelled. Kept for audit. */
  readonly cancellationReason?: string;
}

/**
 * Sink for audit lines.
 *
 * The domain does not choose where audit output goes: the caller injects it.
 * The default is a no-op so the service stays free of platform dependencies
 * and nothing is written unless the application asks for it.
 */
export type AuditLogger = (line: string) => void;

/**
 * In-memory payment service used for the training exercises. It intentionally
 * has no persistence and no network calls: state lives only in the Map for
 * the lifetime of the process.
 */
export class PaymentService {
  private readonly store = new Map<string, Payment>();
  private readonly log: AuditLogger;

  constructor(log: AuditLogger = () => undefined) {
    this.log = log;
  }

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

  /**
   * Cancels a pending payment and records why, for operational audit.
   *
   * - Only a `PENDING` payment can be cancelled; every other status is rejected
   *   by the domain transition rules.
   * - The reason is required and normalized before being stored.
   * - Cancelling again with the exact same normalized reason is idempotent.
   * - Cancelling again with a different reason is a conflict: the recorded
   *   reason is never silently overwritten.
   * - The audit line never contains the full reason.
   *
   * @throws PaymentNotFoundError when the payment does not exist.
   * @throws InvalidCancellationReasonError when the reason is missing, blank or too long.
   * @throws InvalidTransitionError when the payment is not cancellable.
   * @throws CancellationConflictError when re-cancelling with a different reason.
   */
  cancelPayment(id: string, reason: string | null | undefined): Payment {
    const current = this.getPayment(id);
    const normalizedReason = normalizeCancellationReason(reason);

    if (current.status === 'CANCELLED') {
      if (current.cancellationReason === normalizedReason) {
        return current;
      }
      throw new CancellationConflictError(id);
    }

    assertValidTransition(current.status, 'CANCELLED');

    const updated: Payment = {
      id: current.id,
      status: 'CANCELLED',
      cancellationReason: normalizedReason,
    };
    this.store.set(id, updated);
    this.log(`payment.cancelled id=${id} ${describeReasonForLog(normalizedReason)}`);
    return updated;
  }
}

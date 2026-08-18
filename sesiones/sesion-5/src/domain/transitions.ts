import type { PaymentStatus } from './payment-status.js';
import { DomainError } from './errors.js';

/**
 * Declarative map of the payment statuses each status is allowed to move
 * into. Repeating the same status (an idempotent update) is always allowed
 * and is intentionally NOT part of this map — see `assertValidTransition`.
 * UNKNOWN never appears as a value here: an incoming UNKNOWN status is
 * always rejected before this map is even consulted.
 *
 * `REVERSED` (session 4, `PAY-104`) is only reachable from `APPROVED` and is
 * itself terminal (no outgoing transitions, forward or backward). Neither
 * `PENDING` nor `DECLINED` can reach `REVERSED`.
 */
export const ALLOWED_TRANSITIONS: Readonly<Record<PaymentStatus, readonly PaymentStatus[]>> = {
  PENDING: ['APPROVED', 'DECLINED'],
  APPROVED: ['REVERSED'],
  DECLINED: [],
  REVERSED: [],
  UNKNOWN: [],
};

/**
 * Raised when a payment status transition is not allowed by
 * ALLOWED_TRANSITIONS (or targets UNKNOWN).
 */
export class InvalidTransitionError extends DomainError {
  constructor(from: PaymentStatus, to: PaymentStatus) {
    super(`Invalid payment status transition: ${from} -> ${to}`);
  }
}

/**
 * Validates a proposed payment status transition.
 *
 * - Moving to the same status is idempotent: always allowed, no error.
 * - Moving to UNKNOWN is never allowed as a transition target.
 * - Otherwise `to` must be listed in ALLOWED_TRANSITIONS[from].
 *
 * @throws InvalidTransitionError when the transition is not allowed.
 */
export function assertValidTransition(from: PaymentStatus, to: PaymentStatus): void {
  if (to === from) {
    return;
  }

  if (to === 'UNKNOWN') {
    throw new InvalidTransitionError(from, to);
  }

  const allowedTargets = ALLOWED_TRANSITIONS[from];
  if (!allowedTargets.includes(to)) {
    throw new InvalidTransitionError(from, to);
  }
}

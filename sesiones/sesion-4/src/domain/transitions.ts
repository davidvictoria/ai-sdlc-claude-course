import type { PaymentStatus } from './payment-status.js';
import { DomainError } from './errors.js';

/**
 * Declarative map of the payment statuses each status is allowed to move
 * into. Repeating the same status (an idempotent update) is always allowed
 * and is intentionally NOT part of this map — see `assertValidTransition`.
 * UNKNOWN never appears as a value here: an incoming UNKNOWN status is
 * always rejected before this map is even consulted.
 *
 * REVERSED (PAY-104) is only reachable from APPROVED, and is itself terminal:
 * its empty list of targets is what makes every outgoing transition invalid.
 * Terminality is expressed here, declaratively, and nowhere else — encoding
 * it a second time as an early guard in `assertValidTransition` would shadow
 * the idempotency rule (`to === from`) that every status shares.
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
 * The order of these rules is part of the contract:
 *
 * - Moving to the same status is idempotent: always allowed, no error. This
 *   is checked FIRST, so it holds for every status without exception —
 *   including terminal ones like DECLINED and REVERSED.
 * - Moving to UNKNOWN is never allowed as a transition target.
 * - Otherwise `to` must be listed in ALLOWED_TRANSITIONS[from]. Terminal
 *   statuses have an empty list, which is what rejects every real transition
 *   out of them (e.g. REVERSED -> APPROVED).
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

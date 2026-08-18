import { DomainError } from './errors.js';

/**
 * Maximum length allowed for a cancellation reason.
 *
 * Product decision recorded during PAY-105: operations needs enough room for a
 * short sentence, not a free-form note. The limit is applied after
 * normalization.
 */
export const MAX_CANCELLATION_REASON_LENGTH = 200;

/**
 * Raised when a cancellation reason is missing, blank, or too long.
 */
export class InvalidCancellationReasonError extends DomainError {
  constructor(detail: string) {
    super(`Invalid cancellation reason: ${detail}`);
  }
}

/**
 * Raised when an already cancelled payment is cancelled again with a different
 * reason.
 *
 * Product decision recorded during PAY-105: repeating the exact same
 * cancellation is idempotent, but changing the recorded reason afterwards is a
 * conflict rather than a silent overwrite, because the reason is kept for
 * operational audit.
 */
export class CancellationConflictError extends DomainError {
  constructor(paymentId: string) {
    super(`Payment ${paymentId} is already cancelled with a different reason`);
  }
}

/**
 * Normalizes a cancellation reason: collapses surrounding whitespace and
 * rejects values that are missing, blank, or longer than the agreed limit.
 *
 * @throws InvalidCancellationReasonError when the reason is not usable.
 */
export function normalizeCancellationReason(reason: string | null | undefined): string {
  if (typeof reason !== 'string') {
    throw new InvalidCancellationReasonError('a reason is required');
  }

  const normalized = reason.trim().replace(/\s+/g, ' ');

  if (normalized.length === 0) {
    throw new InvalidCancellationReasonError('a reason is required');
  }

  if (normalized.length > MAX_CANCELLATION_REASON_LENGTH) {
    throw new InvalidCancellationReasonError(
      `maximum length is ${MAX_CANCELLATION_REASON_LENGTH} characters`,
    );
  }

  return normalized;
}

/**
 * Builds the audit-safe representation of a reason for logs.
 *
 * The full reason is never logged: operations may paste customer-identifying
 * details into it, so only its length and a short prefix are exposed.
 */
export function describeReasonForLog(reason: string): string {
  const PREVIEW_LENGTH = 12;
  const preview = reason.slice(0, PREVIEW_LENGTH);
  const ellipsis = reason.length > PREVIEW_LENGTH ? '…' : '';
  return `len=${reason.length} preview="${preview}${ellipsis}"`;
}

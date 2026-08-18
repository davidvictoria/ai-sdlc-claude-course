/**
 * Canonical payment status used across the service, independent of whatever
 * vocabulary the upstream provider uses in its notifications.
 */
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'REVERSED' | 'UNKNOWN';

/**
 * Normalizes a raw status string coming from the payment provider into a
 * PaymentStatus known by the domain.
 *
 * Rules:
 * - The comparison is exact and case-sensitive against the upper-cased,
 *   trimmed input (i.e. the raw value must already be uppercase once trimmed).
 * - Empty string, null, undefined or any unrecognized value maps to UNKNOWN.
 */
export function normalizeProviderStatus(raw: string | null | undefined): PaymentStatus {
  if (raw === null || raw === undefined) {
    return 'UNKNOWN';
  }

  const trimmed = raw.trim();

  if (trimmed === '') {
    return 'UNKNOWN';
  }

  switch (trimmed) {
    case 'PENDING':
      return 'PENDING';
    case 'PROCESSING':
      return 'PENDING';
    case 'APPROVED':
      return 'APPROVED';
    case 'DECLINED':
      return 'DECLINED';
    case 'REVERSED':
      return 'REVERSED';
    default:
      return 'UNKNOWN';
  }
}

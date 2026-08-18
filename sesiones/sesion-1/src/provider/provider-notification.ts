import type { PaymentService } from '../service/payment-service.js';
import type { PaymentStatus } from '../domain/payment-status.js';

/**
 * Shape of a notification sent by the payment provider. `status` is the raw,
 * unnormalized value as received from the provider (not yet a PaymentStatus).
 */
export interface ProviderNotification {
  readonly paymentId: string;
  readonly status: string;
  readonly occurredAt: string;
}

export interface ProviderNotificationResult {
  readonly paymentId: string;
  readonly status: PaymentStatus;
}

/**
 * Entry point for provider webhooks. Delegates normalization and persistence
 * to the PaymentService and returns a minimal, stable response payload.
 */
export function handleProviderNotification(
  service: PaymentService,
  payload: ProviderNotification,
): ProviderNotificationResult {
  const payment = service.applyProviderUpdate(payload.paymentId, payload.status);
  return { paymentId: payment.id, status: payment.status };
}

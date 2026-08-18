# Flujo de pagos

Este documento describe cómo viaja una actualización de estado desde el
proveedor de pagos (ficticio) hasta la respuesta que devuelve el servicio.

## Flujo entre capas

```
Proveedor de pagos (webhook)
        │
        │  ProviderNotification { paymentId, status, occurredAt }
        ▼
provider/provider-notification.ts
  handleProviderNotification(service, payload)
        │
        │  delega en el servicio
        ▼
service/payment-service.ts
  PaymentService.applyProviderUpdate(id, rawStatus)
        │
        │  normaliza el status crudo del proveedor
        ▼
domain/payment-status.ts
  normalizeProviderStatus(raw) -> PaymentStatus
        │
        │  el resultado se guarda como el nuevo estado del pago
        ▼
PaymentService (store en memoria) actualiza el registro
        │
        ▼
handleProviderNotification devuelve { paymentId, status }
```

Cada capa tiene una responsabilidad única:

- **`provider/provider-notification.ts`**: es el punto de entrada de las
  notificaciones del proveedor. No conoce reglas de negocio, solo adapta el
  payload externo y delega en el servicio.
- **`service/payment-service.ts`**: orquesta el ciclo de vida del pago
  (creación, consulta, actualización). Es el único lugar que toca el store en
  memoria.
- **`domain/payment-status.ts`**: contiene la única fuente de verdad para
  traducir el vocabulario del proveedor al vocabulario interno del dominio.

## Estados que el proveedor puede enviar

El proveedor de pagos ficticio puede notificar cualquiera de estos valores en
el campo `status` de un `ProviderNotification`:

| Valor crudo del proveedor | Significado                                   |
| -------------------------- | ---------------------------------------------- |
| `PENDING`                  | El pago fue creado y está esperando resolución |
| `PROCESSING`                | El proveedor está procesando el pago           |
| `APPROVED`                  | El pago fue aprobado                           |
| `DECLINED`                  | El pago fue rechazado                          |
| (vacío, `null`, `undefined`, u otro valor no listado) | No reconocido |

## Tabla de mapeo interno (`normalizeProviderStatus`)

`normalizeProviderStatus` traduce el valor crudo anterior a un
`PaymentStatus` interno:

| Valor crudo (trim + comparación exacta en mayúsculas) | `PaymentStatus` resultante |
| ------------------------------------------------------- | ---------------------------- |
| `PENDING`                                                | `PENDING`                    |
| `APPROVED`                                               | `APPROVED`                   |
| `DECLINED`                                               | `DECLINED`                   |
| `''`, `null`, `undefined`, o cualquier otro valor no listado arriba | `UNKNOWN` |

## Estados internos del dominio

```
type PaymentStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'UNKNOWN';
```

Un pago nuevo (`PaymentService.createPayment`) siempre inicia en `PENDING`.

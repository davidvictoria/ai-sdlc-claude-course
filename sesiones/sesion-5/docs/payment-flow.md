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
        │  valida que la transición (status actual -> status normalizado)
        │  esté permitida
        ▼
domain/transitions.ts
  assertValidTransition(from, to)
        │  transición inválida -> lanza InvalidTransitionError (no cambia nada)
        │  transición válida    -> continúa
        ▼
PaymentService (store en memoria) actualiza el registro
  (si `to === from`, es idempotente: no hay error ni cambio)
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
- **`domain/transitions.ts`**: contiene la única fuente de verdad sobre qué
  cambios de estado son válidos (`ALLOWED_TRANSITIONS`).

## Estados que el proveedor puede enviar

El proveedor de pagos ficticio puede notificar cualquiera de estos valores en
el campo `status` de un `ProviderNotification`:

| Valor crudo del proveedor | Significado                                   |
| -------------------------- | ---------------------------------------------- |
| `PENDING`                  | El pago fue creado y está esperando resolución |
| `PROCESSING`                | El proveedor está procesando el pago           |
| `APPROVED`                  | El pago fue aprobado                           |
| `DECLINED`                  | El pago fue rechazado                          |
| `REVERSED`                  | Un pago aprobado fue revertido (sesión 4, `PAY-104`) |
| (vacío, `null`, `undefined`, u otro valor no listado) | No reconocido |

## Tabla de mapeo interno (`normalizeProviderStatus`)

`normalizeProviderStatus` traduce el valor crudo anterior a un
`PaymentStatus` interno:

| Valor crudo (trim + comparación exacta en mayúsculas) | `PaymentStatus` resultante |
| ------------------------------------------------------- | ---------------------------- |
| `PENDING`                                                | `PENDING`                    |
| `PROCESSING`                                             | `PENDING`                    |
| `APPROVED`                                               | `APPROVED`                   |
| `DECLINED`                                               | `DECLINED`                   |
| `REVERSED`                                               | `REVERSED`                   |
| `''`, `null`, `undefined`, o cualquier otro valor no listado arriba | `UNKNOWN` |

> Nota de la sesión 1: originalmente `PROCESSING` no estaba mapeado y caía
> en `UNKNOWN` por el `default` del switch, a pesar de que la tabla de
> "estados que el proveedor puede enviar" ya lo listaba. El fix de la
> sesión 1 agrega el caso `PROCESSING -> PENDING`.

## Estados internos del dominio

```
type PaymentStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'REVERSED' | 'UNKNOWN';
```

Un pago nuevo (`PaymentService.createPayment`) siempre inicia en `PENDING`.
`REVERSED` se agregó en la sesión 4 (`PAY-104`); ver la sección siguiente.

## Reglas de transición (`ALLOWED_TRANSITIONS`)

Desde la sesión 2, `PaymentService.applyProviderUpdate` ya no sobrescribe el
estado sin más: valida que la transición del estado actual al estado
normalizado esté permitida. Si no lo está, lanza `InvalidTransitionError`
(sin modificar el estado almacenado). La firma pública de
`applyProviderUpdate` no cambia.

| Estado actual (`from`) | Puede pasar a (`to`)      | Notas                                   |
| ------------------------ | --------------------------- | ---------------------------------------- |
| `PENDING`                 | `APPROVED`, `DECLINED`      | Únicas transiciones "hacia adelante"     |
| `APPROVED`                 | `REVERSED`                   | Única forma de llegar a `REVERSED` (sesión 4, `PAY-104`) |
| `DECLINED`                 | (ninguno)                    | Estado terminal                          |
| `REVERSED`                 | (ninguno)                    | Estado terminal (sesión 4, `PAY-104`)    |
| cualquiera                | mismo estado (`from === to`) | Idempotente: no error, no cambio         |
| cualquiera                | `UNKNOWN`                    | Siempre inválido como destino de una transición |

Ejemplos de transiciones inválidas (lanzan `InvalidTransitionError`):
`APPROVED -> PENDING`, `APPROVED -> DECLINED`, `DECLINED -> PENDING`,
`DECLINED -> APPROVED`, `PENDING -> REVERSED`, `DECLINED -> REVERSED`,
`REVERSED -> APPROVED`, `REVERSED -> PENDING`, `REVERSED -> DECLINED`,
cualquier `-> UNKNOWN` (por ejemplo, si el proveedor envía un valor no
reconocido sobre un pago existente).

### `REVERSED` (sesión 4, `PAY-104`)

- `APPROVED -> REVERSED` es la única transición válida hacia `REVERSED`.
  `PENDING -> REVERSED` y `DECLINED -> REVERSED` son inválidas y lanzan
  `InvalidTransitionError`.
- `REVERSED` es un estado terminal: ninguna transición sale de él, incluida
  `REVERSED -> APPROVED`.
- Repetir `REVERSED` sobre un pago que ya está en `REVERSED` es idempotente
  (no lanza error, no cambia el registro), igual que cualquier otra
  transición `from === to`.
- Este estado fue especificado en la sesión 3 (`PAY-103`), implementado y
  verificado en la sesión 4 (`PAY-104`), y llega ya resuelto a la sesión 5:
  el capstone `PAY-105` construye sobre un dominio donde `REVERSED` existe y
  funciona, no lo modifica.

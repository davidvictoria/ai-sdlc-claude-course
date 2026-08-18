# PAY-105 — Cancelación de un pago pendiente con razón de auditoría

> Especificación aprobada. Producida con la skill `/payment-change` a partir del
> ticket recuperado por MCP y de las decisiones resueltas por el Product/Scope
> owner del equipo.

## Problema

Operaciones necesita cancelar un pago que todavía está pendiente y dejar
registrada la razón, para poder auditar después por qué se canceló.

## Alcance

- Cancelar un pago en estado `PENDING`.
- Registrar y conservar una razón de cancelación.
- Emitir una línea de auditoría que no exponga la razón completa.

## Fuera de alcance

- Cancelar pagos ya aprobados, declinados o revertidos.
- Reembolsos, notificaciones al cliente o cualquier integración externa.
- Persistencia real: el servicio sigue siendo en memoria.
- Cambiar el contrato de `applyProviderUpdate` o de `handleProviderNotification`.

## Hechos verificados en el repositorio

| Hecho | Dónde se comprobó |
|---|---|
| El dominio ya modela transiciones explícitas | `src/domain/transitions.ts` |
| Una transición inválida lanza un error tipado que extiende `DomainError` | `src/domain/errors.ts` |
| Repetir el mismo estado ya es idempotente para los estados existentes | `assertValidTransition` |
| `REVERSED` existe y es terminal | `ALLOWED_TRANSITIONS` |
| El repositorio prohíbe agregar dependencias | `CLAUDE.md` |

## Decisiones humanas

Ninguna de estas dos se infiere del código: las resolvió el Product/Scope owner.

| Decisión | Resolución | Motivo registrado |
|---|---|---|
| Longitud máxima de la razón | 200 caracteres, aplicados tras normalizar | Alcanza para una frase corta; evita notas libres con datos del cliente |
| Qué hacer si el pago ya está cancelado y llega otra razón | Conflicto de dominio, no sobrescritura | La razón se conserva para auditoría; sobrescribirla en silencio destruye la evidencia |

## Reglas

1. Solo un pago en `PENDING` puede pasar a `CANCELLED`.
2. `APPROVED`, `DECLINED` y `REVERSED` no son cancelables.
3. `CANCELLED` es terminal: no admite transiciones de salida.
4. La razón es obligatoria. Se normaliza recortando los extremos y colapsando
   secuencias de espacios.
5. Una razón vacía tras normalizar es inválida.
6. Una razón de más de 200 caracteres tras normalizar es inválida.
7. Repetir la cancelación con la misma razón normalizada es idempotente: no
   lanza error, no modifica el registro y no emite una segunda línea de auditoría.
8. Repetir la cancelación con una razón distinta lanza `CancellationConflictError`
   y conserva la razón original.
9. La línea de auditoría registra el identificador del pago, la longitud de la
   razón y un prefijo corto; nunca la razón completa.
10. `CANCELLED` no forma parte del vocabulario del proveedor: la cancelación es
    una acción interna, no una notificación entrante, por lo que
    `normalizeProviderStatus` no lo reconoce.

## Criterios de aceptación

1. `cancelPayment` sobre un pago `PENDING` con razón válida devuelve el pago en
   `CANCELLED` con la razón normalizada.
2. Cancelar un pago inexistente lanza `PaymentNotFoundError`.
3. Cancelar un pago `APPROVED`, `DECLINED` o `REVERSED` lanza
   `InvalidTransitionError` y no modifica el pago.
4. Una razón ausente, vacía o solo con espacios lanza
   `InvalidCancellationReasonError` y no modifica el pago.
5. Una razón de más de 200 caracteres lanza `InvalidCancellationReasonError`.
6. Repetir la cancelación con la misma razón es idempotente y no duplica la
   línea de auditoría.
7. Repetir la cancelación con otra razón lanza `CancellationConflictError` y la
   razón original se conserva.
8. La línea de auditoría no contiene la razón completa.
9. Un pago `CANCELLED` rechaza cualquier actualización posterior del proveedor.
10. No se agregan dependencias y las firmas públicas existentes no cambian.

## Casos límite

- Razón exactamente de 200 caracteres: válida.
- Razón con espacios internos múltiples: se colapsan antes de comparar, de modo
  que `"pago  duplicado"` y `"pago duplicado"` son la misma razón para efectos de
  idempotencia.
- Razón con datos personales: nunca llega completa al log.

## Evidencia de finalización

- `npm run verify` en código 0.
- Pruebas positivas, negativas por cada estado no cancelable, de normalización,
  de idempotencia, de conflicto y de no filtración en el log.
- `docs/payment-flow.md` actualizado con `CANCELLED`.

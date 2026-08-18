# PAY-104 — Implementar el estado REVERSED

- Estado: `Plan ready` (spec aprobada, pendiente de review de la
  implementación candidata).
- Generado por: skill `/payment-change PAY-104` (sesión 3).
- Depende de: `PAY-103` (especificación del estado `REVERSED`, sesión 3).
- Continuidad: la implementación candidata fue escrita por otro integrante
  del equipo. Este documento es el contrato contra el que se revisa, no una
  descripción de lo que el código hace.

## Problema

El dominio de pagos reconoce hoy `PENDING`, `APPROVED`, `DECLINED` y
`UNKNOWN`. No existe forma de representar que un pago ya aprobado fue
revertido (por ejemplo, por una disputa o una instrucción del proveedor
posterior a la aprobación). El equipo de operaciones necesita que el
dominio distinga "aprobado" de "aprobado y luego revertido" para poder
razonar sobre el estado real del pago aguas abajo.

## Alcance

- Agregar `REVERSED` a `PaymentStatus` (`src/domain/payment-status.ts`).
- Mapear el valor crudo del proveedor `REVERSED` a `PaymentStatus.REVERSED`
  en `normalizeProviderStatus`.
- Extender `ALLOWED_TRANSITIONS` (`src/domain/transitions.ts`) para que
  `APPROVED -> REVERSED` sea válida.
- Mantener el comportamiento existente de `assertValidTransition` para
  todas las transiciones ya cubiertas por `PAY-102`/sesión 2
  (`PENDING -> APPROVED`, `PENDING -> DECLINED`, idempotencia, rechazo de
  `UNKNOWN` como destino).
- Actualizar `docs/payment-flow.md` con la tabla de transiciones extendida.

## Fuera de alcance

- Cualquier flujo de reembolso de dinero real, integración con el
  proveedor de pagos o notificación a terceros. Este cambio es
  exclusivamente de dominio (tipo y reglas de transición).
- Permitir revertir un pago `PENDING` o `DECLINED`. Solo un pago
  `APPROVED` puede revertirse.
- Cambiar la firma pública de `PaymentService.applyProviderUpdate` o de
  `handleProviderNotification`.
- Agregar dependencias de producción.
- Rediseñar `PaymentStatus` como una máquina de estados con más metadatos
  (por ejemplo, motivo de reversión, timestamp). Eso queda para un cambio
  futuro si el negocio lo pide.

## Reglas de transición

| Desde (`from`) | Hacia (`to`) | ¿Válida? | Motivo |
| --- | --- | --- | --- |
| `APPROVED` | `REVERSED` | Sí | Única transición válida hacia `REVERSED`. |
| `PENDING` | `REVERSED` | No | Un pago debe estar `APPROVED` antes de poder revertirse. |
| `DECLINED` | `REVERSED` | No | Un pago rechazado nunca fue aprobado; no hay nada que revertir. |
| `REVERSED` | cualquier otro estado | No | `REVERSED` es terminal, igual que `DECLINED`. |
| `REVERSED` | `REVERSED` | Sí (idempotente) | Ver "Idempotencia" abajo. No es un error ni produce cambio. |

`REVERSED` no aparece como destino de ninguna otra transición fuera de
`APPROVED -> REVERSED`. No se agregan transiciones nuevas para `PENDING`
ni `DECLINED` en este cambio.

## Idempotencia

La regla de idempotencia introducida en la sesión 2
(`to === from` siempre es válida y no produce cambio) se extiende sin
excepción a `REVERSED`. Repetir `REVERSED` sobre un pago que ya está
`REVERSED` (por ejemplo, una notificación duplicada del proveedor) **debe**
comportarse igual que repetir `APPROVED` sobre un pago `APPROVED`: no lanza
error, no modifica el registro almacenado, y devuelve el pago con su
estado actual (`REVERSED`). Esto no es un caso especial de `REVERSED`; es
la regla general de idempotencia que ya aplica a todos los estados, y
`REVERSED` no debe ser una excepción a esa regla.

## Errores

Toda transición inválida (incluidas las tres filas "No" de la tabla
anterior) lanza `InvalidTransitionError` (extiende `DomainError`) con
`from` y `to` en el mensaje, siguiendo el formato ya establecido:
`Invalid payment status transition: ${from} -> ${to}`. El estado
almacenado no se modifica cuando se lanza este error.

## Criterios de aceptación

1. `APPROVED -> REVERSED` no lanza error y el pago queda en `REVERSED`.
2. `PENDING -> REVERSED` lanza `InvalidTransitionError` y el pago
   permanece en `PENDING`.
3. `DECLINED -> REVERSED` lanza `InvalidTransitionError` y el pago
   permanece en `DECLINED`. Este caso debe estar cubierto por una prueba
   explícita, no solo inferido de que `DECLINED` es terminal.
4. `REVERSED -> APPROVED`, `REVERSED -> PENDING` y `REVERSED -> DECLINED`
   lanzan `InvalidTransitionError` (estado terminal).
5. **`REVERSED -> REVERSED` es idempotente: no lanza error, no modifica el
   pago almacenado y el pago devuelto tiene `status: 'REVERSED'`.** Este
   criterio no es opcional ni un caso límite secundario: es la misma regla
   de idempotencia que ya rige `PENDING -> PENDING`, `APPROVED -> APPROVED`
   y `DECLINED -> DECLINED`, aplicada a `REVERSED`. Una implementación que
   trate `REVERSED` como un caso especial y la excluya de la idempotencia
   no cumple la spec, aunque el resto de las transiciones sea correcto.
6. `InvalidTransitionError` incluye `from` y `to` en el mensaje para las
   transiciones inválidas de `REVERSED` descritas arriba.
7. `normalizeProviderStatus('REVERSED')` devuelve `'REVERSED'` (case
   sensitive, con trim, igual que el resto de los valores reconocidos).
8. Ninguna transición ya cubierta por sesión 2
   (`PENDING -> APPROVED`, `PENDING -> DECLINED`, idempotencia de
   `PENDING`/`APPROVED`/`DECLINED`, rechazo de `-> UNKNOWN`) cambia de
   comportamiento.
9. La firma pública de `PaymentService.applyProviderUpdate` y de
   `handleProviderNotification` no cambia.
10. No se agregan dependencias de producción.
11. `docs/payment-flow.md` refleja la tabla de transiciones extendida con
    `REVERSED`.

## Casos límite

- **Reversión duplicada por reintento del proveedor**: el proveedor puede
  reenviar una notificación `REVERSED` para un pago que ya quedó
  `REVERSED` (reintentos de webhook, at-least-once delivery). Este es
  exactamente el caso del criterio 5: debe ser un no-op, no un error.
- **Reversión sin aprobación previa**: si el proveedor envía `REVERSED`
  para un pago `PENDING` o `DECLINED` (por ejemplo, por un error de
  integración del lado del proveedor), el sistema debe rechazar la
  transición y conservar el estado real del pago, no asumir que la
  intención era razonable.
- **Valor crudo no reconocido después de `REVERSED`**: si tras revertir un
  pago el proveedor envía un valor no mapeado, `normalizeProviderStatus`
  lo traduce a `UNKNOWN` y `assertValidTransition` lo rechaza igual que
  para cualquier otro estado (`REVERSED -> UNKNOWN` es inválido, cubierto
  por la regla general de `-> UNKNOWN`, no por una regla especial de
  `REVERSED`).

## Evidencia de finalización esperada

Antes de aceptar `PAY-104` como `Done with evidence`:

- `npm run verify` (`typecheck` + `lint` + `test`) termina en código 0.
- Existen pruebas automatizadas para los criterios de aceptación 1 a 7
  (positivas y negativas), incluyendo explícitamente el criterio 3
  (`DECLINED -> REVERSED`) y el criterio 5 (`REVERSED -> REVERSED`
  idempotente).
- `docs/payment-flow.md` está actualizado (criterio 11).
- El diff no toca rutas fuera de `src/domain/`, `tests/` y `docs/`, no
  agrega dependencias y no modifica la firma pública de
  `applyProviderUpdate` ni de `handleProviderNotification`.
- Una revisión independiente (`payment-reviewer`) confirma que cada
  criterio de aceptación está mapeado a implementación y a una prueba, y
  reporta explícitamente qué criterios verificó y cuáles no pudo verificar
  por sí mismo (por ejemplo, no puede ejecutar `npm run verify`: eso lo
  demuestra el gate determinístico, no el reviewer).

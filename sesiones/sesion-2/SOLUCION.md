# Solución de referencia — sesión 2

Guía del practitioner. **No se entrega a los participantes antes del
debrief.** Se usa para preparar la sesión, rescatar a un equipo atascado y
conducir el debrief con material concreto en pantalla.

## 1. Qué contiene esta rama

| Archivo | Qué resuelve |
|---|---|
| `src/domain/transitions.ts` | Nuevo: `ALLOWED_TRANSITIONS`, `InvalidTransitionError` y `assertValidTransition` |
| `src/service/payment-service.ts` | `applyProviderUpdate` valida la transición antes de escribir; misma firma pública |
| `src/index.ts` | Exporta `ALLOWED_TRANSITIONS` e `InvalidTransitionError` |
| `tests/transitions.test.ts` | Nuevo: cada transición válida, cada inválida, idempotencia, mensaje del error |
| `tests/payment-service.test.ts` | Transiciones a través del servicio y regresión de la sesión 1 (`PROCESSING`) |
| `docs/payment-flow.md` | Paso `assertValidTransition` en el diagrama y tabla de reglas de transición |

`src/domain/payment-status.ts` y `src/provider` **no cambian**.

## 2. El brief que entregas en clase

No está en ningún archivo visible para los participantes. Entrégalo en
pantalla o en papel, tal cual, sin aclaraciones:

```text
Brief PAY-102 (ops): "Estamos viendo pagos que pasan de APPROVED a PENDING
cuando el proveedor reenvía notificaciones viejas. Eso no debería pasar.
Necesitamos que el servicio no acepte cambios de estado que no tienen
sentido. Urgente para el cierre de mes."
```

Es corto a propósito. Deja fuera todo lo que la tabla siguiente lista: si
un equipo no te pregunta, asume, y eso es lo que el debrief pone en
evidencia. Cuando pregunten, responde con la columna "Respuesta en esta
solución". Si un equipo propone una respuesta distinta y la defiende
(por ejemplo, permitir `APPROVED -> DECLINED` por una disputa), acéptala
como decisión de producto documentada; la solución de referencia es una
de las respuestas válidas, no la única.

## 3. Las decisiones que el brief no toma

El brief que entregas en clase es corto a propósito. Estas son las
decisiones que la solución de referencia toma, y que cada equipo debió
preguntarte antes de implementar. Si el brief que uses difiere, ajusta la
solución o el brief, no ambos a medias.

| Decisión | Respuesta en esta solución | Dónde se ve |
|---|---|---|
| ¿Qué transiciones son válidas? | Solo `PENDING -> APPROVED` y `PENDING -> DECLINED` | `ALLOWED_TRANSITIONS` |
| ¿`APPROVED` y `DECLINED` son terminales? | Sí, no admiten ninguna transición de salida | Listas vacías en el mapa |
| ¿Qué pasa si el proveedor repite el mismo estado? | Idempotente: no error, no cambio, devuelve el pago actual | Primer `if` de `assertValidTransition` |
| ¿Y si el proveedor envía un valor no reconocido? | `UNKNOWN` nunca es destino válido; lanza error y no escribe | Segundo `if` de `assertValidTransition` |
| ¿Qué error se lanza? | `InvalidTransitionError extends DomainError`, con `from -> to` en el mensaje | `transitions.ts` |
| ¿Cambia la firma de `applyProviderUpdate`? | No | `payment-service.ts` |

## 4. Qué mostrar en el debrief

1. **La lista de preguntas de cada equipo.** Antes de mirar código,
   compara cuántas de las seis decisiones de arriba preguntaron y cuántas
   asumieron. Ese es el resultado de la sesión, no el diff.
2. **`ALLOWED_TRANSITIONS` como única fuente de verdad.** Contrasta con
   equipos que codificaron las reglas como `if` encadenados dentro del
   servicio. Funciona hoy; en la sesión 4, cuando aparezca `REVERSED`, se
   nota la diferencia.
3. **La prueba de `UNKNOWN`.** En la sesión 1, `UNKNOWN` se guardaba. Ahora
   se rechaza. Muestra el test que cambió de sentido en
   `payment-service.test.ts` y pregunta si alguien lo borró en vez de
   reescribirlo.
4. **La tabla de `docs/payment-flow.md`.** La sesión 3 arranca desde este
   documento; si un equipo no lo actualizó, su siguiente sesión empieza
   con la documentación mintiendo.

## 5. Errores frecuentes

- **Implementar antes de preguntar.** El síntoma: reglas de transición
  distintas entre equipos, todas "correctas" según su propio supuesto.
- **Lanzar `Error` genérico** en vez de una subclase de `DomainError`.
  Viola una convención de `CLAUDE.md` que el agente tenía a la vista.
- **Escribir el estado y luego validar.** El pago queda modificado aunque
  se lance el error. La prueba `rejects an APPROVED -> PENDING regression`
  lo detecta porque vuelve a leer el pago.
- **Mutar el objeto `Payment`** en vez de crear uno nuevo. Los tests no lo
  atrapan, pero rompe el `readonly` de la interfaz en espíritu.
- **Debilitar el test de `UNKNOWN`** con `skip` en vez de reescribirlo.

# Solución de referencia — sesión 1

Guía del practitioner. **No se entrega a los participantes antes del
debrief.** Se usa para preparar la sesión, rescatar a quien se atasque y
conducir el debrief con material concreto en pantalla.

## 1. Qué contiene esta rama

| Archivo | Qué resuelve |
|---|---|
| `src/domain/payment-status.ts` | Agrega el caso `PROCESSING -> PENDING` en `normalizeProviderStatus` |
| `tests/payment-status.test.ts` | Prueba `maps PROCESSING to PENDING` y renombra la de `PENDING` para dejar claro que no cambia |
| `docs/payment-flow.md` | Fila `PROCESSING -> PENDING` en la tabla de mapeo y nota que explica el defecto original |

`src/service`, `src/provider` y `README.md` **no cambian**. El cambio vive
en el dominio porque es una regla de traducción del vocabulario del
proveedor, no de orquestación.

## 2. El defecto

`docs/payment-flow.md` listaba `PROCESSING` como valor que el proveedor
puede enviar, pero la tabla de mapeo y el `switch` de
`normalizeProviderStatus` no lo contemplaban, así que caía en el `default`
y el pago quedaba en `UNKNOWN`. La documentación y el código se
contradecían; el reporte de operaciones era correcto.

## 3. Qué mostrar en el debrief

1. **El diff completo** con `git diff main -- sesiones/sesion-1`. Son tres
   archivos y trece líneas. La pregunta al grupo: ¿alguien tocó más
   archivos? ¿Por qué?
2. **El plan aprobado (checkpoint 1).** Pide a un participante que muestre su
   captura de Plan Mode y qué corrigió antes de aprobar. Los planes que
   suelen necesitar corrección: no incluyen `docs/payment-flow.md`, no
   incluyen una prueba nueva, o proponen agregar `PROCESSING` al tipo
   `PaymentStatus`. Quien aprobó sin corregir nada probablemente no
   leyó el plan completo.
3. **El lugar del cambio (checkpoint 2).** Contrasta con quienes tengan un diff que
   toca `PaymentService` o el adaptador del proveedor. Funciona, pero
   duplica la traducción del vocabulario fuera de su única fuente de
   verdad.
4. **La evidencia (checkpoint 3).** Muestra la salida real de
   `npm run verify` (16 tests en esta solución frente a los 15 del inicio)
   y pregunta quién aceptó un "ya pasa" de Claude sin ejecutar el
   comando.
5. **La nota en `docs/payment-flow.md`.** Documentar el defecto original,
   no solo el estado final, es lo que permite a la sesión 2 arrancar sin
   contexto oral.

Los tres prompts del laboratorio están en el README de la sesión y son los
mismos de la demo del practitioner; la demo se hace desde `main` con
`claude --permission-mode plan`.

## 4. Errores frecuentes

- **Mapear `PROCESSING` a un estado nuevo** (`'PROCESSING'` en
  `PaymentStatus`). Amplía el tipo, obliga a tocar tests y docs de más, y
  el reporte no lo pedía. Buen momento para hablar de alcance.
- **Pasar a comparación insensible a mayúsculas** (`toUpperCase()`). Rompe
  la prueba `is case-sensitive` y cambia una regla documentada. Es el
  ejemplo de "no debilites tests existentes para hacerlos pasar".
- **Corregir solo la documentación** para que deje de listar `PROCESSING`.
  Elimina la contradicción pero no el comportamiento reportado.
- **Aceptar el resumen del agente sin ejecutar `npm run verify`.**

# Sesión 1 — Fundamentos de Claude Code

Laboratorio de práctica del curso AI-SDLC. Trabajas sobre un servicio de
pagos **ficticio** en TypeScript: sin datos reales, sin secretos, sin
llamadas de red y sin dependencias de producción. El objetivo de esta
sesión es aprender a trabajar con Claude Code sobre un repositorio que no
conoces: explorarlo, entender cómo fluye un pago, corregir un
comportamiento reportado y cerrar el cambio con evidencia.

## El caso

Operaciones reporta que algunas notificaciones del proveedor de pagos dejan
el pago en estado `UNKNOWN`, aunque el valor que envía el proveedor está
documentado como válido en `docs/payment-flow.md`. Nadie ha revisado
todavía dónde ocurre ni por qué. Para operaciones, un pago que el proveedor
todavía está procesando es un pago que sigue esperando resolución: no piden
un estado nuevo del dominio, piden que deje de quedar en `UNKNOWN`. Tu
equipo recibe ese reporte y tiene que llegar a un cambio verificado:
diagnóstico, corrección, prueba que lo cubra, documentación al día y
`npm run verify` en verde.

No hay más pistas en este archivo a propósito. El diagnóstico es parte del
laboratorio.

## Qué hay en esta carpeta

- `src/domain`: tipos y errores del dominio (estado del pago, errores
  tipados).
- `src/service`: `PaymentService`, con un store en memoria (sin
  persistencia real).
- `src/provider`: adaptador de notificaciones entrantes del proveedor de
  pagos (ficticio).
- `docs/payment-flow.md`: el flujo completo, capa por capa, y las tablas
  de estados. Es la fuente de verdad documental del dominio.
- `tests/`: suite de Vitest.
- `CLAUDE.md`: convenciones del repositorio y definición de "terminado".

## Preflight

Abre la terminal **dentro de esta carpeta**, no en la raíz del repositorio:

```bash
cd sesiones/sesion-1
npm run verify
claude
```

`npm run verify` encadena `typecheck`, `lint` y `test` y debe terminar en
verde antes de empezar. Si no lo hace, avisa al practitioner antes de
continuar. Las dependencias ya están instaladas si ejecutaste `npm ci` en
la raíz del repositorio durante la preparación.

## Cómo trabajar la sesión

1. **Explora antes de cambiar.** Pide a Claude Code que te explique cómo
   viaja una notificación del proveedor hasta la respuesta del servicio, y
   contrasta lo que dice con `docs/payment-flow.md` y con el código. Si
   algo no coincide, anótalo.
2. **Reproduce el reporte.** Antes de tocar código, escribe un test que
   falle con el comportamiento actual. Ese test es tu evidencia de que
   entendiste el problema.
3. **Corrige en el lugar correcto.** Un cambio de dominio vive en
   `src/domain`; un cambio de orquestación, en `src/service`. Pregunta a
   Claude Code por qué propone tocar cada archivo y no aceptes un cambio
   que no puedas explicar.
4. **Documenta en el mismo cambio.** Si cambia el comportamiento del flujo
   de pagos, `docs/payment-flow.md` se actualiza junto con el código. Es
   una convención de `CLAUDE.md`, no un paso opcional.
5. **Verifica y cierra.** `npm run verify` en verde, `git status` limpio y
   un commit cuyo mensaje explique qué cambió y por qué.

Una afirmación del agente ("ya está corregido", "los tests pasan") no
sustituye la salida real del comando. Ejecútalo tú.

## Scripts disponibles

| Script      | Qué hace                                    |
| ----------- | ------------------------------------------- |
| `typecheck` | `tsc --noEmit`, sin generar artefactos      |
| `lint`      | ESLint sobre toda la carpeta                |
| `test`      | Ejecuta la suite de tests con Vitest        |
| `verify`    | `typecheck` + `lint` + `test`, en ese orden |

## Solución de referencia

No está en esta carpeta ni en esta rama. El practitioner la comparte al
cerrar la sesión, y entonces cada equipo compara su enfoque contra ella.

## Convenciones y definición de terminado

Ver [`CLAUDE.md`](./CLAUDE.md).

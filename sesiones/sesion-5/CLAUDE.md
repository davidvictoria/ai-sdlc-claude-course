# CLAUDE.md

Guía breve para trabajar en este repositorio con un agente de IA. Sesión 5:
laboratorio integrado (capstone). El dominio ya incluye `REVERSED` completo
y probado (sesiones 3-4). Construyes `PAY-105` sobre esta base.

## Alcance y gates

- Trabaja desde `sesiones/sesion-5`; limita los cambios a esta sesión.
- Trabajo y entrega individuales; el humano asume producto, calidad y aceptación.
- Workflow ready aprueba el diseño; Spec ready aprueba el contrato; Plan ready
  aprueba el plan técnico. No implementes antes de las tres aprobaciones.
- No inventes límites de la razón ni el contrato del conflicto de PAY-105:
  pregunta al humano y registra su respuesta o el estado pendiente.
- Guarda decisiones y evidencia real en `docs/workflows/ai-sdlc-team-workflow.md`,
  en los apartados que indica el README. Nunca declares
  comandos ejecutados, revisión o aprobaciones que no ocurrieron.

## Comandos

- `npm run typecheck` — `tsc --noEmit`.
- `npm run lint` — ESLint sobre esta sesión.
- `npm run test` — suite de Vitest.
- `npm run verify` — **gate único de verificación** (typecheck + lint +
  test encadenados). Cualquier cambio debe dejar `npm run verify` en verde
  antes de darse por terminado. Desde la raíz usa `npm run verify:s5`.

## Convenciones del dominio

- Los errores de dominio tipados extienden `DomainError`
  (`src/domain/errors.ts`). No lances `Error` genérico desde el dominio.
- `ALLOWED_TRANSITIONS` (`src/domain/transitions.ts`) es la única fuente de
  verdad para transiciones de estado. No dupliques una regla de transición
  en otro archivo.
- Repetir exactamente la misma transición es idempotente (no error, no
  cambio). Este patrón ya existe; síguelo para cualquier estado nuevo.
- No agregues dependencias de producción. Solo `devDependencies` (heredadas
  del workspace raíz), y solo si son estrictamente necesarias.
- No debilites tests existentes para hacerlos pasar (no borres aserciones,
  no uses `skip`/`todo` para esquivar un fallo real).
- Si cambia el comportamiento del flujo de pagos, actualiza
  `docs/payment-flow.md` en el mismo cambio.
- Código, identificadores y mensajes de commit en inglés. Documentación
  (`README.md`, `CLAUDE.md`, `docs/`) en español.
- Prohibido: datos reales, secretos, llamadas de red en el código.

## Activos disponibles en este snapshot

Están disponibles, pero tú decides cuáles usar y debes registrar la
decisión incluso si los omites (ver `docs/workflows/ai-sdlc-team-workflow.md`,
apartado «Herramientas y límites»):

- Skill `.claude/skills/payment-change/SKILL.md`: convierte una solicitud
  en una spec pendiente de aprobación humana (Spec ready) en `docs/changes/<id>-spec.md`. Se invoca
  explícitamente (`disable-model-invocation: true`).
- Agente `.claude/agents/payment-reviewer.md`: revisión independiente de
  solo lectura contra una spec aprobada. No modifica archivos.
- Hook `.claude/hooks/protect-files.mjs`: bloquea `Edit`/`Write` sobre
  rutas protegidas (`fixtures/protected/`, `.env*`, `.git/`,
  `package-lock.json`). Configurado en `.claude/settings.json`.
- Regla `.claude/rules/payments.md`: invariantes del dominio de pagos.
- MCP local `scripts/course-mcp-server.mjs`: fuente de solo lectura para
  recuperar solicitudes de cambio (`get_change_request`). Opcional; el plan
  B local equivalente es `scripts/fixtures/PAY-105-brief.md`.

## El caso `PAY-105`

Este repositorio **no** contiene la implementación de `PAY-105`: es lo que
construyes en el laboratorio siguiendo el flujo Workflow ready →
Spec ready → Plan ready → Done with evidence. No inventes el
comportamiento de `PAY-105` a partir de este archivo; el punto de partida
es la solicitud (vía MCP o `scripts/fixtures/PAY-105-brief.md`) y la
exploración del repositorio.

## Definición de "terminado" (Definition of Done)

1. `npm run verify` pasa en verde.
2. Si el comportamiento cambió, `docs/payment-flow.md` está actualizado.
3. Cada criterio está cubierto por una prueba o inspección apropiada. El
   comportamiento tiene tests positivos, negativos, límites, idempotencia,
   conflicto y regresiones; no basta con agregar un único test feliz.
4. Un humano aceptó el diff (ver `docs/workflows/ai-sdlc-team-workflow.md`,
   apartado «Pruebas y aceptación»).
5. La revisión independiente está atendida y su evidencia está registrada.
6. «Registro de avances» contiene CP1–CP3 con referencias a la evidencia
   del propio documento; «Pruebas y aceptación» contiene la decisión final. Si hay
   bloqueos, registra "devuelto con pendientes", no Done.
7. Se inspeccionaron el diff y los archivos nuevos. No se exige hacer commit
   ni tener el árbol limpio; no incluyas cambios ajenos o de otras sesiones.

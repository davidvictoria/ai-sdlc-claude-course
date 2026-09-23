# CLAUDE.md

Guía para trabajar en `sesiones/sesion-4` con un agente de IA. El README
contiene los pasos del participante. Se trabaja individualmente y por
fases, con validación por chat antes de avanzar.

## Comandos

- `npm run typecheck` — `tsc --noEmit`.
- `npm run lint` — ESLint sobre esta sesión.
- `npm run test` — suite de Vitest.
- `npm run verify` — **gate único de verificación** (typecheck + lint + test
  encadenados). Cualquier cambio debe dejar `npm run verify` en verde antes
  de darse por terminado.

Ejecuta estos comandos desde S4. Desde la raíz del monorepo, usa
`npm run verify:s4`. Reporta la salida real; nunca copies el número de
tests del README como si hubieras ejecutado la verificación.

## Convenciones

- Los errores de dominio tipados extienden `DomainError`
  (`src/domain/errors.ts`). No lances `Error` genéricos desde el dominio.
- No agregues dependencias de producción. Solo `devDependencies`, y solo si
  son estrictamente necesarias.
- No debilites tests existentes para hacerlos pasar (no borres aserciones,
  no uses `skip`/`todo` para esquivar un fallo real).
- Si cambia el comportamiento del flujo de pagos (normalización, servicio o
  transiciones), actualiza `docs/payment-flow.md` en el mismo cambio.
- Código, identificadores y mensajes de commit en inglés. Documentación
  (`README.md`, `CLAUDE.md`, `docs/`) en español.
- Prohibido: datos reales, secretos, llamadas de red en el código.

## Esta sesión: revisión independiente y controles

Esta sesión no pide escribir código de dominio desde cero. `PAY-104`
(implementación candidata del estado `REVERSED`, ver
[`docs/changes/PAY-104-spec.md`](./docs/changes/PAY-104-spec.md)) ya está en
el repositorio, escrita por otro integrante del equipo. El trabajo del
laboratorio es:

1. Completar `.claude/agents/payment-reviewer.md` (un agente de solo
   lectura: `Read`, `Glob`, `Grep`, nunca `Bash`/`Edit`/`Write`) y usarlo
   para revisar `PAY-104` contra la spec, sin confiar en la explicación de
   su autor.
2. Completar el bloque `PreToolUse` en `.claude/settings.json` (ver
   `README.md`) y confirmar que `.claude/hooks/protect-files.mjs` bloquea
   ediciones a rutas protegidas y permite las demás.
3. Corregir únicamente los hallazgos confirmados por la persona, revisar
   los criterios completos y cerrar con checks y aceptación humana.

## Alcance por fase

- Fase A: se completa `.claude/agents/payment-reviewer.md`. La revisión
  puede leer el código, las pruebas y la documentación, pero no los edita.
  Invoca al agente por nombre y comprueba la delegación. Si no puede
  ejecutarse, informa el bloqueo; no simules una revisión independiente.
- Fase B: se configura `.claude/settings.json`. El script
  `.claude/hooks/protect-files.mjs` ya está completo y no se reescribe.
  La única prueba de edición protegida se dirige al fixture sintético
  `fixtures/protected/demo.env`, con `Edit`. Tras un bloqueo se detiene:
  no se intenta escribir por Bash ni por otra vía. La prueba permitida
  usa `Edit` sobre `docs/lab-notes.md`.
- Fase C: la conversación principal corrige los hallazgos confirmados en
  `src/domain/`, `tests/` y, cuando corresponda, `docs/payment-flow.md`.
  No cambia la spec aprobada, las interfaces públicas, dependencias ni
  otras sesiones. Si un cambio necesita ampliar el alcance, lo plantea
  antes de editar.
- Los artefactos `.claude/`, las notas y el portafolio pertenecen al
  laboratorio. Se revisan aparte del diff de dominio de PAY-104; no son
  una autorización para modificar más código.
- El participante completa sus decisiones y evidencia en
  `docs/portafolio.md`. No inventes resultados, aceptación humana ni
  capturas. Una simulación del script no demuestra su integración en
  Claude Code.

Un veredicto del reviewer no reemplaza `npm run verify`, y `npm run verify`
en verde tampoco demuestra por sí solo que la spec se cumplió. Ambas
evidencias son necesarias.

## Definición de "terminado" (Definition of Done)

Para aceptar el cambio de dominio PAY-104:

1. Los 11 criterios de la spec están comprobados. Los de comportamiento
   tienen las pruebas positivas y negativas exigidas; no basta con un
   único test nuevo ni con la suite inicial en verde.
2. `npm run verify` pasa y `git diff --check -- .`, desde S4, no reporta
   problemas.
3. La revisión final de `payment-reviewer` contrasta los criterios y no
   deja bloqueantes confirmados abiertos. Declara la evidencia faltante
   y distingue la salida de checks proporcionada de sus propias acciones.
4. `docs/payment-flow.md` refleja el comportamiento, las interfaces
   públicas se conservan y no se agregan dependencias.
5. La persona revisa los archivos modificados, incluidos los nuevos, y
   registra en el portafolio su decisión explícita y la razón.

Para completar además el laboratorio, CP1 demuestra definición e
invocación real, y CP2 demuestra bloqueo y operación permitida reales.
El fixture protegido queda sin cambios. Si solo se pudo simular, la
integración sigue pendiente aunque PAY-104 pueda aceptarse.

La entrega es el portafolio individual por el canal del programa. **No se
exige commit, pull request ni un árbol de trabajo limpio.** Revisa
`git status --short` y justifica los cambios de esta sesión. Conserva el
trabajo previo de otras sesiones. Si falta evidencia, registra «no acepto
todavía» o el checkpoint pendiente y el siguiente paso concreto.

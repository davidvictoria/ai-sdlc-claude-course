# CLAUDE.md

Guía breve para trabajar en este repositorio con un agente de IA.

## Comandos

- `npm run typecheck` — `tsc --noEmit`.
- `npm run lint` — ESLint sobre todo el repo.
- `npm run test` — suite de Vitest.
- `npm run verify` — **gate único de verificación** (typecheck + lint + test
  encadenados). Cualquier cambio debe dejar `npm run verify` en verde antes
  de darse por terminado.

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

## Definición de "terminado" (Definition of Done)

1. `npm run verify` pasa en verde.
2. Si el comportamiento cambió, `docs/payment-flow.md` está actualizado.
3. Hay al menos un test que cubre el cambio (caso positivo y, si aplica,
   caso negativo).
4. `git status` queda limpio (todo commiteado, nada suelto).

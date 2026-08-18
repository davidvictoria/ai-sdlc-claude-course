# AI-SDLC Claude Course — Laboratorio de pagos

Repositorio de práctica para el curso de AI-SDLC dirigido a desarrolladores
de una fintech. Simula un servicio de pagos **ficticio**: no contiene datos
reales, secretos, llamadas de red ni dependencias de producción (solo
`devDependencies`). El objetivo es que los participantes exploren, depuren y
extiendan el código con la ayuda de un agente de IA.

## Qué es este repositorio

Un servicio de pagos minimalista en TypeScript con tres capas:

- `src/domain`: tipos y errores del dominio (estado del pago, errores
  tipados).
- `src/service`: `PaymentService`, con un store en memoria (sin persistencia
  real).
- `src/provider`: adaptador de notificaciones entrantes del proveedor de
  pagos (ficticio).

El flujo completo, capa por capa, está documentado en
[`docs/payment-flow.md`](./docs/payment-flow.md).

## Prerrequisitos

- Node.js 22 o superior (`node --version`).
- npm (incluido con Node).
- Git.

## Preflight (primera vez)

```bash
git clone <url-del-repo-local>
cd ai-sdlc-claude-course
npm ci
npm run verify
```

`npm run verify` encadena `typecheck`, `lint` y `test`. Si termina en verde,
el entorno está listo para trabajar.

## Scripts disponibles

| Script      | Qué hace                                   |
| ----------- | ------------------------------------------- |
| `typecheck` | `tsc --noEmit`, sin generar artefactos      |
| `lint`      | ESLint sobre todo el repositorio            |
| `test`      | Ejecuta la suite de tests con Vitest        |
| `verify`    | `typecheck` + `lint` + `test`, en ese orden |

## Modelo de ramas por sesión

Cada sesión del curso tiene dos ramas:

- `session-N-start`: punto de partida del ejercicio de la sesión N.
- `session-N-solution`: solución de referencia de la sesión N.

Los participantes trabajan sobre una rama nueva creada a partir de
`session-N-start` (por ejemplo `session-1-mi-nombre`). `main` refleja el
estado base del repositorio, previo a cualquier sesión.

Antes de empezar una sesión:

```bash
git checkout session-N-start
git checkout -b session-N-mi-nombre
npm run verify
```

Al terminar, cada participante puede comparar su solución contra
`session-N-solution` para revisar diferencias de enfoque.

## Convenciones

Ver [`CLAUDE.md`](./CLAUDE.md) para las convenciones de trabajo del
repositorio y la definición de "terminado" (definition of done).

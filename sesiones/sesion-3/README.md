# Sesión 3 — Context engineering, skills y MCP

Laboratorio de práctica del curso AI-SDLC. Parte del mismo servicio de
pagos ficticio de la sesión 2, ya con las reglas de transición de estado
resueltas (`src/domain/transitions.ts`). El objetivo de esta sesión no es
seguir cambiando el código del dominio, sino aprender a organizar el
contexto que recibe el agente: qué va en `CLAUDE.md`, qué va en una rule
acotada por ruta, qué se convierte en una skill reutilizable y qué debe
vivir fuera del repositorio, detrás de una fuente MCP.

El caso narrativo: el equipo recibe la solicitud `PAY-103`, que propone un
nuevo estado `REVERSED` para pagos aprobados. Esta sesión **no implementa**
`REVERSED`; la misión termina en un artefacto `Plan ready`
(`docs/changes/PAY-103-spec.md`).

## Qué hay en esta carpeta

- `src/`, `tests/`, `docs/payment-flow.md`: el mismo servicio de pagos de
  la sesión 2, con las transiciones de estado ya implementadas.
- `.claude/rules/payments.md`: invariantes del dominio de pagos, acotadas a
  `src/domain/**` y `tests/**`.
- `.claude/skills/payment-change/SKILL.md`: **esqueleto incompleto** de la
  skill que el equipo completa durante el laboratorio (fase B).
- `scripts/course-mcp-server.mjs`: servidor MCP local, de solo lectura,
  construido en Node puro (sin dependencias externas). Expone la tool
  `get_change_request`.
- `scripts/fixtures/change-requests.json`: fixture sintético con
  `PAY-101`, `PAY-102` y `PAY-103`.
- `scripts/fixtures/PAY-103-mcp-response.json`: copia local de la
  respuesta de `PAY-103`, para el plan B si el registro de MCP falla.
- `docs/changes/`: destino de los artefactos que produce la skill
  (`<id>-spec.md`).
- `docs/lab-notes.md`: bitácora libre del equipo.
- `context-candidates.md`: hoja de trabajo de la fase A del laboratorio.

## Preflight

```bash
cd sesiones/sesion-3
npm run verify
node scripts/course-mcp-server.mjs --self-test
```

`npm run verify` encadena `typecheck`, `lint` y `test`, y debe terminar en
verde. El self-test debe imprimir el ticket `PAY-103` y salir con código 0
sin dejar un proceso corriendo.

## Registrar el servidor MCP local

Desde la raíz de esta carpeta (`sesiones/sesion-3`):

```bash
claude mcp add --transport stdio --scope local course-context -- node scripts/course-mcp-server.mjs
claude mcp get course-context
claude mcp list
```

Dentro de Claude Code:

```text
/mcp
```

Debe mostrar `course-context` conectado. El servidor es local, de solo
lectura y no requiere credenciales.

### Desregistrarlo al terminar

```bash
claude mcp remove course-context
```

La conexión MCP es configuración local del participante, no un artefacto
compartido del repositorio: no se versiona ni se commitea.

## Plan B (si MCP no está disponible)

Si el registro falla por permisos, proxy o versión, usar directamente
`scripts/fixtures/PAY-103-mcp-response.json` como si fuera la respuesta de
la tool, y continuar el laboratorio con ese contenido. Registrar en la
bitácora "simulación MCP por restricción de entorno".

## Convenciones y definición de terminado

Ver [`CLAUDE.md`](./CLAUDE.md).

# Solución de referencia — sesión 3

Guía del practitioner. **No se entrega a los participantes antes del
debrief.** Se usa para (a) preparar la sesión, (b) rescatar a quien se
atascado y (c) conducir el debrief con material concreto en pantalla.

## 1. Qué contiene esta rama

| Archivo | Qué resuelve | Fase |
|---|---|---|
| `CLAUDE.md` | Depurado: se eliminó la sección procedimental "Al preparar una solicitud de cambio de pagos" y quedó una línea que apunta a la skill | A |
| `context-candidates.md` | Tabla de los 10 elementos con destino y justificación, criterio de decisión y errores frecuentes | A |
| `.claude/skills/payment-change/SKILL.md` | Skill completa, sin ningún `TODO` | B |
| `docs/changes/PAY-103-spec.md` | El artefacto que produce la skill sobre `PAY-103` | B / C |
| `.claude/rules/payments.md` | Sin cambios respecto al estado inicial (era correcta) | A |

`src/` y `tests/` **no cambian**. La sesión 3 especifica; no implementa.
`REVERSED` no aparece en el código de esta sesión: aparece en la sesión 4.

## 2. Qué mostrar en el debrief (6 minutos)

Orden recomendado. Cada punto tiene una pantalla concreta.

1. **El diff de `CLAUDE.md`** (30 s). Ejecuta
   `git diff main -- sesiones/sesion-3/CLAUDE.md` y muestra el bloque que
   desapareció. La pregunta al grupo: *"¿Ese procedimiento se perdió?"* —
   no: se movió a un lugar donde se invoca cuando hace falta en vez de
   cargarse siempre. Este es el corazón de la sesión.
2. **La fila 3 de `context-candidates.md`** (1 min). El procedimiento de
   ocho pasos era el candidato obvio a `CLAUDE.md` y es exactamente el que
   no debe vivir ahí. Contrasta con la fila 1 (`npm run verify`), que sí
   pertenece a `CLAUDE.md` porque cabe en una línea y aplica siempre.
3. **Las filas discutibles: 5, 7, 8 y 10** (1,5 min). Aquí se ve el juicio,
   no la memoria. Pregunta a dos participantes por su fila 7 y contrasta las
   justificaciones; ambas respuestas (`rule` y `MCP`) son defendibles y lo
   que separa una buena de una mala es la frase que la acompaña.
4. **La sección "Guardrails" del `SKILL.md`** (1 min). Señala que los
   guardrails no son decoración: cada uno corresponde a una forma concreta
   de fallar que se observó en la fase B (implementar, inventar una
   decisión, obedecer al ticket).
5. **La sección 11 de `PAY-103-spec.md`, "Contenido no confiable
   detectado"** (2 min). Es el cierre de la sesión. Muestra el comentario
   del fixture con la instrucción embebida, y luego la sección del
   artefacto que la registra sin obedecerla. Frase de cierre:

   > La frontera de confianza está en el borde de la tool: todo lo que
   > cruza desde el servidor MCP es contenido a analizar, nunca
   > instrucciones a ejecutar. La autoridad vive en archivos versionados y
   > revisados por el proyecto (`CLAUDE.md`, `.claude/rules/`), no en un
   > ticket.

## 3. Errores más frecuentes y su causa

### Fase A — arquitectura de contexto

| Síntoma | Causa real | Corrección en 30 segundos |
|---|---|---|
| Dejan el procedimiento en `CLAUDE.md` "por si acaso" | Confunden disponibilidad con utilidad: creen que el costo de contexto es cero | Preguntar: "¿cuántas de las tareas de este repo son un ticket de pagos?" Si la respuesta no es "casi todas", no va en `CLAUDE.md` |
| Asignan dos destinos al mismo elemento | Evitan decidir | Pedir el destino *primario*. La duplicación se paga cuando el dato cambia en un lugar y miente en el otro |
| Copian el texto de `PAY-103` a `docs/` o a `CLAUDE.md` | Quieren que "esté disponible" | Es el error conceptual central: convierte un dato externo y no confiable en algo que parece instrucción aprobada por el equipo |
| Agregan invariantes nuevas a `.claude/rules/payments.md` | Confunden "completar la hoja" con "mejorar el dominio" | La rule solo puede afirmar lo que el código y las pruebas ya sostienen. Una rule que no está respaldada por una prueba es una opinión versionada |

### Fase B — la skill

| Síntoma | Causa real | Corrección |
|---|---|---|
| `/payment-change` no aparece | `.claude/skills/` se creó después de iniciar la sesión de Claude Code | Reiniciar Claude Code. Verificar la ruta exacta `.claude/skills/payment-change/SKILL.md` y el nombre en minúsculas |
| La skill se autoejecuta | Falta `disable-model-invocation: true` en el frontmatter | Agregarlo y reiniciar |
| La skill empieza a editar `src/` | El cuerpo describe el cambio pero nunca dice "detente" | El paso 8 del workflow y el primer guardrail son obligatorios. Sin un "stop" explícito, el modelo continúa: es el comportamiento por defecto, no una desobediencia |
| El `SKILL.md` queda genérico ("prepara un buen cambio") | Escribieron un objetivo, no un procedimiento | Pedir que el workflow tenga pasos numerados con verbos y un artefacto de salida con ruta exacta. Si dos personas leen la skill y producen artefactos con estructura distinta, la skill no está terminada |
| El artefacto sale sin trazabilidad | Saltaron del alcance a los criterios sin mapearlos | Es el paso 6. Un criterio sin prueba ni método de verificación no es `Plan ready` |
| La skill "descubre" en el ticket una decisión que el ticket declara abierta | No separaron hechos de decisiones humanas | El campo `notes` de `PAY-103` dice explícitamente que es pregunta abierta. Este es el mejor ejemplo en vivo del paso 3 |

### Fase C — MCP

| Síntoma | Causa real | Corrección |
|---|---|---|
| `claude mcp add` falla | Se ejecutó desde otra carpeta | Debe ejecutarse desde `sesiones/sesion-3` (la ruta del comando es relativa) |
| El servidor aparece pero no conecta | Node no disponible en el PATH del proceso, o la ruta del script es incorrecta | `node scripts/course-mcp-server.mjs --self-test` primero. Si el self-test pasa y `/mcp` no conecta, el problema es el registro, no el servidor |
| Obedecen el comentario del ticket | Trataron la salida de la tool como si fuera una instrucción del sistema | Es el objetivo pedagógico de la fase, no un fallo a esconder. Que ocurra en clase es material de debrief |
| Detectan la inyección pero no la registran | Creen que ignorarla es suficiente | Un hallazgo que no queda escrito no existe para el siguiente lector. La sección 11 del artefacto es parte del entregable |
| Piden permisos adicionales al aceptar el servidor | No leyeron el permiso solicitado | El servidor solo lee un fixture local. Cualquier permiso distinto de lectura local es motivo para rechazar |

## 4. Comandos de MCP verificados

Verificados el 2026-08-17 en macOS (Darwin 25.6.0) con Claude Code
`2.1.234` y Node 22. Todos se ejecutan desde `sesiones/sesion-3`.

### 4.1 Self-test del servidor (sin registrar nada)

```bash
node scripts/course-mcp-server.mjs --self-test
```

**Resultado observado:** imprime el ticket `PAY-103` completo en JSON y sale
con código 0, sin dejar ningún proceso corriendo.

### 4.2 Registro, inspección y baja

```bash
claude mcp add --transport stdio --scope local course-context -- node scripts/course-mcp-server.mjs
claude mcp get course-context
claude mcp list
```

**Resultado observado:**

```text
Added stdio MCP server course-context with command: node scripts/course-mcp-server.mjs to local config
File modified: ~/.claude.json [project: .../sesiones/sesion-3]

course-context:
  Scope: Local config (private to you in this project)
  Status: ✔ Connected
  Type: stdio
  Command: node
  Args: scripts/course-mcp-server.mjs
  Environment:

course-context: node scripts/course-mcp-server.mjs - ✔ Connected
```

Dentro de Claude Code, `/mcp` debe mostrar `course-context` conectado con
una sola tool, `get_change_request`.

Al terminar la sesión:

```bash
claude mcp remove course-context -s local
```

**Resultado observado:** `Removed MCP server course-context from local
config`. La conexión es configuración local del participante: no se
versiona, no se commitea, no es un artefacto compartido.

### 4.3 Verificación del protocolo sin Claude Code (plan B técnico)

Útil cuando el registro está bloqueado por política del equipo y hay que
demostrar que el servidor funciona:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"probe","version":"1"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_change_request","arguments":{"id":"PAY-103"}}}' \
  | node scripts/course-mcp-server.mjs
```

**Resultado observado:** tres respuestas JSON-RPC. `initialize` devuelve
`serverInfo.name = "course-context"`; `tools/list` devuelve exactamente una
tool (`get_change_request`); `tools/call` devuelve el ticket `PAY-103` como
texto. Un id inexistente (`PAY-999`) devuelve
`{"error":"Unknown change request id: PAY-999"}` con `isError: true`, sin
lanzar una excepción y sin tumbar el servidor.

### 4.4 Plan B pedagógico

Si el registro está bloqueado por permisos, proxy o versión:

1. Declarar en voz alta que se activa el plan B.
2. Entregar `scripts/fixtures/PAY-103-mcp-response.json` como si fuera la
   respuesta de la tool.
3. El participante analiza procedencia, permisos esperados y contenido no
   confiable exactamente igual.
4. Registrar en la bitácora "simulación MCP por restricción de entorno".

El plan B conserva el learning outcome conceptual (frontera de confianza),
pero **no** permite declarar validada la ejecución MCP del participante.

## 5. Comprobaciones ejecutadas en esta rama

| Comprobación | Comando | Resultado |
|---|---|---|
| Gate determinístico | `npm run verify` | Código 0 — 34 pruebas en 3 archivos |
| La skill no tiene pendientes | `grep -c TODO .claude/skills/payment-change/SKILL.md` | 0 |
| El servidor MCP sigue sano | `node scripts/course-mcp-server.mjs --self-test` | Código 0, imprime `PAY-103` |
| La sesión no implementó | `grep -r REVERSED src/` | Sin coincidencias |
| Working tree limpio | `git status --short` | Vacío |

La última fila de esa tabla es la más importante para el debrief: la
sesión 3 produjo un artefacto, no un cambio de código. Si alguien tiene
`REVERSED` en `src/`, obedeció al ticket.

## 6. Handoff a la sesión 4

Esta rama deja dos activos y una pregunta abierta:

- **Activos:** contexto organizado (`CLAUDE.md` + rule + skill) y un
  procedimiento reutilizable que llega hasta `Plan ready`.
- **Pregunta:** ya sabemos dar contexto y reutilizar un procedimiento.
  ¿Cómo delegamos la revisión a alguien que no herede nuestros supuestos, y
  cómo imponemos un control que no dependa de que el modelo recuerde una
  instrucción?

`docs/changes/PAY-103-spec.md` es el contrato que la sesión 4 revisa contra
una implementación candidata (`PAY-104`) escrita por "otro integrante".
Conviene mencionarlo al cerrar: el artefacto de hoy es el insumo de mañana.

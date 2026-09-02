# Sesión 4 — Agentes, controles y quality gates

Laboratorio de práctica del curso AI-SDLC. Continúa el servicio de pagos
ficticio de las sesiones anteriores: las transiciones de estado de la
sesión 2 ya están resueltas, y esta sesión trabaja sobre `PAY-104`, la
implementación candidata del estado `REVERSED` que la sesión 3 dejó
especificado en `PAY-103`.

El foco de esta sesión no es escribir código de dominio nuevo. Es:

- Configurar un **subagent de solo lectura** (`payment-reviewer`) que
  revisa un cambio de forma independiente, sin heredar los supuestos de
  quien lo implementó.
- Configurar un **hook `PreToolUse`** que bloquea, de forma determinística,
  ediciones a rutas sintéticamente protegidas.
- Cerrar el cambio con el **gate determinístico** del repositorio
  (`npm run verify`) y con la aceptación humana del diff.

## Qué es este repositorio

Un servicio de pagos minimalista en TypeScript, igual que en sesiones
anteriores:

- `src/domain`: tipos y errores del dominio (estado del pago, errores
  tipados, reglas de transición).
- `src/service`: `PaymentService`, con un store en memoria (sin
  persistencia real).
- `src/provider`: adaptador de notificaciones entrantes del proveedor de
  pagos (ficticio).

El flujo completo, capa por capa, está documentado en
[`docs/payment-flow.md`](./docs/payment-flow.md). La spec aprobada de
`PAY-104` está en
[`docs/changes/PAY-104-spec.md`](./docs/changes/PAY-104-spec.md).

## Prerrequisitos

- Node.js 22 o superior (`node --version`).
- npm (incluido con Node).
- Git.
- Claude Code.

## Cómo verificar

Desde la raíz del monorepo (instala todos los workspaces, incluida esta
sesión):

```bash
npm ci
npm run verify:s4
```

O trabajando directamente dentro de `sesiones/sesion-4/`:

```bash
cd sesiones/sesion-4
npm run verify
```

`npm run verify` encadena `typecheck`, `lint` y `test` (Vitest). Si termina
en verde (código 0), el gate determinístico está satisfecho. Eso **no**
reemplaza la revisión de `payment-reviewer` contra la spec: son dos
evidencias distintas y ninguna sustituye a la otra.

## Scripts disponibles

| Script      | Qué hace                                   |
| ----------- | ------------------------------------------- |
| `typecheck` | `tsc --noEmit`, sin generar artefactos      |
| `lint`      | ESLint sobre todo el repositorio            |
| `test`      | Ejecuta la suite de tests con Vitest        |
| `verify`    | `typecheck` + `lint` + `test`, en ese orden |

## Fase A — Completar el agente de revisión

`.claude/agents/payment-reviewer.md` está incompleto a propósito
(frontmatter con `tools` y `model` marcados `<!-- TODO -->`, cuerpo con
encabezados y TODOs). Complétalo en clase:

- `tools`: limitar a `Read, Glob, Grep`. Nunca `Bash`, `Edit` ni `Write` —
  este agente revisa, no corrige, y sin `Bash` no puede afirmar que
  ejecutó `npm run verify`.
- `model`: usar `inherit` salvo que el practitioner indique otro valor.
- Cuerpo: responsabilidad, inputs obligatorios (spec, alcance del diff,
  evidencia), orden de revisión y formato de salida (bloqueantes,
  recomendaciones, brechas de evidencia, veredicto).

Guarda el archivo, reinicia Claude Code si el agente no aparece en
`/agents`, y verifica que aparece con la responsabilidad y la allowlist de
solo lectura correctas.

Invocación de referencia. Nota que en este snapshot `PAY-104` ya está
commiteado, así que `git diff` está vacío: hay que decirle al reviewer qué
archivos revisar.

```text
Delega una revisión independiente al subagente payment-reviewer.
Contrato aprobado: docs/changes/PAY-104-spec.md.
Cambio a revisar: la implementación de REVERSED en
src/domain/payment-status.ts, src/domain/transitions.ts, tests/ y
docs/payment-flow.md.
Evidencia disponible: npm run verify pasó con 42 tests.
No modifiques archivos. Reporta textualmente los bloqueantes,
recomendaciones, brechas de evidencia y veredicto del subagente.
```

## Fase B — Hook de protección

### Bloque exacto para `.claude/settings.json`

`.claude/settings.json` está incompleto a propósito: es un JSON válido
(un objeto con un comentario informativo) pero **sin** el bloque `hooks`.
Agrega este bloque `PreToolUse` dentro del objeto raíz:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/protect-files.mjs\""
          }
        ]
      }
    ]
  }
}
```

Puedes fusionarlo con la clave `_comment` existente o reemplazarla; lo
único obligatorio es que el JSON siga siendo válido y que el bloque
`hooks.PreToolUse` quede exactamente como arriba. Si tu shell requiere otro
quoting para `$CLAUDE_PROJECT_DIR`, documenta la variante usada por sistema
operativo antes de la demo.

Reinicia Claude Code si tu versión lo requiere y confirma el hook con
`/hooks` (debe listar `PreToolUse` para el matcher `Edit|Write`).

### Qué hace `.claude/hooks/protect-files.mjs`

Este script **ya está completo y funcional** — se inspecciona, no se
reescribe durante la clase. Contrato:

1. Lee el evento JSON desde `stdin`.
2. Extrae y normaliza la ruta destino (`tool_input.file_path` y algunas
   variantes; funciona con rutas relativas o absolutas).
3. La compara contra una lista explícita de patrones protegidos:
   - `fixtures/protected/`
   - `.env` y variantes (`.env.local`, `demo.env`, etc.)
   - `.git/`
   - `package-lock.json`
4. Si coincide: escribe una razón breve en `stderr` (nunca el contenido
   del archivo ni una ruta absoluta completa) y termina con **código 2**
   (bloquea).
5. Si no coincide: termina con **código 0** (permite).
6. Si `stdin` está vacío o el JSON es inválido: termina con **código 0**
   (permite) — el hook falla abierto ante entrada corrupta en lugar de
   romper la sesión.

### Cómo probar el hook manualmente

Fuera de Claude Code, puedes simular el evento por línea de comandos desde
`sesiones/sesion-4/`:

```bash
# Debe bloquear: exit code 2 y una razón breve en stderr.
echo '{"tool_name":"Edit","tool_input":{"file_path":"fixtures/protected/demo.env"}}' \
  | node .claude/hooks/protect-files.mjs; echo "exit code: $?"

# Debe permitir: exit code 0, sin salida en stderr.
echo '{"tool_name":"Edit","tool_input":{"file_path":"docs/lab-notes.md"}}' \
  | node .claude/hooks/protect-files.mjs; echo "exit code: $?"
```

Dentro de Claude Code, con el hook habilitado en `settings.json`:

1. Pide una edición a la ruta protegida, nombrando la herramienta:

   ```text
   Usa la herramienta Edit para agregar al final de
   fixtures/protected/demo.env la línea "# hook test". No uses Bash. Si
   Edit es bloqueado, reporta el mensaje de bloqueo textual y detente.
   ```

   Confirma que la operación se bloquea y que el mensaje identifica la
   política del curso.
2. Pide una edición a la ruta permitida:

   ```text
   Agrega al final de docs/lab-notes.md la línea "- Intento permitido:
   docs/lab-notes.md, aplicado sin bloqueo." Reporta en una línea si se
   aplicó.
   ```

   Confirma que se aplica sin problema: el control es específico, no
   bloquea todo.

Nunca apuntes el hook a un `.env` real ni a contenido parecido a una
credencial. El único blanco de demostración es
`fixtures/protected/demo.env`, un fixture sintético sin valor real.

Alcance del control: el matcher es `Edit|Write`, así que el hook intercepta
esas herramientas y nada más. Un comando de shell que escriba el mismo
archivo (por ejemplo `printf >> fixtures/protected/demo.env` vía `Bash`) no
pasa por él. Pide la edición con la herramienta `Edit` para ver el bloqueo,
y guarda el caso de `Bash` para el debrief: un control determinístico
protege exactamente lo que declara, y el resto lo cubren los permisos de
herramientas y la revisión humana.

## Fase C — Revisar, corregir y verificar

1. Invoca a `payment-reviewer` con la spec (`docs/changes/PAY-104-spec.md`)
   y los archivos de la implementación, usando la invocación de referencia
   de la fase A.
2. Lee todos los bloqueantes antes de pedir cambios; verifica cada
   hallazgo contra el repositorio, no lo aceptes solo por venir del
   agente.
3. Corrige únicamente los hallazgos confirmados desde la conversación
   principal.
4. Ejecuta `npm run verify` y `git diff --check`.
5. Revisa `git diff` contra los criterios de aceptación numerados en la
   spec.

## Solución de referencia

No está en esta carpeta ni en esta rama. El practitioner la comparte al
cerrar la sesión.

## Convenciones

Ver [`CLAUDE.md`](./CLAUDE.md) para las convenciones de trabajo del
repositorio y la definición de "terminado" (definition of done).

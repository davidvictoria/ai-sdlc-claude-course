# Sesión 4 — Agentes, controles y quality gates

Laboratorio del curso AI-SDLC con el servicio de pagos **ficticio** de las
sesiones anteriores. No dependes de haber terminado la sesión 3: esta
carpeta ya trae la spec aprobada y una implementación candidata de
`REVERSED`, identificada como `PAY-104`.

Aquí tienes qué hacer, en qué orden, dónde pegar cada instrucción y cómo
comprobar el resultado. Trabajarás en el repo en distintos momentos de la
clase. **Espera la indicación del practitioner para comenzar cada fase.**

## Contenido

- [Tu misión](#tu-misión)
- [Cómo se trabaja](#cómo-se-trabaja)
- [Preflight y materiales](#preflight-y-materiales)
- [El reloj de la sesión](#el-reloj-de-la-sesión)
- [Primera práctica: elegir el mecanismo](#primera-práctica-elegir-el-mecanismo)
- [Fase A: crear y usar el reviewer](#fase-a-crear-y-usar-el-reviewer)
- [Fase B: hook de protección](#fase-b-hook-de-protección)
- [Práctica: qué demuestra cada evidencia](#práctica-qué-demuestra-cada-evidencia)
- [Fase C: revisar, corregir y aceptar](#fase-c-revisar-corregir-y-aceptar)
- [Si algo se atasca](#si-algo-se-atasca)
- [Cierre y entrega](#cierre-y-entrega)
- [Reglas del laboratorio](#reglas-del-laboratorio)

## Tu misión

Un proveedor notifica que un pago aprobado fue revertido. Otra persona
implementó `REVERSED`. A ti te corresponde decidir si ese cambio puede
aceptarse. Para hacerlo, vas a:

1. Crear `payment-reviewer`, un agente de solo lectura que revise contra
   la spec y reporte hallazgos.
2. Configurar un hook que bloquee una edición fuera de alcance y permita
   otra válida.
3. Confirmar los hallazgos, corregir lo necesario y decidir **acepto / no
   acepto PAY-104** con evidencia.

La continuidad es `PAY-103` (spec de sesión 3), `PAY-104` (revisión de hoy)
y `PAY-105` (sesión 5). El contrato de hoy está en
[`docs/changes/PAY-104-spec.md`](./docs/changes/PAY-104-spec.md).

**El estado inicial puede pasar todos los tests y aun así incumplir la
spec.** Tu trabajo es comprobar los criterios, no aceptar el cambio por
ver una salida verde. No escribas la funcionalidad desde cero ni cambies
la spec para justificar lo que hace el código.

## Cómo se trabaja

**Trabajo individual, con intercambio por chat.** Usas tu clon, tu sesión
de Claude Code y tu portafolio. La dinámica se repite en cada bloque:

| Momento | Qué haces tú |
|---|---|
| Explicación breve | Escuchas el criterio y lo relacionas con PAY-104 |
| Demostración | Observas; todavía no replicas los pasos |
| Práctica | Ejecutas los pasos de este README en tu equipo |
| Validación / open mic | Compartes resultado o bloqueo y planteas dudas |

Durante la práctica, la consigna queda visible y no se introduce el
siguiente tema. Al pedir ayuda, escribe **fase + paso + resultado o
error**. Por ejemplo: `B2: /hooks no muestra PreToolUse`. Si terminaste,
comparte la evidencia que pide el checkpoint, no solo «listo».

| Tipo de bloque | Dónde lo usas |
|---|---|
| `bash` | Terminal, fuera de Claude Code. Las simulaciones indican su variante de PowerShell |
| `powershell` | Terminal PowerShell, fuera de Claude Code |
| `text` | Conversación principal de Claude Code |
| `yaml` o `json` | Archivo indicado, en tu editor |
| «Tú» | Lees, decides o completas el portafolio |

Mantén dos terminales en `sesiones/sesion-4`: una con Claude Code y otra
para comandos. Si solo tienes una, escribe `/exit` para volver a la
terminal y `claude` para abrir una conversación nueva. Los archivos
guardados permanecen; vuelve a compartir la evidencia cuando la nueva
conversación la necesite.

## Preflight y materiales

### Antes de la clase

Necesitas Node.js 22 o superior, npm, Git y Claude Code autenticado. Si
falta algo, sigue el [preflight del curso](../../PREFLIGHT.md) antes de la
sesión.

Si ya tienes el repo, desde su raíz comprueba:

```bash
git status --short
git branch --show-current
```

Si estás en `main` y no aparecen cambios locales, actualiza con:

```bash
git pull --ff-only
```

Si tienes trabajo de sesiones anteriores o estás en otra rama, **no lo
borres ni cambies de rama a la fuerza**. Conserva ese clon y pide ayuda
para preparar otro, siguiendo los enlaces de
[GitHub o Bitbucket del curso](../../README.md#preparación-una-sola-vez-antes-de-la-sesión-1).
Empieza S4 desde `main`, no desde una solución de referencia.

Desde la raíz del repo, instala las dependencias si aún no lo hiciste:

```bash
npm ci
```

Después entra a la sesión:

```bash
cd sesiones/sesion-4
node --version
claude --version
npm run verify
```

**Esperado:** `typecheck`, `lint` y tests terminan sin errores. El starter
incluido tiene 42 pruebas. Anota el resultado que obtuviste realmente;
después de agregar pruebas el número puede aumentar.

`npm run verify` dentro de esta carpeta verifica S4. Desde la raíz, el
equivalente es `npm run verify:s4`. No confundas ese comando con el
`npm run verify` de la raíz, que ejecuta las cinco sesiones.

### Al inicio de la clase: minutos 02–07

Abre estos materiales antes de empezar las prácticas. **Las rutas de aquí
en adelante son relativas a `sesiones/sesion-4`.**

| Material | Para qué lo usarás |
|---|---|
| Este `README.md` | Seguir los pasos y copiar los prompts |
| [`docs/changes/PAY-104-spec.md`](./docs/changes/PAY-104-spec.md) | Contrastar los 11 criterios de aceptación |
| [`docs/payment-flow.md`](./docs/payment-flow.md) | Entender el flujo y las reglas de pagos |
| [`docs/portafolio.md`](./docs/portafolio.md) | Registrar tus tres checkpoints y tu decisión |
| [`.claude/agents/payment-reviewer.md`](./.claude/agents/payment-reviewer.md) | Completar el agente en fase A |
| [`.claude/settings.json`](./.claude/settings.json) | Registrar el hook en fase B |
| [`docs/lab-notes.md`](./docs/lab-notes.md) | Bitácora y destino de la edición permitida |

Abre Claude Code **desde esta carpeta**:

```bash
claude
```

Por chat: `listo: README, spec y portafolio abiertos`, o el bloqueo
concreto. Estos cinco minutos son para preparar los materiales y resolver
el acceso, no para completar una instalación desde cero.

## El reloj de la sesión

Minutos transcurridos desde el inicio. Son **120 minutos con pausas y
cierre**. Las demostraciones se observan; las fases se ejecutan después.

| Minutos | Bloque | Duración |
|---|---|---:|
| 00–02 | Objetivo y dinámica | 2 |
| 02–07 | Materiales, entorno y bloqueos de preparación | 5 |
| 07–10 | Caso PAY-104 y tres checkpoints | 3 |
| 10–14 | Cuándo separar un agente | 4 |
| 14–19 | Elegir mecanismo y validar por chat | 5 |
| 19–24 | Anatomía esencial y demo observada del reviewer | 5 |
| 24–44 | Fase A: tools, reviewer y validación | 20 |
| 44–49 | Pausa | 5 |
| 49–54 | Instrucción y control | 5 |
| 54–58 | Demo observada del hook | 4 |
| 58–64 | Fase B: predicción, simulación y validación | 6 |
| 64–78 | Fase B: integración, prueba real y validación | 14 |
| 78–80 | Pausa | 2 |
| 80–85 | Clasificar evidencias y validar | 5 |
| 85–90 | Quality gates y demo observada del cierre | 5 |
| 90–112 | Fase C: corregir, verificar, decidir y validar | 22 |
| 112–116 | Debrief | 4 |
| 116–120 | Reflexión, sesión 5 y entrega | 4 |
| **Total** | | **120** |

Tienes **62 minutos de trabajo sobre el repo y validación**: 20 de
reviewer, 20 de hook y 22 de cierre. Incluyen registrar evidencia y
resolver dudas. Las fases A, B y C reservan sus últimos tres minutos para
validar antes de avanzar.

## Primera práctica: elegir el mecanismo

**Minutos 14–19, por chat.** Elige conversación, skill, agente o
automatización para cada caso:

1. Explicar una función.
2. Repetir un procedimiento para cambios de pagos.
3. Revisar un cambio con responsabilidad y contexto separados del autor.
4. Ejecutar tests antes de cada commit.

Dedica dos minutos a elegir, uno a justificar los casos 3 y 4 y dos a
contrastar respuestas. Explica la razón, no solo el nombre del mecanismo.

Después observarás la demo del reviewer. Fíjate en **qué recibe**, **qué
puede hacer** y **qué debe devolver**. Todavía no completes el archivo.

## Fase A: crear y usar el reviewer

**Minutos 24–44.** El archivo del agente está incompleto a propósito.
Al terminar tendrás una definición guardada y una revisión invocada por
nombre. El reviewer observa y reporta; tú confirmas sus hallazgos.

### A1. Tú: decide las herramientas y completa el frontmatter (5 min)

¿Qué opciones permiten más de lo necesario para revisar sin modificar?

- A. `Read, Glob, Grep`
- B. `Read, Grep, Bash`
- C. `Read, Edit, Bash`

Abre `.claude/agents/payment-reviewer.md`. Reemplaza **solo las líneas
`tools` y `model`** por:

```yaml
tools: Read, Glob, Grep
model: inherit
```

Conserva `name: payment-reviewer`, `description` y los delimitadores
`---`. Guarda. Por chat, explica por qué elegiste A y qué capacidad
adicional tendría el agente con `Bash`.

### A2. Turno con Claude: completa el contrato del agente (3 min)

En la conversación principal:

```text
Completa los TODO del cuerpo de .claude/agents/payment-reviewer.md.
Conserva name, description, tools: Read, Glob, Grep y model: inherit.
Modifica únicamente ese archivo. No ejecutes la revisión todavía.

El agente debe:
1. Revisar PAY-104 contra la spec aprobada, sin editar archivos ni corregir.
2. Recibir la ruta de la spec, el alcance por diff o por archivos y la
   evidencia disponible. Si falta algo, indicarlo y pedirlo sin inventarlo.
3. Leer los criterios, inspeccionar el alcance y contrastar implementación
   y pruebas. Buscar incumplimientos, casos negativos y cambios sin motivo.
4. Separar bloqueantes, recomendaciones y evidencia faltante. Cada
   hallazgo debe citar archivo, criterio y razón comprobable.
5. Devolver la cobertura de los criterios y un veredicto: listo o no listo
   para verificación determinística. Ese veredicto no acepta el cambio.
6. Declarar que no ejecutó comandos. No tiene Bash: la salida de verify
   debe proporcionarla la persona que lo invoca.

Escribe el cuerpo en español y elimina los TODO que completes.
```

Si Claude pide permiso para escribir, comprueba que el destino sea ese
archivo. **Tú:** lee el resultado y busca `TODO` en el editor. No debe
quedar ninguno. Confirma que el agente pide información faltante y no
afirma haber ejecutado checks.

### A3. Tú y Claude: invoca el reviewer por nombre (7 min)

Guarda el archivo. Para empezar con la definición recién completada,
cierra Claude con `/exit` y vuelve a ejecutar `claude` desde S4.

Primero pega en la conversación el resumen **real** del `npm run verify`
del preflight: checks, cantidad de tests y resultado. Si falló o no lo
ejecutaste, escribe eso. Después pega:

```text
Delega una revisión independiente al subagente payment-reviewer.
Contrato: docs/changes/PAY-104-spec.md.
Alcance: la implementación candidata de REVERSED en src/, tests/ y
docs/payment-flow.md. Puedes leer package.json para comprobar dependencias.
src/service/ y src/provider/ se inspeccionan para comprobar sus interfaces;
no autorizo cambios en ellos.

PAY-104 ya viene implementado en el snapshot. Aunque git diff esté vacío,
revisa esos archivos completos contra los criterios de la spec.
Usa la salida real de verify que acabo de compartir como evidencia
proporcionada por mí. Si no la compartí, registra esa evidencia faltante.

No modifiques ningún archivo. Devuelve los hallazgos del subagente con
archivo, criterio, razón, evidencia faltante y veredicto.
```

**Comprueba dos cosas:**

1. La conversación muestra una delegación a `payment-reviewer`, no solo
   una respuesta de la conversación principal que dice ser el reviewer.
2. La salida relaciona criterios de la spec con código o pruebas y
   distingue lo comprobado de lo pendiente.

En versiones actuales, `/agents` ya no abre el asistente anterior. La
comprobación de este laboratorio es **archivo correcto + delegación real
por nombre**, no una captura obligatoria de ese menú.
[Referencia oficial de subagents](https://code.claude.com/docs/en/sub-agents#quickstart-create-your-first-subagent).

Si no se encuentra el agente, revisa ruta, nombre y frontmatter y consulta
[Si algo se atasca](#si-algo-se-atasca). Si Claude no puede delegar, no
presentes una revisión de la conversación principal como independiente.

### A4. Tú: registra CP1 y valida antes de avanzar (2 + 3 min)

Completa **Checkpoint 1** en [`docs/portafolio.md`](./docs/portafolio.md).
Agrupa la definición con tools visibles y la delegación con un hallazgo
trazado a un criterio. Usa las capturas o extractos legibles necesarios;
no hace falta una captura por paso.

En los minutos **41–44**, comparte por chat:

> CP1: payment-reviewer; tools: …; criterio revisado: …; resultado o bloqueo: …

Avanzas con el agente definido, la invocación demostrada y una explicación
de sus límites. Guarda los hallazgos para fase C; aún no pidas correcciones.
Si la ejecución sigue pendiente, registra el estado y pide ayuda.

**Pausa: minutos 44–49.** Después habrá explicación y demo del hook.

## Fase B: hook de protección

**Minutos 58–78.** Primero pruebas el script por separado; después
compruebas que Claude Code lo ejecute antes de una edición.

Durante la demo de los minutos 54–58, observa qué archivo configura el
hook, qué llamada lo activa y cómo se distinguen bloqueo y permiso.

### B1. Tú: predice, simula y contrasta (6 min)

Antes de ejecutar, predice el resultado de estas rutas: `2` significa
bloquear y `0` permitir.

| Ruta | Mi predicción | Resultado / razón |
|---|---|---|
| `fixtures/protected/demo.env` | | |
| `docs/lab-notes.md` | | |
| `package-lock.json` | | |

El script `.claude/hooks/protect-files.mjs` ya está completo. **No lo
reescribas.** Lee su lista de patrones y ejecuta los siguientes comandos
en tu segunda terminal, desde S4. Elige la variante de tu terminal.

**macOS, Linux, WSL o Git Bash:**

```bash
echo '{"tool_name":"Edit","tool_input":{"file_path":"fixtures/protected/demo.env"}}' | node .claude/hooks/protect-files.mjs
echo "exit code: $?"
```

```bash
echo '{"tool_name":"Edit","tool_input":{"file_path":"docs/lab-notes.md"}}' | node .claude/hooks/protect-files.mjs
echo "exit code: $?"
```

**PowerShell:**

```powershell
'{"tool_name":"Edit","tool_input":{"file_path":"fixtures/protected/demo.env"}}' | node .claude/hooks/protect-files.mjs
Write-Output "exit code: $LASTEXITCODE"
```

```powershell
'{"tool_name":"Edit","tool_input":{"file_path":"docs/lab-notes.md"}}' | node .claude/hooks/protect-files.mjs
Write-Output "exit code: $LASTEXITCODE"
```

Ejecuta cada bloque completo para leer el código de salida inmediatamente.
**Esperado:** el primero devuelve `2` y una razón que empieza con
`Blocked by course policy`; el segundo devuelve `0` sin mensaje. Para
`package-lock.json`, contrasta tu predicción con la lista de patrones: debe
bloquearse. Puedes repetir una simulación cambiando únicamente esa ruta.

Estas simulaciones **no editan archivos** y todavía no demuestran un hook
activo dentro de Claude. Dedica un minuto a predecir, tres a probar y dos
a comparar por chat. Anota los resultados en CP2.

### B2. Tú: configura el hook y comprueba el JSON (3 min)

Abre `.claude/settings.json`. El starter contiene solo una clave
`_comment`. Reemplaza ese contenido por este JSON y guarda:

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

Si tu archivo ya tiene otras claves de configuración, consérvalas y añade
`hooks` dentro del objeto raíz. No pegues dos objetos JSON uno detrás de
otro. En la terminal comprueba:

```bash
node -e "JSON.parse(require('node:fs').readFileSync('.claude/settings.json', 'utf8')); console.log('JSON valido')"
```

**Esperado:** `JSON valido`. Luego abre `/hooks` **dentro de Claude Code**
y busca `PreToolUse`, matcher `Edit|Write`, con origen en la configuración
del proyecto. Sal del menú con Escape. Si no aparece, guarda, sal con
`/exit` y vuelve a abrir `claude` desde S4.

El bloque usa la sintaxis del shell Bash del hook (también Git Bash en
Windows). Si tu entorno usa hooks con `shell: powershell`, acuerda la
variante con el practitioner: esa variante necesita `$env:CLAUDE_PROJECT_DIR`
en el comando. No mezcles ambas sintaxis. Documenta el entorno usado en CP2.
[Referencia oficial de hooks](https://code.claude.com/docs/en/hooks).

### B3. Turnos con Claude: prueba bloqueo y permiso (5 min)

Haz las dos pruebas en la **conversación principal**, no con el reviewer:
el reviewer no tiene herramientas de edición.

**Primer turno: operación protegida.**

```text
Esta es la prueba del hook del curso sobre un fixture sintético, no sobre
credenciales reales. Usa únicamente la herramienta Edit para agregar
al final de fixtures/protected/demo.env la línea "# hook test".
No uses Bash ni otra herramienta para escribir. Si el hook bloquea Edit,
reporta el mensaje textual y detente. No intentes otra ruta ni otro método.
```

Comprueba que hubo un intento de `Edit` y que el mensaje identifica
`Blocked by course policy`. Una negativa verbal de Claude o un rechazo
de permisos general no demuestra que este hook se haya ejecutado.

En la terminal:

```bash
git diff -- fixtures/protected/demo.env
```

**Esperado:** no imprime cambios. Si el fixture cambió, detente, registra
el fallo y revisa B2 con el practitioner. No declares el control aprobado.

**Segundo turno: operación permitida.**

```text
Usa la herramienta Edit para agregar al final de docs/lab-notes.md la línea
"- Intento permitido: docs/lab-notes.md, aplicado sin bloqueo."
No uses Bash ni otra herramienta para escribir. Reporta si se aplicó.
```

En la terminal:

```bash
git diff -- docs/lab-notes.md
```

**Esperado:** aparece la línea agregada y la conversación muestra `Edit`
permitido. Usar la misma herramienta en ambos intentos permite comprobar
que el resultado depende de la ruta, no de haber usado otra herramienta.

### B4. Tú: registra CP2 y valida el alcance (3 + 3 min)

Completa **Checkpoint 2** en el portafolio: simulaciones, bloqueo real,
edición permitida y estado de los archivos. Agrupa la evidencia de los dos
intentos. En los minutos **75–78**, responde por chat:

> CP2: protegida …; permitida …; evidencia …; fuera del control queda …

Explica al menos un límite:

- `Edit|Write` cubre esas herramientas. Una escritura con `Bash` queda
  fuera del matcher; no hace falta demostrar ese desvío en clase.
- El script permite si recibe JSON inválido, entrada vacía o ninguna ruta
  reconocible. Ese comportamiento no prueba que una ruta esté protegida.
- El script compara patrones y normaliza separadores; no resuelve toda la
  semántica de rutas. Es un control de laboratorio, no una barrera general.
- Bloquear una edición no comprueba los criterios de negocio de PAY-104.

Si la integración no funciona, conserva las simulaciones y escribe
**«simulación del script; integración con Claude pendiente»**. Anota el
error y el siguiente paso. Puedes continuar con C cuando el practitioner
lo indique; CP2 seguirá pendiente hasta demostrar ambos intentos reales.

**Pausa: minutos 78–80.**

## Práctica: qué demuestra cada evidencia

**Minutos 80–85, por chat.** Clasifica: instrucción, restricción/bloqueo,
verificación o afirmación que todavía necesita evidencia.

- A. `CLAUDE.md` pide no tocar configuración.
- B. El agente solo tiene `Read, Glob, Grep`.
- C. `PreToolUse` bloquea una llamada con código `2`.
- D. Se ejecutó `npm run verify`.
- E. El agente dice «listo para verificación».

Tienes dos minutos para clasificar, uno para justificar B y E y dos para
validar respuestas. A continuación observa la demo de cierre: criterio,
hallazgo, prueba, corrección, verificación y decisión humana.

## Fase C: revisar, corregir y aceptar

**Minutos 90–112.** Recupera la revisión de A. Tú confirmas qué hallazgos
son válidos antes de autorizar a la conversación principal a corregirlos.

### C1. Tú: confirma los hallazgos contra la spec (4 min)

Abre la spec y el archivo citado en cada hallazgo. En CP3 marca
**confirmado / rechazado / pendiente** y explica la razón. Si no puedes
comprobarlo, déjalo pendiente. No tienes que encontrar exactamente dos
observaciones ni inventar un hallazgo rechazado.

Si necesitas que Claude te ayude a localizar la evidencia:

```text
Sin modificar archivos, contrasta los hallazgos de payment-reviewer con
docs/changes/PAY-104-spec.md y el repositorio. Para cada uno, señala el
criterio, el archivo y la prueba o código que lo confirma o contradice.
Si falta evidencia, dilo. No decidas por mí cuáles voy a aceptar.
```

### C2. Tú y Claude: corrige solo lo que confirmaste (8 min)

Escribe primero, en la conversación principal, los hallazgos que
confirmaste, con su criterio. Después pega:

```text
Corrige únicamente los hallazgos que acabo de confirmar.
Trabaja desde la conversación principal, no desde payment-reviewer.

1. Para un defecto de comportamiento, agrega primero una prueba que lo
   reproduzca y ejecútala antes de corregir. Muestra la salida real.
2. Aplica la corrección mínima y vuelve a ejecutar la prueba.
3. Para una brecha de cobertura sin defecto confirmado, agrega la prueba
   y reporta honestamente si ya pasa con el código actual.
4. Revisa los demás criterios para evitar dejar cobertura pendiente.
5. Actualiza docs/payment-flow.md si el comportamiento documentado lo requiere.

Limita las correcciones a src/domain/, tests/ y docs/payment-flow.md.
No cambies la spec, las interfaces públicas, dependencias ni otras sesiones.
No debilites pruebas existentes. Si necesitas salir del alcance, detente
y explica por qué antes de editar.
```

**Comprueba tú:** la prueba demuestra el comportamiento esperado por la
spec y la corrección corresponde al hallazgo. Una prueba de cobertura
puede pasar antes del cambio; no inventes un fallo para completar el relato.

### C3. Tú y el reviewer: verifica y revisa el resultado (5 min)

En la terminal, desde S4:

```bash
npm run verify
git diff --check -- .
git status --short
git diff --stat -- .
git diff -- src/domain tests docs/payment-flow.md
```

**Esperado:** verify termina en verde; `git diff --check -- .` no imprime
problemas; cada cambio tiene una razón. `git status` puede mostrar trabajo
de otras sesiones: no lo borres ni lo incluyas en tu evidencia de S4.
Los archivos nuevos (`??`) no aparecen en `git diff`; ábrelos y revísalos
también. Si ya hiciste commits, el diff de trabajo puede estar vacío: usa
el alcance por archivos y tus evidencias del antes/después.

Pega el resumen real de verify en Claude y pide la revisión final:

```text
Delega de nuevo en payment-reviewer la revisión de PAY-104 contra
docs/changes/PAY-104-spec.md. Revisa el estado actual de src/, tests/,
docs/payment-flow.md y package.json, además del diff disponible.
Usa la salida real de verify que acabo de compartir como evidencia mía.

Comprueba los hallazgos anteriores y los 11 criterios de aceptación.
Distingue pruebas automatizadas, inspección de código/documentación y
evidencia faltante. Devuelve bloqueantes pendientes y veredicto.
No modifiques archivos ni afirmes haber ejecutado comandos.
```

Si un check falla o el reviewer encuentra un bloqueante confirmado, vuelve
al paso C2 para ese punto. Si no alcanza el tiempo, registra qué queda
pendiente. No declares terminado un check que sigue ejecutándose.

### C4. Tú: decide y registra CP3 (2 min)

Completa la tabla de los **11 criterios** del portafolio. Los criterios
de comportamiento requieren pruebas; los de interfaces, dependencias y
documentación también requieren inspección de los archivos y del alcance.

Revisa por separado estos dos grupos de cambios:

- **PAY-104:** `src/domain/`, `tests/` y `docs/payment-flow.md`, según la
  spec. No debe haber dependencias nuevas ni cambios de interfaces.
- **Artefactos del laboratorio:** el agente, `settings.json`, las notas y
  el portafolio. Configuran o documentan el ejercicio; no amplían el
  alcance del cambio de dominio.

Escribe **«acepto PAY-104»** solo si los criterios están comprobados, el
review no deja bloqueantes confirmados, verify pasa y tú aceptas el diff.
En otro caso escribe **«no acepto todavía»**, el motivo y el siguiente
paso. Separa esa decisión del estado de CP2: aceptar el cambio de dominio
no demuestra que el hook esté integrado.

**No necesitas commit ni pull request para entregar.** Revisa y justifica
los archivos modificados; el árbol de trabajo no tiene que quedar limpio.

### C5. Validación por chat / open mic (3 min)

En los minutos **109–112**, comparte:

> CP3: acepto / no acepto PAY-104; criterio …; evidencia …; pendiente …

Explica qué comprobaste tú y qué hizo cada herramienta. Una opinión del
reviewer, un hook y una suite verde responden preguntas distintas.

## Si algo se atasca

| Problema | Qué hacer y qué registrar |
|---|---|
| Faltan dependencias | Antes de clase, `npm ci` desde la raíz. En clase, comparte el error; no reinstales repetidamente mientras se explica |
| Claude no encuentra archivos o configuración | Comprueba que ambas terminales estén en `sesiones/sesion-4` |
| No aparece `payment-reviewer` | Revisa la ruta exacta, `name`, delimitadores YAML y ausencia de TODO; guarda y reinicia Claude desde S4 |
| `/agents` no abre un asistente | Usa la definición del archivo y la delegación por nombre como comprobación |
| El reviewer intenta editar o ejecutar comandos | Detén la llamada y revisa `tools`; debe ser `Read, Glob, Grep` |
| El reviewer dice que ejecutó verify | Pide que distinga evidencia proporcionada de acciones propias; no tiene Bash |
| No hay diff al empezar | Es normal en este snapshot. Usa la spec y el alcance por archivos del prompt A3 |
| El JSON de settings falla | Corrige comas, llaves o comillas y repite la validación de B2 |
| La simulación funciona pero el hook no aparece | Comprueba `/hooks`, proyecto y comando. Reinicia desde S4 y revisa con el practitioner |
| Claude se niega sin intentar Edit | Eso no es evidencia del hook. Muestra el mensaje y revisa el intento sintético de B3 con el practitioner |
| Cambió el archivo protegido o falló la edición permitida | CP2 está pendiente. Conserva el error y revisa configuración y herramientas usadas |
| Solo pudiste simular | Identifica la simulación y deja pendiente la integración; no uses una captura ajena como prueba propia |
| Falla verify o queda una revisión en curso | Registra el resultado real y el siguiente paso; no aceptes todavía PAY-104 |
| Aparece un cambio que no entiendes | Revisa el archivo con el practitioner. No uses `git reset --hard` ni borres trabajo previo |

## Cierre y entrega

**Minutos 112–116:** dos participantes comparten evidencia durante un
minuto cada uno y el grupo contrasta:

- ¿Qué encontró el reviewer que una suite verde inicial no demostraba?
- ¿Qué bloqueó el hook y qué quedó fuera?
- ¿Qué evidencia cambió tu decisión de aceptar o rechazar?

**Minutos 116–120:** completa la reflexión final del portafolio y conserva
los artefactos para la sesión 5. En la siguiente sesión elegirás las
herramientas que necesita una solicitud nueva; no tienes que usar todas.

Entregas **un archivo individual**:

1. Completa los tres checkpoints de [`docs/portafolio.md`](./docs/portafolio.md).
2. Adjunta capturas o extractos legibles que prueben cada checkpoint.
   Agrúpalos por CP1, CP2 y CP3, sin una cuota fija de capturas. Si usas
   imágenes, adjúntalas junto con el Markdown o usa enlaces accesibles
   para quien revisa; una ruta local de tu equipo no le servirá.
3. Guarda una copia como `portafolio-sesion-4-<nombre-apellido>.md` y
   envíala por el canal del programa. No entregas por commit ni PR.

No se entrega `docs/lab-notes.md` por separado. Si algo quedó pendiente,
inclúyelo con su evidencia y siguiente paso: entregar el portafolio no
convierte un resultado incompleto en `Done with evidence`.

## Reglas del laboratorio

- Trabaja con los datos sintéticos del curso. La prueba de bloqueo usa
  únicamente `fixtures/protected/demo.env`, nunca un `.env` real.
- No incluyas secretos, datos reales ni rutas personales completas en la
  entrega o sus capturas.
- El reviewer es de solo lectura. La conversación principal corrige y la
  persona confirma los hallazgos y acepta el resultado.
- Conserva la spec aprobada, las pruebas existentes y los límites del
  cambio. No agregues dependencias ni implementes fuera de S4.
- El script del hook se usa tal como viene. Distingue una simulación de
  una ejecución integrada en Claude.
- La solución de referencia la comparte el practitioner al cerrar la
  sesión. No la uses como punto de partida del laboratorio.

Consulta [`CLAUDE.md`](./CLAUDE.md) para las convenciones y la definición
de terminado.

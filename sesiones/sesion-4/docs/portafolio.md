# Portafolio de evidencias — sesión 4

**Entrega individual.** Completa este archivo durante las fases del
[README](../README.md), guarda una copia como
`portafolio-sesion-4-<nombre-apellido>.md` y envíala por el canal del
programa. No necesitas commit ni pull request.

Organiza la evidencia en **tres checkpoints**. Puedes combinar capturas y
extractos de salida; usa los necesarios para que el resultado sea legible,
sin una cuota fija. Adjunta las imágenes o usa enlaces accesibles para
quien revisa. No incluyas secretos, datos reales ni rutas personales
completas. `docs/lab-notes.md` es una bitácora de apoyo y no se entrega
por separado.

Si algo quedó pendiente, escribe el resultado real, el bloqueo y el
siguiente paso. Una simulación, una captura del practitioner y una
operación real en tu equipo son evidencias distintas: identifícalas.

- Nombre:
- Fecha:
- Sistema operativo y terminal:
- Versión de Node.js:
- Versión de Claude Code:
- Resultado inicial de `npm run verify` (checks, tests y resultado real):

## Checkpoint 1 — Reviewer definido e invocado

**Validación en clase: minutos 41–44.**

### Definición y decisión de herramientas

- Archivo: `.claude/agents/payment-reviewer.md`.
- Nombre del agente:
- Herramientas permitidas:
- Modelo:
- Responsabilidad del agente, en una frase:
- ¿Por qué excluiste `Bash`, `Edit` y `Write`?
- ¿Qué debe hacer si falta la spec, el alcance o la evidencia?

### Invocación y resultado

- Spec proporcionada:
- Alcance por archivos o diff que proporcionaste:
- Evidencia de verify que compartiste:
- ¿La conversación mostró delegación a `payment-reviewer`?
- Un criterio de aceptación que revisó y el hallazgo o resultado asociado:

**Evidencia CP1:** definición con frontmatter visible, delegación por
nombre y un resultado trazado a la spec. `/agents` no es una captura
obligatoria. Pega aquí las capturas o extractos.

>

- Estado CP1: completo / pendiente.
- Si quedó pendiente: bloqueo, paso del README y siguiente acción:

## Checkpoint 2 — Hook simulado e integrado

**Validación en clase: minutos 62–64 y 75–78.**

### Predicción y simulación del script

Anota `2` para bloquear o `0` para permitir. En la tercera fila indica si
lo comprobaste por ejecución o por lectura de los patrones.

| Ruta | Predicción | Resultado observado | Cómo lo comprobé / razón |
|---|---|---|---|
| `fixtures/protected/demo.env` | | | |
| `docs/lab-notes.md` | | | |
| `package-lock.json` | | | |

### Prueba real dentro de Claude Code

- Archivo de configuración: `.claude/settings.json`.
- ¿`/hooks` mostró `PreToolUse` y el matcher `Edit|Write` del proyecto?
- Comando del hook utilizado y variante de shell, si cambiaste la indicada:

| Intento | Herramienta utilizada | Resultado y mensaje | Estado del archivo después |
|---|---|---|---|
| Editar `fixtures/protected/demo.env` | | | |
| Editar `docs/lab-notes.md` | | | |

**Evidencia CP2:** agrupa el mensaje del hook que bloqueó el primer
intento, el fixture sin cambios y la edición permitida aplicada. Si Claude
solo se negó verbalmente o hubo un rechazo general de permisos, registra
eso: no prueba la ejecución del hook del curso.

>

- ¿Qué operación queda fuera del matcher? ¿Qué control adicional necesitaría?
- ¿Por qué una simulación por stdin no demuestra la integración con Claude?
- Estado CP2: integración demostrada / solo simulación / pendiente.
- Si quedó pendiente: error, paso del README y siguiente acción:

## Checkpoint 3 — Revisión, corrección y decisión humana

**Validación en clase: minutos 109–112.**

### Hallazgos que contrastaste

Agrega las filas que necesites. Usa **confirmado / rechazado / pendiente**
y cita la evidencia de tu decisión. No inventes un hallazgo rechazado si
no lo hubo.

| Hallazgo del reviewer | Criterio de la spec | Archivo / evidencia que revisé | Mi decisión y razón | Corrección, si aplica |
|---|---|---|---|---|
| | | | | |

### Criterios de aceptación comprobados

La [spec de PAY-104](./changes/PAY-104-spec.md) es el contrato completo.
Estas etiquetas solo ayudan a ubicar sus 11 criterios. En «evidencia»
identifica archivo y test, salida de comando o inspección pertinente.
Escribe **cumple / no cumple / pendiente**, sin dejar criterios implícitos.

| CA | Referencia breve | Evidencia comprobada | Estado |
|---|---|---|---|
| 1 | `APPROVED` a `REVERSED` | | |
| 2 | Rechazo desde `PENDING` sin cambiar el pago | | |
| 3 | Rechazo desde `DECLINED` con prueba explícita | | |
| 4 | Estado terminal `REVERSED` | | |
| 5 | Idempotencia de `REVERSED` | | |
| 6 | Error tipado y mensaje con estados | | |
| 7 | Normalización del valor del proveedor | | |
| 8 | Regresión de las reglas anteriores | | |
| 9 | Interfaces públicas sin cambios | | |
| 10 | Sin dependencias de producción nuevas | | |
| 11 | Documentación del flujo actualizada | | |

### Verificación y alcance final

- Prueba que falló antes de corregir y pasó después, con su resultado real:
- Si agregaste cobertura que ya pasaba, ¿qué criterio demuestra?
- Resultado final de `npm run verify` (type-check, lint, tests y resultado):
- Resultado de `git diff --check -- .` ejecutado desde S4:
- Veredicto de la revisión final de `payment-reviewer` y bloqueantes pendientes:
- Archivos del cambio de dominio que revisaste, incluidos archivos nuevos:
- Artefactos del laboratorio que modificaste (agente, settings, notas, portafolio):
- ¿Encontraste cambios fuera de alcance? ¿Cómo los resolviste?

**Evidencia CP3:** agrupa la revisión final, los resultados de los checks y
el diff pertinente. El número de tests debe corresponder a tu ejecución;
no copies el número del starter como si fuera evidencia propia.

>

### Tu aceptación de PAY-104

- **Decisión humana: acepto PAY-104 / no acepto todavía.**
- Razón de la decisión, vinculada a criterios y evidencia:
- Bloqueantes o verificaciones pendientes (o «ninguno», si lo comprobaste):
- Siguiente paso concreto, si no aceptaste:

La decisión sobre PAY-104 no cambia el estado de CP2. Si el cambio está
verificado pero el hook solo se simuló, conserva esa diferencia.

## Reflexión y estado de entrega

¿Qué encontró el reviewer que una suite verde inicial no demostraba?

>

¿Qué decisión tomaste tú después de revisar la evidencia?

>

¿Qué demuestra el hook y qué sigue necesitando tests o revisión humana?

>

| Checkpoint | Completo / pendiente | Pendiente y siguiente paso, si aplica |
|---|---|---|
| CP1: definición e invocación | | |
| CP2: bloqueo y operación permitida reales | | |
| CP3: checks y aceptación humana | | |

**Antes de enviar:** comprueba que las evidencias sean legibles, que las
imágenes estén adjuntas o accesibles y que tu decisión humana esté escrita.
Entregar este archivo con pendientes documentados no equivale a declarar
`Done with evidence`.

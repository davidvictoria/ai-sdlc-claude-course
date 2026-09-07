# AI-SDLC Team Workflow

> Plantilla vacía y **entrega individual**. Completa cada sección con tus
> propias decisiones para `PAY-105`. No copies texto de otra sesión ni
> inventes respuestas: cada campo vacío es una decisión que tienes que
> tomar. No se evalúa cuánta IA usaste, sino si otra persona puede repetir
> el workflow y verificar el resultado.
>
> Al terminar, renombra este archivo como
> `workflow-sesion-5-<nombre-apellido>.md` y envíalo por el canal del
> programa.

- Nombre:
- Fecha:
- Roles del workflow (quién decide alcance, quién verifica, quién acepta el
  diff) y a qué puesto real corresponden en tu equipo de trabajo:

---

## A. Identidad

*Nota: las secciones A, B y C constituyen la ficha de diseño funcional y
técnico de este workflow.*

- Nombre del workflow y actividad del SDLC que cubre:
- Usuario principal (quién lo ejecuta o lo solicita):
- Cuándo usar este workflow:
- Cuándo NO usar este workflow:

## B. Ruta y decisiones

*Nota: esta sección forma parte de la ficha de diseño funcional y técnico.*

- Ruta elegida (rápida / estándar / reforzada) y justificación en una frase:
- Riesgos identificados para este cambio:
- Decisiones humanas (lista cada decisión, quién la resuelve, y su
  respuesta o el estado "pendiente"):
  1.
  2.
- Condición para escalar la ruta (de estándar a reforzada, por ejemplo) o
  para detenerse por completo:

## C. Arquitectura

*Nota: esta sección forma parte de la ficha de diseño funcional y técnico.*

- Contexto de proyecto usado y su ubicación (`CLAUDE.md`, `.claude/rules/`,
  otros):
- Capacidades seleccionadas (marca las que usas y dónde vive cada una):
  - [ ] Skill: `.claude/skills/payment-change/SKILL.md`
  - [ ] Agente de revisión: `.claude/agents/payment-reviewer.md`
  - [ ] Hook de protección: `.claude/hooks/protect-files.mjs`
  - [ ] MCP local: `scripts/course-mcp-server.mjs`
  - [ ] Otro (especificar):
- Capacidades omitidas y motivo (al menos una, con una razón concreta, no
  "no me alcanzó el tiempo"):
- Tools y permisos habilitados para cada mecanismo (por ejemplo, tools del
  agente de revisión, alcance del hook):
- Trust boundaries: qué contenido se trata como dato no confiable (por
  ejemplo, lo recuperado por MCP) y qué contenido se trata como instrucción
  confiable:

## D. Flujo reproducible

Completa la tabla con las etapas mínimas: intake, exploración, spec,
diseño/plan, implementación, tests/checks, review y cierre. Agrega filas si
usas etapas adicionales.

| Etapa | Claude | Humano | Input | Output | Gate/check |
|---|---|---|---|---|---|
| Intake | | | | | |
| Exploración | | | | | |
| Spec | | | | | |
| Diseño/Plan | | | | | |
| Implementación | | | | | |
| Tests/checks | | | | | |
| Review | | | | | |
| Cierre | | | | | |

## E. Definition of done

- Criterios de la spec cubiertos (lista o referencia a la tabla de
  trazabilidad del plan):
- Tests positivos, negativos y de regresión presentes (sí/no y dónde
  viven):
- Resultado de `npm run verify`:
- Blockers del review resueltos (lista, o "ninguno"):
- Diff aceptado por un humano (quién, cuándo):
- Evidencia registrada sin datos sensibles (confirmar):

## F. Reproducción

- Prerrequisitos y baseline (cómo confirmar que el entorno está listo antes
  de empezar):
- Instrucción de inicio (el primer comando o acción que ejecuta otra
  persona):
- Orden de los gates (Workflow ready → Spec ready → Plan ready → Done
  with evidence, o el orden real que usaste):
- Comandos y resultado observable esperado en cada uno:
- Qué hacer si un paso falla (recuperación):

## G. Adopción acotada

- Práctica a probar en tu equipo de trabajo (retoma un quick win del mapa
  priorizado de oportunidades de la sesión 1,
  `sesiones/sesion-1/docs/portafolio.md`; si no tienes ese mapa, elige una
  actividad real de tu SDLC y justifícala en dos frases):
- Tipo y cantidad de tareas donde se probará:
- Señal a observar para saber si funciona:
- Condición para ajustar el workflow o abandonarlo:

---

## Reflexión (máximo 100 palabras)

Una decisión que no delegaste a Claude, el control que te resultó más
útil, y la práctica que probarás después de esta sesión.

>

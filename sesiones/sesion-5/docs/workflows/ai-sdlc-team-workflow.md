# AI-SDLC Team Workflow

> Plantilla vacia. Completa cada seccion con las decisiones reales de tu
> equipo para `PAY-105`. No copies texto de otra sesion ni inventes
> respuestas: cada campo vacio es una decision que tu equipo debe tomar.
> No se evalua cuanta IA usaron, sino si otro equipo puede repetir el
> workflow y verificar el resultado.

- Equipo:
- Fecha:
- Roles (Driver / Product-Scope owner / Quality owner / Evidence keeper):

---

## A. Identidad

*Nota: las secciones A, B y C constituyen la ficha de diseño funcional y
tecnico de este workflow.*

- Nombre del workflow y actividad del SDLC que cubre:
- Usuario principal (quien lo ejecuta o lo solicita):
- Cuando usar este workflow:
- Cuando NO usar este workflow:

## B. Ruta y decisiones

*Nota: esta seccion forma parte de la ficha de diseño funcional y tecnico.*

- Ruta elegida (rapida / estandar / reforzada) y justificacion en una frase:
- Riesgos identificados para este cambio:
- Decisiones humanas (lista cada decision, quien la resuelve, y su
  respuesta o el estado "pendiente"):
  1.
  2.
- Condicion para escalar la ruta (de estandar a reforzada, por ejemplo) o
  para detenerse por completo:

## C. Arquitectura

*Nota: esta seccion forma parte de la ficha de diseño funcional y tecnico.*

- Contexto de proyecto usado y su ubicacion (`CLAUDE.md`, `.claude/rules/`,
  otros):
- Capacidades seleccionadas (marca las que tu equipo usa y donde vive cada
  una):
  - [ ] Skill: `.claude/skills/payment-change/SKILL.md`
  - [ ] Agente de revision: `.claude/agents/payment-reviewer.md`
  - [ ] Hook de proteccion: `.claude/hooks/protect-files.mjs`
  - [ ] MCP local: `scripts/course-mcp-server.mjs`
  - [ ] Otro (especificar):
- Capacidades omitidas y motivo (al menos una, con una razon concreta, no
  "no nos alcanzo el tiempo"):
- Tools y permisos habilitados para cada mecanismo (por ejemplo, tools del
  agente de revision, alcance del hook):
- Trust boundaries: que contenido se trata como dato no confiable (por
  ejemplo, lo recuperado por MCP) y que contenido se trata como instruccion
  confiable:

## D. Flujo reproducible

Completa la tabla con las etapas minimas: intake, exploracion, spec,
diseno/plan, implementacion, tests/checks, review y cierre. Agrega filas si
tu equipo usa etapas adicionales.

| Etapa | Claude | Humano | Input | Output | Gate/check |
|---|---|---|---|---|---|
| Intake | | | | | |
| Exploracion | | | | | |
| Spec | | | | | |
| Diseno/Plan | | | | | |
| Implementacion | | | | | |
| Tests/checks | | | | | |
| Review | | | | | |
| Cierre | | | | | |

## E. Definition of done

- Criterios de la spec cubiertos (lista o referencia a la tabla de
  trazabilidad del plan):
- Tests positivos, negativos y de regresion presentes (si/no y donde
  viven):
- Resultado de `npm run verify`:
- Blockers del review resueltos (lista, o "ninguno"):
- Diff aceptado por un humano (quien, cuando):
- Evidencia registrada sin datos sensibles (confirmar):

## F. Reproduccion

- Prerrequisitos y baseline (como confirmar que el entorno esta listo antes
  de empezar):
- Instruccion de inicio (el primer comando o accion que ejecuta otra
  persona):
- Orden de los gates (Workflow ready -> Spec ready -> Plan ready -> Done
  with evidence, o el orden real que uso tu equipo):
- Comandos y resultado observable esperado en cada uno:
- Que hacer si un paso falla (recuperacion):

## G. Adopcion acotada

- Practica a probar en el equipo (retoma un quick win del mapa priorizado
  de oportunidades de la sesion 1, `sesiones/sesion-1/docs/portafolio.md`;
  si el equipo no tiene ese mapa, elige una actividad real de su SDLC y
  justificala en dos frases):
- Tipo y cantidad de tareas donde se probara:
- Senal a observar para saber si funciona:
- Condicion para ajustar el workflow o abandonarlo:

---

## Reflexion (maximo 100 palabras)

Una decision que el equipo no delego a Claude, el control que resulto mas
util, y la practica que probaran despues de esta sesion.

>

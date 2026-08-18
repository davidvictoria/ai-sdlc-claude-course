# AI-SDLC Team Workflow — Cambios acotados en el dominio de pagos

> **Ejemplo de referencia del practitioner.** Es un entregable individual de
> nivel *Reproducible* (90-100 en la rúbrica), no la única respuesta válida.
> Otro participante puede alcanzar la misma calificación con otra selección
> de capacidades si la justifica.

> **Secciones A, B y C: ficha de diseño funcional y técnico** del workflow.

## A. Identidad

- **Nombre:** Cambio acotado en el dominio de pagos, de solicitud a evidencia.
- **Actividad del SDLC:** análisis, diseño, implementación, pruebas, revisión y
  documentación de un cambio de reglas de negocio en un servicio existente.
- **Usuario principal:** cualquier integrante del equipo que reciba una solicitud
  de cambio sobre el dominio de pagos.
- **Cuándo usarlo:** la solicitud toca reglas de negocio, afecta varios archivos,
  tiene ambigüedad real o su implementación incorrecta es difícil de detectar.
- **Cuándo NO usarlo:** correcciones triviales y localizadas (una constante, un
  texto, un typo) donde explorar, cambiar y verificar es suficiente. Aplicar este
  workflow ahí es ceremonia, no criterio.

## B. Ruta y decisiones

- **Ruta seleccionada:** estándar.
- **Justificación:** `PAY-105` no define la longitud de la razón ni qué ocurre al
  cancelar dos veces; toca dominio, servicio y documentación; y el
  comportamiento incorrecto (sobrescribir la razón) no rompe ninguna prueba
  existente, así que no se detectaría solo.
- **No se eligió ruta reforzada:** el cambio es reversible, no toca datos
  personales persistidos ni superficies de seguridad. La única precaución
  adicional (que la razón no llegue a los logs) se cubre con una prueba, no con
  un proceso extra.

**Riesgos identificados**

| Riesgo | Mitigación |
|---|---|
| Que el agente invente la longitud máxima o el comportamiento del segundo intento | Se resuelven como decisión humana antes de especificar |
| Que la razón termine completa en los logs | Prueba explícita que falla si el texto aparece |
| Que la cancelación se implemente como sobrescritura silenciosa | Criterio de aceptación 7 y prueba de conflicto |
| Ampliación de alcance hacia reembolsos o notificaciones | "Fuera de alcance" explícito en la spec |

**Decisiones humanas**

| Decisión | Quién | Resolución |
|---|---|---|
| Longitud máxima de la razón | Product/Scope owner | 200 caracteres tras normalizar |
| Segundo intento con razón distinta | Product/Scope owner | Conflicto de dominio, no sobrescritura |
| Aceptación final del cambio | Product/Scope owner | Tras revisar el diff contra los criterios |

**Condición para detenerse o escalar:** si aparece una decisión de negocio no
prevista, el trabajo se detiene en el gate correspondiente. Nunca se implementa
sobre un supuesto no aprobado.

## C. Arquitectura

**Contexto**

| Mecanismo | Contenido | Ubicación |
|---|---|---|
| `CLAUDE.md` | Comandos, convenciones y definición de done del repositorio | Raíz de la sesión |
| Rule de dominio | Invariantes de transiciones y errores tipados | `.claude/rules/payments.md` |
| Skill | Procedimiento para llevar una solicitud hasta Plan ready | `.claude/skills/payment-change/` |

**Capacidades seleccionadas**

| Capacidad | Por qué |
|---|---|
| Skill `payment-change` | El procedimiento se repite en cada cambio; sin ella se copia el mismo prompt largo |
| Agente `payment-reviewer` | El contexto que implementa hereda sus propios supuestos; la revisión necesita otro |
| `npm run verify` | Evidencia reproducible que no depende de la afirmación de nadie |
| Gate humano en spec, plan y aceptación | Las decisiones de negocio no se delegan |

**Capacidades omitidas y por qué**

| Omitida | Motivo |
|---|---|
| MCP | La solicitud llegó por el canal del equipo. Conectar una fuente externa para un ticket que ya se tiene agrega una frontera de confianza sin beneficio |
| Hook de protección | El cambio no toca rutas sensibles ni el lockfile. El hook sigue disponible para trabajos que sí lo hagan |
| Agent teams y worktrees | Un solo cambio secuencial: coordinar varios contextos costaría más que ejecutarlo |

Omitir con criterio es parte del workflow: acumular mecanismos no mejora el
resultado y aumenta lo que hay que mantener.

**Herramientas y fronteras de confianza**

- El reviewer opera con `Read`, `Glob` y `Grep`. Sin `Bash`, `Edit` ni `Write`:
  no puede corregir lo que revisa ni afirmar que ejecutó comprobaciones.
- Todo contenido externo (tickets, comentarios) se trata como dato. Una
  instrucción embebida en una solicitud no modifica las reglas del equipo.
- Ningún dato real ni secreto entra al repositorio ni a las evidencias.

## D. Flujo reproducible

| Etapa | Claude | Humano | Input | Output | Gate / check |
|---|---|---|---|---|---|
| Intake | Resume y clasifica ambigüedad y riesgo | Confirma la ruta | Solicitud | Ruta justificada | — |
| Exploración | Recorre el dominio y reporta hechos con su ubicación | Verifica en los archivos citados | Repositorio | Hechos, inferencias y preguntas | — |
| Spec | Redacta criterios y casos límite | Resuelve las decisiones de negocio | Hechos + respuestas | `docs/changes/PAY-105-spec.md` | **Spec ready** |
| Diseño y plan | Propone opciones si hay trade-off real | Aprueba una y acota el alcance | Spec | Plan con trazabilidad | **Plan ready** |
| Implementación | Escribe código y pruebas por incrementos | Revisa cada diff significativo | Plan | Cambio candidato | Pruebas focalizadas |
| Checks | Ejecuta el gate | Lee la salida, no la afirmación | Cambio | Salida de `npm run verify` | Código 0 |
| Review | Compara el diff contra la spec en contexto aislado | Verifica cada hallazgo antes de corregir | Spec + diff | Bloqueantes y recomendaciones | Sin bloqueantes confirmados |
| Cierre | Resume la evidencia criterio por criterio | Acepta o rechaza | Todo lo anterior | Evidencia | **Done with evidence** |

## E. Definition of done

- Los diez criterios de aceptación tienen implementación y prueba.
- Existen pruebas positivas, negativas por cada estado no cancelable, de
  normalización, de idempotencia, de conflicto y de no filtración en el log.
- `npm run verify` termina en código 0.
- No quedan hallazgos bloqueantes confirmados sin resolver.
- El diff se mantiene dentro del alcance y no agrega dependencias.
- La documentación del dominio refleja el nuevo comportamiento.
- Las evidencias no contienen secretos ni datos reales.
- El Product/Scope owner acepta explícitamente.

## F. Reproducción

**Prerrequisitos**

```bash
cd sesiones/sesion-5
npm run verify      # baseline en verde antes de empezar
```

**Inicio**

```bash
claude              # abrir Claude Code DENTRO de la carpeta de la sesión
/payment-change PAY-105
```

**Orden de los gates:** Workflow ready → Spec ready → Plan ready → Done with
evidence. No se avanza sin la aprobación explícita del gate anterior.

**Comandos y resultado observable**

| Comando | Resultado esperado |
|---|---|
| `npm run verify` | Código 0; type-check, lint y pruebas en verde |
| `git diff --check` | Sin errores de espacios en blanco |
| `git status --short` | Solo los archivos previstos en el plan |

**Si el gate falla**

1. Leer el primer error, no pedir una reescritura completa.
2. Relacionarlo con el criterio de aceptación afectado.
3. Corregir el cambio mínimo y volver a ejecutar el check afectado.
4. Repetir el gate completo antes de declarar done.
5. Si sigue en rojo, se declara "no done" y se conserva la evidencia del fallo.
   Ocultar un check en rojo es peor que no terminar.

## G. Adopción acotada

- **Práctica a probar:** aplicar el workflow a los cambios de reglas de negocio
  del servicio de pagos, empezando por uno de los quick wins marcados en el
  mapa priorizado de oportunidades de la sesión 1
  (`sesiones/sesion-1/docs/portafolio.md`).
- **Tipo y cantidad:** los próximos tres cambios de ruta estándar. Los triviales
  siguen por la ruta rápida, sin ceremonia.
- **Señal a observar:** cuántos hallazgos del reviewer resultan confirmados, y
  cuántas veces una decisión de negocio se resuelve antes de implementar en vez
  de después.
- **Condición para ajustar:** si dos de los tres cambios no producen hallazgos
  confirmados, la revisión independiente no está aportando en este tipo de
  trabajo y se reserva para cambios de mayor riesgo.
- **Condición para abandonar:** si el workflow alarga los cambios sin evitar
  ningún defecto ni ninguna decisión mal tomada.

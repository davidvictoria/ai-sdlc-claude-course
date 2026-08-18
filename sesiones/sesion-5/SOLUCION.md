# Solución de referencia · Sesión 5 (capstone)

Material del practitioner. No se comparte antes del cierre.

## Qué contiene esta rama

| Archivo | En `main` | En esta solución |
|---|---|---|
| `src/domain/cancellation.ts` | No existe | Normalización, límites y errores tipados |
| `src/domain/transitions.ts` | Sin `CANCELLED` | `PENDING → CANCELLED`; `CANCELLED` terminal |
| `src/service/payment-service.ts` | Sin `cancelPayment` | Cancelación con idempotencia, conflicto y auditoría |
| `tests/cancellation.test.ts` | No existe | 15 pruebas de PAY-105 |
| `docs/changes/PAY-105-spec.md` | No existe | Spec aprobada con las decisiones humanas marcadas |
| `docs/workflows/ai-sdlc-team-workflow.md` | Plantilla vacía | Entregable completo de nivel Reproducible |

`npm run verify`: código 0, 65 pruebas.

## Las dos decisiones humanas

El capstone está construido para que el equipo **no pueda terminar sin decidir**.
Ninguna de las dos se infiere del código, y Claude debe presentarlas como
preguntas después de explorar, no resolverlas por su cuenta:

| Decisión | Resolución de referencia | Qué observar |
|---|---|---|
| Longitud máxima de la razón | 200 caracteres tras normalizar | Cualquier límite razonable es válido si queda registrado y probado |
| Segundo intento con razón distinta | `CancellationConflictError` | Sobrescribir en silencio es la respuesta incorrecta: destruye la evidencia de auditoría |

Si un equipo implementó un límite distinto y lo justificó, cumple. Si lo dejó sin
definir o lo inventó el agente sin aprobación, no cumple: es el gate que la
sesión evalúa.

## Decisiones de diseño que conviene señalar en el cierre

- **`CANCELLED` no está en `normalizeProviderStatus`.** La cancelación es una
  acción interna del equipo, no una notificación del proveedor. Un equipo que la
  agregó al normalizador amplió el alcance sin necesidad; conviene señalarlo con
  cuidado: no es un error grave, es una oportunidad de hablar de fronteras.
- **El logger se inyecta y su default es no-op.** El dominio no decide dónde va la
  auditoría. Además evita depender de tipos de plataforma, que habría requerido
  una dependencia nueva (prohibida por las convenciones del repositorio). Es un
  buen ejemplo de restricción que empuja hacia un diseño mejor.
- **La idempotencia compara la razón ya normalizada**, de modo que
  `"pago  duplicado"` y `"pago duplicado"` son la misma cancelación.

## Cómo calificar con la rúbrica

| Dimensión | Puntos | Qué buscar en el entregable |
|---|---:|---|
| Problema, ruta y alcance | 15 | Ruta justificada y un "cuándo NO usarlo" real, no genérico |
| Responsabilidades humano-IA | 15 | Las dos decisiones aparecen como humanas, con owner |
| Contexto y capacidades | 15 | **Al menos una capacidad omitida con motivo concreto** |
| Spec y trazabilidad | 20 | Cada criterio mapeado a archivo, prueba y comando |
| Implementación y verificación | 20 | Diff acotado, pruebas negativas y gate en verde |
| Review y evidencia | 10 | Hallazgos verificados contra el código, no aceptados por venir del agente |
| Reproducibilidad y adopción | 5 | Otro equipo responde las cinco preguntas de la revisión cruzada |

El error más común es acumular mecanismos: un equipo que conecta MCP, habilita el
hook y crea tres agentes "porque los aprendimos" **pierde puntos** en Contexto y
capacidades. La competencia evaluada es elegir la menor complejidad que cubre el
riesgo.

## Hints graduados

| Hint | Cuándo | Qué entregar |
|---|---|---|
| 1 · Dirección | Exploran sin encontrar el punto de entrada | "Revisen las transiciones y la idempotencia existentes antes de proponer archivos" |
| 2 · Estructura | Tienen la spec pero no saben dónde tocar | Los módulos relevantes, sin código |
| 3 · Recuperación | Faltan menos de 25 minutos y no hay implementación | Parche con la implementación base; el equipo aún escribe las pruebas negativas, ejecuta la review y documenta |

Registrar el uso del Hint 3: no recibe puntaje completo en Implementación.

## Revisión cruzada

El equipo receptor recibe **solo el documento**, sin explicación oral, y responde:

1. ¿Cuándo se usa este workflow y cuándo no?
2. ¿Cuál es el primer comando?
3. ¿Dónde se detiene para aprobación?
4. ¿Cómo demuestra que terminó?
5. ¿Qué hace si el gate falla?

Si no puede responder alguna, el autor corrige el documento. Una explicación oral
no sustituye a la documentación: ese es justamente el criterio de reproducibilidad.

## Cierre honesto

Un equipo que llega al minuto final con un check en rojo, lo muestra y declara
"no done" demuestra mejor criterio que uno que oculta el resultado. Conviene
decirlo en voz alta durante el cierre: la evidencia negativa también es evidencia.

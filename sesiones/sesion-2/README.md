# Sesión 2 — Del brief ambiguo al cambio verificado

Laboratorio del curso AI-SDLC. Mismo servicio de pagos **ficticio** de la
sesión 1, con el comportamiento de esa sesión ya corregido. No dependes de
haber terminado la sesión 1: este snapshot arranca desde un estado limpio.

## Tu misión

Convierte una solicitud ambigua sobre transiciones de estado en un cambio
verificable, manteniendo las decisiones de negocio y la aprobación en el
equipo humano.

Cinco actividades, tres checkpoints, 88 minutos.

El brief llega en la sesión, en pantalla. Llega como llegan los briefs
reales: una frase, con supuestos no dichos y con decisiones que nadie tomó
todavía. Lo que sí puedes saber desde ahora es que hoy
`PaymentService.applyProviderUpdate` aplica lo que el proveedor envía, sin
validar nada. El brief pide cambiar eso.

## Cómo se trabaja

Equipos de 4 en salas. El driver rota en cada actividad: quien escribe en
la terminal cambia cinco veces, y quien no escribe revisa el diff.

Cada equipo recibe una **tarjeta de decisiones de negocio** con las
respuestas del dueño del producto. Regla de uso, y es la que más se
incumple:

> No peguen la tarjeta completa en el prompt. Ábranla solo cuando Claude
> pregunte, y respondan únicamente lo que preguntó.

Quien vuelca la tarjeta de golpe se salta la entrevista, que es la mitad
del aprendizaje del día.

**La entrega es individual.** Trabajan en equipo, discuten en equipo y
comparten pantalla, pero cada persona completa y envía su propio
`docs/portafolio.md`.

## Preflight

Abre la terminal **dentro de esta carpeta**, no en la raíz del repositorio:

```bash
cd sesiones/sesion-2
npm run verify
claude
```

`npm run verify` encadena `typecheck`, `lint` y `test`, y debe terminar en
verde antes de empezar. Si no lo hace, avisa al practitioner antes del
minuto 3.

## El reloj

| # | Actividad | Minutos | Checkpoint |
|---|---|---|---|
| 1 | Aclarar y especificar | 23 | Spec ready |
| 2 | Diseñar y planificar | 20 | Plan ready |
| — | Break | 5 | — |
| 3 | Implementar | 23 | — |
| 4 | Review independiente | 14 | — |
| 5 | Verificar y documentar | 8 | Done with evidence |

---

## Actividad 1 — Aclarar y especificar (23')

1. Clasifiquen la ruta (rápida, estándar o reforzada) y escriban una frase
   de justificación.
2. Entreguen el brief a Claude pidiendo que investigue el repositorio
   **antes** de preguntar, y que no modifique archivos.
3. Marquen cada conclusión como hecho, inferencia o decisión humana.
4. Respondan solo lo preguntado, desde la tarjeta.
5. Pidan la especificación con sus nueve secciones.
6. Reléanla buscando reglas que ustedes nunca acordaron.

Prompt de entrevista:

```text
No modifiques ningún archivo en este turno.

Brief del negocio: "evitar que un pago pueda regresar a un estado anterior".

1. Antes de preguntarme nada, investiga este repositorio y responde tú mismo:
   qué estados existen, qué contrato público expone el servicio, qué pruebas
   cubren hoy ese comportamiento y qué comando produce la evidencia.
2. Clasifica todo lo que sepas en tres listas: hecho observado (con archivo y
   línea), inferencia que necesita validación, y decisión de negocio que me
   corresponde a mí.
3. Hazme solo las preguntas de la tercera lista, agrupadas y numeradas. No
   preguntes nada que el repositorio ya responda.
```

Prompt de especificación, cuando ya respondiste desde la tarjeta:

```text
Con las decisiones que acabo de responder, escribe la especificación en
docs/changes/PAY-102-spec.md, completando las nueve secciones de la plantilla.

Cada criterio de aceptación tiene que ser verificable con una prueba o con un
comando. No inventes reglas que yo no haya acordado: si falta una decisión,
déjala marcada como PENDIENTE y pregúntamela.
```

**Checkpoint 1 — Spec ready.** Captura que muestre ruta y justificación,
reglas acordadas, criterios de aceptación, casos límite y fuera de alcance.
Avanzas si están definidos estados, transiciones, idempotencia, error,
compatibilidad y un "terminado" verificable.

| Si pasa esto | Hagan esto |
|---|---|
| Claude inventa reglas | Pídanle la lista explícita de supuestos y resuélvanlos antes de seguir |
| Hace demasiadas preguntas | "Investiga primero lo que el repo puede responder, y agrupa" |
| Se ofrece a implementar | Recuérdenle que no debe modificar archivos |
| Van tarde | Cierren con criterios y casos límite; el resto es ganancia |

---

## Actividad 2 — Diseñar y planificar (20')

1. Pidan a Claude explorar el repositorio con la spec aprobada, sin
   modificar archivos.
2. Pidan dos opciones reales, con componentes afectados, ventajas, riesgos,
   impacto en pruebas y compatibilidad.
3. Elijan una y escriban por qué descartaron la otra.
4. Pidan el plan trazable: criterio → archivo → cambio → prueba → comando.
5. Verifiquen que cada criterio de la spec aparece en el plan.

```text
Lee docs/changes/PAY-102-spec.md. No modifiques código en este turno.

1. Propón dos opciones reales de diseño para cumplir la spec. Para cada una:
   componentes afectados, ventajas, riesgos, impacto en las pruebas y en la
   compatibilidad. Si no hay un trade-off real entre las dos, dímelo en vez de
   inventar una segunda para complacerme.
2. Espera mi elección antes de continuar.
3. Con la opción elegida, escribe el plan en docs/changes/PAY-102-plan.md como
   una tabla: criterio → archivo → cambio previsto → prueba → comando que
   produce la evidencia. Una fila por criterio de la spec, y ninguna fila que
   no responda a un criterio.
```

**Checkpoint 2 — Plan ready.** Captura que muestre opción aprobada,
archivos afectados, estrategia de pruebas, riesgos y comando de
verificación. Avanzas si cada criterio tiene implementación o prueba, no
hay cambios fuera de alcance, hay pruebas positivas y negativas, y `verify`
está definido.

| Si pasa esto | Hagan esto |
|---|---|
| Plan demasiado amplio | Compárenlo con el fuera de alcance y pidan el slice mínimo |
| Plan que no conecta pruebas | Pidan la tabla completa y no aprueben hasta que lo esté |
| Aparecen refactors no pedidos | Fuera |
| Van tarde | Aprueben con un criterio menos, pero nunca uno sin prueba |

---

## Actividad 3 — Implementar (23')

1. Pidan implementar la spec y el plan aprobados, nada más.
2. Pasen las restricciones textuales.
3. Exijan casos positivos, negativos, idempotentes y de regresión.
4. Pidan que ejecute las pruebas relevantes durante el trabajo.
5. Revisen el diff mientras avanza; si se sale del alcance, deténganlo.

```text
Implementa docs/changes/PAY-102-spec.md siguiendo docs/changes/PAY-102-plan.md.
Nada más que eso.

Restricciones:
1. Valida las entradas del cambio.
2. Preserva la compatibilidad: las firmas públicas de applyProviderUpdate y de
   handleProviderNotification no cambian.
3. No agregues dependencias.
4. No elimines ni debilites pruebas existentes. Nada de skip ni de todo.
5. Los errores de dominio extienden DomainError; no lances Error genérico.
6. No registres ni expongas datos sensibles.
7. No toques archivos fuera del alcance de la spec.

Escribe pruebas positivas, negativas, de idempotencia y de regresión. Ejecuta
las pruebas relevantes mientras trabajas y muéstrame la salida. No hagas commit.
```

No hay checkpoint aquí. El resultado esperado es un cambio candidato con
pruebas en verde y un diff que ustedes puedan explicar línea por línea.

| Si pasa esto | Hagan esto |
|---|---|
| Agrega una dependencia | Deténganlo, pregunten si el repo ya ofrece esa capacidad, reviertan |
| Modificó un test para que pase | Reviertan y repitan la restricción |
| El diff creció | `git diff --stat`, comparen con el plan y pidan revertir lo que sobra |
| No termina a tiempo | Congelen el alcance en el criterio principal y pasen a review |

---

## Actividad 4 — Review independiente (14')

Quien implementó tiene sesgo hacia sus propias decisiones. Abran **otra
terminal en esta misma carpeta** y ejecuten `claude` para tener un contexto
fresco, o pidan un subagente. Denle solo la spec, el diff y la salida de
los checks.

```text
Actúas como revisor independiente. No implementaste este cambio y no tienes
que defenderlo.

Lee docs/changes/PAY-102-spec.md, ejecuta git diff y ejecuta npm run verify.

Busca únicamente: criterios de la spec sin cubrir, reglas mal aplicadas,
fallas de idempotencia, rupturas de compatibilidad, manejo de errores
incorrecto, pruebas que no prueban nada, y cambios fuera del alcance.

Prohibido: comentarios de estilo, formato, nombres o preferencias personales.

Devuelve cada hallazgo como BLOQUEANTE o RECOMENDACIÓN, con archivo y línea, y
con la frase de la spec que lo respalda.
```

Después: clasifiquen cada hallazgo, **verifiquen cada bloqueante contra el
código antes de aceptarlo** (el revisor también se equivoca), corrijan los
confirmados y registren uno que aceptaron y uno que rechazaron, con el
motivo. Ningún hallazgo se corrige por obediencia.

| Si pasa esto | Hagan esto |
|---|---|
| Solo devuelve estilo | Repitan la restricción y pidan gaps contra la spec |
| Devuelve veinte hallazgos | Pidan los tres que afectan corrección |
| No encuentra nada | Que verifique criterio por criterio contra el diff antes de declararlo limpio |

---

## Actividad 5 — Verificar y documentar (8')

```text
Ejecuta npm run verify y muéstrame la salida completa.

Si falla, no parches el síntoma: dime la causa raíz antes de proponer nada.

Después compara git diff contra docs/changes/PAY-102-spec.md, criterio por
criterio. Si docs/payment-flow.md quedó desalineado con el comportamiento
nuevo, actualízalo. Cierra con un resumen de evidencia: un renglón por
criterio, con la prueba y el comando que lo demuestran.
```

**Checkpoint 3 — Done with evidence.** Captura que muestre `npm run verify`
en verde, el resumen del diff y el review sin bloqueantes abiertos. Cierras
si los criterios están cubiertos, `tests`/`lint`/`typecheck` pasan, la
documentación está actualizada, no hay bloqueantes y el diff está dentro
del alcance.

| Si pasa esto | Hagan esto |
|---|---|
| `verify` en rojo al minuto 6 | Capturen el estado real y el error. Un checkpoint honesto vale más que uno maquillado |
| No llegaron a implementar | Suban spec y plan; el debrief cierra el caso con la rama de solución |

---

## Reglas duras de la sesión

- Las firmas públicas de `applyProviderUpdate` y `handleProviderNotification`
  no cambian.
- Ninguna prueba existente se debilita para hacer pasar el cambio.
- Si cambia el comportamiento del flujo de pagos, `docs/payment-flow.md` se
  actualiza en el mismo cambio.
- El resumen narrativo de Claude no sustituye la salida de `npm run verify`.

## Qué hay en esta carpeta

- `src/domain`: tipos y errores del dominio.
- `src/service`: `PaymentService`, con un store en memoria.
- `src/provider`: adaptador de notificaciones del proveedor (ficticio).
- `docs/payment-flow.md`: flujo completo y tablas de estados.
- `docs/changes/PAY-102-spec.md`: plantilla vacía de la spec de nueve
  secciones.
- `docs/changes/PAY-102-plan.md`: plantilla vacía del plan trazable.
- `docs/portafolio.md`: tus tres checkpoints. Es la entrega de la sesión.
- `tests/`: suite de Vitest.
- `CLAUDE.md`: convenciones del repositorio y definición de "terminado".

## Entrega

Completa [`docs/portafolio.md`](./docs/portafolio.md), renómbralo como
`portafolio-sesion-2-<nombre-apellido>.md` y envíalo por el canal del
programa. Cada persona entrega el suyo, aunque el trabajo haya sido en
equipo.

Regla de capturas: sin secretos, sin rutas personales completas y sin datos
reales.

## Scripts disponibles

| Script      | Qué hace                                    |
| ----------- | ------------------------------------------- |
| `typecheck` | `tsc --noEmit`, sin generar artefactos      |
| `lint`      | ESLint sobre toda la carpeta                |
| `test`      | Ejecuta la suite de tests con Vitest        |
| `verify`    | `typecheck` + `lint` + `test`, en ese orden |

## Solución de referencia

No está en esta carpeta ni en esta rama. El practitioner la comparte al
cerrar la sesión, y entonces comparas tu enfoque contra ella.

## Convenciones y definición de terminado

Ver [`CLAUDE.md`](./CLAUDE.md).

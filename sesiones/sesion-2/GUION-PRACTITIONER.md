# Guion del practitioner — sesión 2

Cómo se corre la sesión, momento por momento. **No se entrega a los
participantes.** Lo que ellos ven está en el `README.md` de la carpeta, que
tiene las mismas consignas sin las respuestas ni las notas de facilitación.

Material del día: este archivo, [`SOLUCION.md`](./SOLUCION.md) y
[`TARJETA-DECISIONES.md`](./TARJETA-DECISIONES.md), una copia por equipo.

## El reloj

| Bloque | Slides | Min | Qué haces |
|---|---|---|---|
| Apertura y recap | S1–S6 | 14 | Resolver `verify` en rojo antes del minuto 3, nombrar los tres checkpoints, correr la actividad de reconexión |
| Workflow adaptativo | S7–S12 | 9 | Exponer, recoger dos ejemplos, hacer votar la ruta |
| De ambiguo a spec | S13–S18 | 10 | Exponer sin responder ninguna pregunta del brief |
| Encuentra los vacíos | S19–S20 | 4 | Cronometrar y clasificar en vivo |
| Diseño y verification-first | S21–S26 | 10 | Exponer |
| Traza el criterio | S27–S28 | 4 | Recoger una cadena y cerrarla en vivo |
| Programación defensiva | S29–S31 | 6 | Exponer, recoger dos riesgos, anunciar el break |
| Break 1 | S32 | 5 | Hora absoluta en pantalla |
| Demo | S33–S36 | 15 | Compartir pantalla, detenerte en el plan aprobado |
| Misión y salas | S37–S40 | 6 | Repartir la tarjeta, abrir salas |
| Laboratorio | S41–S51 | 88 | Recorrer salas, avisar minutos, cerrar puntual |
| Cierre | S52–S54 | 4 | Debrief y entrega |

Antes de empezar: escribe en pantalla las horas absolutas de los dos breaks
y de los cinco cortes del laboratorio. En sala nadie recuerda minutos
relativos.

---

## Los momentos participativos

Cinco. Ninguno pasa de cuatro minutos, y todos tienen la misma mecánica:
consigna corta, cronómetro, recoger, cerrar. Si te comes el cierre, la
actividad no enseñó nada.

### S4 · Reconstruyamos el ciclo (4')

**Consigna:** "Entre todos, ¿cuáles son los pasos del agentic loop, y
cuáles fueron los tres checkpoints de la sesión 1?". Por chat o pizarra,
sin mirar notas.

**Cómo:** dos zonas en la pizarra, "el ciclo" y "los tres checkpoints".
Recoges lo que salga sin corregir, y recién en S5 superpones el orden
correcto: intención humana → contexto → exploración → plan → acción →
observación → verificación → evidencia; y plan aprobado, cambio acotado,
`verify` exitoso.

**Corrección en 2 minutos.** Si más de la mitad del grupo no recordaba el
ciclo, no amplíes aquí: se refuerza dentro de la demo.

### S7 · Un ejemplo de cada extremo (1')

**Consigna:** un ejemplo de un proceso tan pesado que el equipo lo abandonó,
y uno de un cambio ambiguo tratado como trivial que se pagó en producción.

**Cómo:** dos respuestas al aire, treinta segundos cada una. Cierras con
"el error no es tener proceso, es tener uno solo".

### S12 · ¿Dónde cae el caso de hoy? (2')

**Consigna:** voten rápida, estándar o reforzada, y una frase de por qué.

**Qué esperas:** el grupo llega a estándar. Si alguien vota rápida, no lo
corrijas de frente: pregúntale qué pasa si se equivoca en la regla de
transición y déjalo llegar solo.

**Cierre:** esa frase de justificación es la primera línea del checkpoint 1
de cada equipo. Dilo explícitamente. Saltarse una etapa es una decisión, no
un olvido.

### S19–S20 · Encuentra los vacíos (4')

**Consigna:** con el brief en pantalla, listen qué **no** define, y escriban
la primera pregunta que harían. Sin proponer soluciones.

**Cómo:** 2 minutos para escribir, 2 para recoger. Corta cualquier
respuesta que empiece a diseñar la solución. Después tomas tres o cuatro
respuestas y las ubicas en el tablero de tres columnas.

**Dónde cae cada cosa, para que no te trabes en vivo:**

| Respuesta típica del grupo | Columna |
|---|---|
| "¿Qué estados existen hoy?" | Hecho: está en `payment-status.ts` |
| "¿Hay pruebas de esto?" | Hecho: está en `tests/` |
| "Seguro quieren bloquear solo el retroceso" | Inferencia |
| "¿Aprobado es final o puede cambiar?" | Decisión de negocio |
| "¿Qué pasa si repiten la notificación?" | Decisión de negocio |
| "¿Qué error devolvemos?" | Decisión de negocio |

**Cierre:** lo que cayó en la tercera columna es exactamente lo que Claude
no debe decidir por ellos. **Guarda el tablero**: se retoma en S52.

### S27–S28 · Traza el criterio (4')

**Consigna:** de los tres criterios en pantalla, elijan uno y completen por
chat archivo → prueba → comando.

**Por qué el mini-caso es otro:** montos negativos, identificador repetido y
formato de respuesta no son el caso de hoy, a propósito. Si usas el caso
real regalas la solución.

**Cierre:** tomas una respuesta del grupo y cierras la cadena completa en
vivo, incluido el comando exacto. Frase de cierre: "esto que acaban de
hacer en cuatro minutos es lo que su plan tendrá que contener, criterio por
criterio".

### S31 · Un riesgo en voz alta (2')

**Consigna:** "en el caso de hoy, ¿qué es lo más peligroso que Claude podría
hacer sin que nos demos cuenta?".

**Cómo:** dos respuestas, sin evaluarlas. Cualquiera razonable sirve. El
objetivo es que entren al laboratorio mirando el diff con sospecha.
Después anuncias el break con hora absoluta.

---

## La demo (S33–S36, 15')

Le entregas a Claude la frase del brief, sin contexto y sin reglas. Seis
pasos, en este orden:

0. **Clasificar la ruta.** En voz alta, no en la terminal.
1. **Mostrar el brief.** Tal cual, una frase.
2. **Pedir la entrevista con investigación previa.** Usa el prompt de
   entrevista del `README.md`, sin cambiarlo: es el mismo que ellos van a
   usar en la Actividad 1.
3. **Acordar las decisiones de negocio.** Respondes desde la tarjeta,
   fuera de pantalla, solo lo que Claude pregunte.
4. **Generar la especificación** en `docs/changes/PAY-102-spec.md`.
5. **Comparar dos opciones y crear el plan trazable.**

Te detienes en el plan aprobado. No implementas.

**Regla dura:** no proyectes la tarjeta de decisiones ni dejes visible la
solución. Si aquí regalas el modelo de transiciones, la Actividad 1 se
vacía y el laboratorio pierde sentido.

**Si el tiempo aprieta:** comprime el paso 5 mostrando el plan ya generado
desde la transcripción de respaldo (B4).

**Si la demo falla:** B1 a B4 son capturas del ensayo. Se muestran como
capturas, nunca como ejecución en vivo.

---

## Durante el laboratorio

Las slides S41 a S51 quedan fijas en pantalla; los equipos las leen sin que
nadie se las explique. Las mismas consignas están en el `README.md`, así que
no repitas: recorre salas.

| Actividad | Qué avisas por chat | Qué buscas al recorrer |
|---|---|---|
| 1 · Aclarar y especificar | Minutos 10 y 18 | Equipos que volcaron la tarjeta completa en el prompt |
| 2 · Diseñar y planificar | Nadie sale al break sin la captura del checkpoint 2 | Dos opciones que en realidad son la misma |
| 3 · Implementar | Minuto 18: el cierre es duro, la Actividad 4 no se recorta | Diffs inflados y pruebas modificadas. Es el error más formativo del día |
| 4 · Review independiente | — | Equipos que corrigen hallazgos por obediencia, sin verificarlos |
| 5 · Verificar y documentar | Minuto 5 | Capturas maquilladas |

Antes de abrir salas, reparte la tarjeta (una por equipo) y repite en voz
alta la regla de uso: no la peguen completa, ábranla solo cuando Claude
pregunte, respondan solo lo preguntado. Quien la vuelca de golpe pierde la
mitad del aprendizaje.

El copiloto entra a la primera sala en el minuto 2.

---

## Debrief (S52, 4')

Cuatro cosas, en este orden:

1. **Las preguntas de cada equipo, antes de mirar código.** Cuántas de las
   seis decisiones preguntaron y cuántas asumieron. Ese es el resultado de
   la sesión, no el diff. Recupera el tablero de S20.
2. **La única fuente de verdad de las reglas**, contra quienes las
   encadenaron con `if` dentro del servicio. Funciona hoy; en la sesión 4,
   cuando aparece un estado nuevo, se nota.
3. **La prueba de `UNKNOWN`**, que cambió de sentido respecto de la sesión
   1. Pregunta abiertamente si alguien la borró en vez de reescribirla.
4. **La tabla de `docs/payment-flow.md`.** La sesión 3 arranca desde ese
   documento; si no lo actualizaron, empiezan la siguiente sesión con la
   documentación mintiendo.

Cierras con la tarea de la sesión 3: anotar una instrucción que hayan
repetido tres veces hoy.

**B5 y B6** (la solución en pantalla) no se muestran antes del cierre del
checkpoint 3, bajo ninguna circunstancia. Al usarlas, di explícitamente que
el laboratorio queda como remediación pendiente, no como completado.

---

## Antes de montar

- Producir las capturas reales del ensayo: S26, S36, S47, S50 y B1–B6.
- Confirmar las horas absolutas de los dos breaks y de los cinco cortes.
- Confirmar fecha y hora de entrega del portafolio (S54).
- Imprimir una tarjeta por equipo.
- Auditar que ninguna slide montada muestre el modelo de transiciones ni
  código de la solución.

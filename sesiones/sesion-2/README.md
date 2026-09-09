# Sesión 2 — Del brief ambiguo al cambio verificado

Laboratorio del curso AI-SDLC. Mismo servicio de pagos **ficticio** de la
sesión 1, con el comportamiento de esa sesión ya corregido. No dependes de
haber terminado la sesión 1: este snapshot arranca desde un estado limpio.

Este archivo tiene todo lo que se hace hoy, en orden, y todos los prompts
listos para copiar y pegar.

## Contenido

- [Tu misión](#tu-misión)
- [Cómo se trabaja](#cómo-se-trabaja)
- [Preflight](#preflight)
- [El reloj de la sesión](#el-reloj-de-la-sesión)
- [Momentos en vivo](#momentos-en-vivo) — las siete cosas que se hacen con
  todo el grupo, antes de abrir salas
- [El laboratorio](#el-laboratorio) — cinco actividades, tres checkpoints
- [Si algo se rompe](#si-algo-se-rompe) — cómo volver atrás
- [Cierre](#cierre)
- [Reglas duras de la sesión](#reglas-duras-de-la-sesión)
- [Entrega](#entrega)

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

Salas de 4 personas, y **cada quien hace su propio trabajo**: tu clon, tu
sesión de Claude Code, tu spec, tu portafolio. La sala está para que se
hablen: comparar cómo preguntó Claude, discutir una decisión que no
convence, pedir ayuda cuando algo no corre. No hay driver ni pantalla
compartida.

Vas a recibir una **tarjeta de decisiones de negocio** con las respuestas
del dueño del producto. Regla de uso, y es la que más se incumple:

> No pegues la tarjeta completa en el prompt. Ábrela solo cuando Claude
> pregunte, y responde únicamente lo que preguntó.

Quien vuelca la tarjeta de golpe se salta la entrevista, que es la mitad
del aprendizaje del día.

Regla de capturas, para todo el día: sin secretos, sin rutas personales
completas y sin datos reales.

## Preflight

Abre la terminal **dentro de esta carpeta**, no en la raíz del repositorio:

```bash
cd sesiones/sesion-2
npm run verify
claude
```

`npm run verify` encadena `typecheck`, `lint` y `test`, y debe terminar en
verde antes de empezar. Si no lo hace, avísalo antes del minuto 3.

## El reloj de la sesión

| Bloque | Minutos |
|---|---|
| Apertura y recap del ciclo | 14 |
| Fundamentos aplicados, con tres momentos participativos | 43 |
| Break 1 | 5 |
| Demo: del brief al plan aprobado | 15 |
| Misión, tarjeta, roles y apertura de salas | 6 |
| Laboratorio: cinco actividades, con el break 2 en medio | 88 |
| Cierre | 4 |

---

## Momentos en vivo

Siete cosas que se hacen con todo el grupo, no en sala. Ninguna necesita la
terminal.

### 1. Reconstruyamos el ciclo (4')

Entre todos, sin mirar las notas de la sesión 1, por chat o en pizarra:

- ¿Cuáles son los pasos del agentic loop?
- ¿Cuáles fueron los tres checkpoints de la sesión 1?

Nadie consulta sus notas primero. No es examen: sirve para saber desde
dónde arranca el grupo.

El ciclo, ordenado, para contrastar con lo que salió: intención humana →
contexto → exploración → plan → acción → observación → verificación →
evidencia. Y los tres checkpoints de la sesión 1: plan aprobado, cambio
acotado, `verify` exitoso.

### 2. Un ejemplo de cada extremo (1')

Dos respuestas al aire, treinta segundos cada una:

- Un proceso tan pesado que el equipo lo abandonó a las dos semanas.
- Un cambio ambiguo que se trató como trivial y se pagó en producción.

El error no es tener proceso. Es tener uno solo para todo.

### 3. ¿Dónde cae el caso de hoy? (2')

Con el brief en pantalla, voten: ¿ruta rápida, estándar o reforzada? Y
escriban **una frase** de justificación.

| Ruta | Cuándo |
|---|---|
| Rápida | Cambio localizado, reversible e inequívoco: explorar, cambiar, verificar |
| Estándar | Varios archivos, reglas de negocio o ambigüedad: el workflow completo |
| Reforzada | Seguridad, datos sensibles o baja reversibilidad: estándar más revisión especializada y aprobaciones extra |

Se clasifica con tres preguntas, en menos de tres minutos: qué tan ambigua
es la solicitud, qué impacto tiene equivocarse, y qué tan fácil es revertir
y verificar.

Guarda esa frase. Es la primera línea de tu checkpoint 1.

### 4. Encuentra los vacíos (4')

Con el brief de hoy en pantalla, en parejas o por chat. Dos minutos para
escribir, dos para recoger:

1. Listen qué **no** define este requisito.
2. Escriban la primera pregunta que harían.

Sin proponer soluciones. Cualquier respuesta que empiece a diseñar la
solución se corta.

Después se toman tres o cuatro respuestas del grupo y se ubican en tres
columnas:

| Categoría | Qué es |
|---|---|
| Hecho | Observado en el código o en la documentación |
| Inferencia | Suposición razonable que todavía hay que validar |
| Decisión humana | Le corresponde a un humano, no a Claude |

Lo que cae en la tercera columna es exactamente lo que Claude no debe
decidir por ti. El tablero se retoma en el cierre.

### 5. Traza el criterio (4')

Tres criterios de aceptación de un mini-caso distinto al de hoy. Elijan uno
y complétenlo por chat: **archivo → prueba → comando**.

1. El servicio rechaza montos negativos.
2. Reintentar con el mismo identificador no duplica el pago.
3. La respuesta conserva su formato actual.

Se cierra en vivo una de las tres cadenas, con el comando exacto que
produce la evidencia. La cadena completa tiene cinco eslabones y es el
formato del checkpoint 2:

```text
criterio de aceptación → archivo o componente → cambio previsto → prueba → comando que produce la evidencia
```

Un plan sin esa cadena no se aprueba. Esto que acaban de hacer en cuatro
minutos es lo que su plan tendrá que contener, criterio por criterio.

### 6. Un riesgo en voz alta (2')

Dos respuestas al aire:

> En el caso de hoy, ¿qué es lo más peligroso que Claude podría hacer sin
> que nos demos cuenta?

Cualquier respuesta razonable sirve. El objetivo es entrar al laboratorio
mirando el diff con sospecha, porque un agente que ejecuta también rompe:
puede silenciar una prueba, agregar una dependencia o cambiar un contrato,
con la mejor intención y sin avisar.

### 7. Durante la demo (15')

El practitioner le entrega a Claude la misma frase que viste, sin
contexto adicional y sin reglas. Van a ver seis pasos:

0. Clasificar la ruta.
1. Mostrar el brief.
2. Pedir la entrevista, con investigación previa.
3. Acordar las decisiones de negocio.
4. Generar la especificación.
5. Comparar dos opciones y crear el plan trazable.

Miren estas cuatro cosas mientras corre:

- ¿Qué investigó Claude solo, sin preguntar?
- ¿Qué preguntas hizo, y cuáles no debía hacer?
- ¿En qué momento decide el humano y no él?
- ¿Dónde nos detenemos, y por qué ahí?

La demo termina en un plan aprobado. No se implementa: entre "el plan me
convence" y "ejecuta" hay una decisión humana, y hoy la vas a tomar cinco
veces.

---

## El laboratorio

| # | Actividad | Minutos | Checkpoint |
|---|---|---|---|
| 1 | Aclarar y especificar | 23 | Spec ready |
| 2 | Diseñar y planificar | 20 | Plan ready |
| — | Break | 5 | — |
| 3 | Implementar | 23 | — |
| 4 | Review independiente | 14 | — |
| 5 | Verificar y documentar | 8 | Done with evidence |

---

### Actividad 1 — Aclarar y especificar (23')

Seis pasos. Los pasos 2, 4 y 5 son turnos con Claude; los otros tres los
haces tú, leyendo.

#### Paso 1 — Clasifica la ruta (fuera de la terminal)

Rápida, estándar o reforzada, y una frase de por qué. Escríbela en tu
portafolio antes de abrir Claude. Es la primera línea del checkpoint 1.

#### Paso 2 — Turno 1: la entrevista

Pega esto tal cual:

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

Si Claude se queda corto de preguntas, contrasta con las siete que abren
cualquier brief: quién necesita el cambio, qué comportamiento actual es
incorrecto, cuáles son entradas y salidas, qué casos límite existen, qué
errores son esperables, qué no debe cambiar y cómo se demuestra el éxito.

#### Paso 3 — Revisa la clasificación que hizo Claude

Claude te devolvió las tres listas. Tu trabajo es corregirlas, porque va a
equivocarse en la frontera. Lee la lista de inferencias y muévete a la de
decisiones todo lo que **solo el negocio puede contestar**: si aprobado es
final, qué pasa con una notificación repetida, qué error se devuelve.

Un atajo para saber a qué lista pertenece algo: si puedes responderlo
abriendo un archivo, es un hecho. Si lo estás deduciendo, es una
inferencia. Si hace falta que alguien decida, es una decisión humana, y esa
no la toma Claude.

Copia las tres listas corregidas a tu portafolio ahora. Después de la
implementación ya no vas a acordarte de qué asumiste.

#### Paso 4 — Turno 2: responde desde la tarjeta

Abre la tarjeta y busca **solo** las preguntas que Claude te hizo. Responde
con este formato, numerando igual que él:

```text
Respuestas a tus preguntas:

1. <respuesta>
2. <respuesta>
3. <respuesta>

Eso es todo lo que te puedo responder ahora. Si necesitas alguna decisión
más para escribir la spec, pregúntamela antes de escribirla; no la asumas.
```

Si Claude preguntó tres cosas, respondes tres. Lo que no preguntó no se lo
regalas, aunque lo tengas delante en la tarjeta: eso es justo lo que el
debrief va a mirar.

Si Claude asume una regla que no preguntó, anótalo. Vale tanto como una
respuesta.

#### Paso 5 — Turno 3: la especificación

```text
Con las decisiones que acabo de responder, escribe la especificación en
docs/changes/PAY-102-spec.md, completando las nueve secciones de la plantilla.

Cada criterio de aceptación tiene que ser verificable con una prueba o con un
comando. No inventes reglas que yo no haya acordado: si falta una decisión,
déjala marcada como PENDIENTE y pregúntamela.
```

Las nueve secciones son problema, alcance, fuera de alcance, reglas, casos
idempotentes, errores, criterios de aceptación, casos límite y evidencia de
finalización. Ya están en la plantilla de
[`docs/changes/PAY-102-spec.md`](./docs/changes/PAY-102-spec.md); si Claude
te devuelve ocho, pídele la que falta.

#### Paso 6 — Relee la spec antes de aprobarla

Abre el archivo y ve a la sección 4, reglas. **Cada regla tiene que salir de
una respuesta tuya del paso 4.** La que no, sobra o es un supuesto que
Claude metió sin avisar.

```text
Para cada regla de la sección 4 de la spec, dime de qué respuesta mía sale.
Las que no salgan de ninguna, márcalas como supuesto tuyo o quítalas.
```

Y pásale la prueba de fuego: ¿alcanza esta spec para arrancar una sesión
limpia de Claude Code sin volver a explicar nada de viva voz? Si hay que
aclarar algo hablando, todavía no está lista.

**Checkpoint 1 — Spec ready.** Captura que muestre ruta y justificación,
reglas acordadas, criterios de aceptación, casos límite y fuera de alcance.

**Responde en el portafolio:** ¿qué ambigüedad habría causado un error si
Claude implementaba directo?

Avanzas si están definidos estados, transiciones, idempotencia, error,
compatibilidad y un "terminado" verificable.

| Si pasa esto | Haz esto |
|---|---|
| Claude inventa reglas | Pídele la lista explícita de supuestos y resuélvelos antes de seguir |
| Hace demasiadas preguntas | "Investiga primero lo que el repo puede responder, y agrupa" |
| Se ofrece a implementar | Recuérdenle que no debe modificar archivos |
| Van tarde | Cierra con criterios y casos límite; el resto es ganancia |

---

### Actividad 2 — Diseñar y planificar (20')

Cinco pasos: tres turnos con Claude y dos de decisión tuya.

#### Paso 1 — Turno 1: dos opciones

```text
Lee docs/changes/PAY-102-spec.md. No modifiques ningún archivo en este turno.

Propón dos opciones reales de diseño para cumplir la spec. Para cada una:
componentes afectados, ventajas, riesgos, impacto en las pruebas e impacto en
la compatibilidad. Si no hay un trade-off real entre las dos, dímelo en vez de
inventar una segunda para complacerme.

No elijas por mí y no escribas código: espera mi decisión.
```

#### Paso 2 — Elige, y di por qué

Lee las dos y decide tú. Contesta con este formato, que además te deja
escrita la respuesta del checkpoint 2:

```text
Elijo la opción <1 o 2>.

Descarto la otra porque <consecuencia concreta en pruebas, compatibilidad o
mantenimiento>.
```

Si las dos opciones son en realidad la misma con otro nombre, no elijas
todavía:

```text
Estas dos opciones me parecen la misma solución escrita distinto. Dime en una
frase qué consecuencia distinta tiene cada una en las pruebas o en la
compatibilidad. Si no la hay, dímelo y seguimos con una sola.
```

#### Paso 3 — Turno 2: el plan trazable

```text
Con la opción que elegí, escribe el plan en docs/changes/PAY-102-plan.md
completando la plantilla.

La tabla lleva una fila por criterio de aceptación de la spec: criterio →
archivo → cambio previsto → prueba → comando que produce la evidencia.

Ninguna fila que no responda a un criterio. Si crees que hace falta un cambio
que ningún criterio pide, dímelo aparte en vez de meterlo en la tabla.
```

#### Paso 4 — Comprueba la cadena

Abre `docs/changes/PAY-102-plan.md` y cuenta: **tantas filas como criterios
tiene tu spec**. Ni una más.

- Si sobra una fila, es alcance que nadie pidió. Fuera.
- Si falta una fila, hay un criterio que nadie va a probar.
- Si una celda de "prueba" o de "comando" está vacía, la cadena está rota y
  el plan no se aprueba.

```text
Compara la tabla del plan contra los criterios de aceptación de la spec y
dime: qué criterio no tiene fila, qué fila no corresponde a ningún criterio, y
qué celda quedó vacía. Solo la lista, sin arreglar nada todavía.
```

#### Paso 5 — Aprueba en voz alta

El diseño cabe en seis líneas: responsabilidad del componente, opción
seleccionada, alternativa descartada, archivos afectados, riesgos y
estrategia de pruebas. Ni un documento arquitectónico, ni nada.

Entre "el plan me convence" y "ejecuta" hay una decisión, y es tuya. Tómala
mirando la tabla, no el resumen.

**Checkpoint 2 — Plan ready.** Captura que muestre opción aprobada,
archivos afectados, estrategia de pruebas, riesgos y comando de
verificación.

**Responde en el portafolio:** ¿qué alternativa descartaste y por qué?

Avanzas si cada criterio tiene implementación o prueba, no hay cambios
fuera de alcance, hay pruebas positivas y negativas, y `verify` está
definido.

| Si pasa esto | Haz esto |
|---|---|
| Plan demasiado amplio | Compáralo con el fuera de alcance y pide el slice mínimo |
| Plan que no conecta pruebas | Pide la tabla completa y no la apruebes hasta que lo esté |
| Aparecen refactors no pedidos | Fuera |
| Van tarde | Aprueba con un criterio menos, pero nunca uno sin prueba |

---

### Actividad 3 — Implementar (23')

Es el único momento del día en que Claude escribe código. Un turno para
empezar, y después tú vigilando el diff.

#### Paso 1 — Turno 1: implementa, con las siete restricciones

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

#### Paso 2 — Mira el diff mientras avanza

En **otra terminal**, en esta misma carpeta:

```bash
git diff --stat
```

Eso te dice qué archivos tocó y cuánto creció cada uno. Compáralo con la
columna "archivo" de tu plan. Si aparece un archivo que no está en el plan,
detén a Claude y pregúntale por qué lo tocó.

Para leer el cambio completo:

```bash
git diff
```

#### Paso 3 — Revisa las pruebas, no solo el código

```bash
git diff tests/
```

Las líneas que empiezan con `-` en un archivo de `tests/` son aserciones que
desaparecieron. Ninguna prueba existente se debilita para hacer pasar el
cambio: si ves una, revierte y repite la restricción.

#### Paso 4 — Cierra el turno

Resultado esperado: un cambio candidato con las pruebas en verde y un diff
que puedas explicar línea por línea. No hay checkpoint aquí; la evidencia se
captura en la Actividad 5.

| Si pasa esto | Haz esto |
|---|---|
| Agrega una dependencia | Detenlo, pregunta si el repo ya ofrece esa capacidad, revierte |
| Modificó un test para que pase | Revierte y repite la restricción |
| El diff creció | `git diff --stat`, compara con el plan y pide revertir lo que sobra |
| No termina a tiempo | Congela el alcance en el criterio principal y pasa a review |

---

### Actividad 4 — Review independiente (14')

Quien implementó tiene sesgo hacia sus propias decisiones, y quien
implementó eres tú. El review lo hace un contexto que no vio la
conversación.

#### Paso 1 — Abre un contexto fresco

Dos formas, elige una:

```bash
# En otra terminal, en esta misma carpeta
claude
```

O, sin salir de tu sesión actual, pídele un subagente:

```text
Lanza un subagente de revisión con este encargo, y pásame su respuesta
completa sin resumirla:
```

y a continuación, el prompt del paso 2.

#### Paso 2 — El encargo del revisor

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

#### Paso 3 — Verifica cada bloqueante antes de aceptarlo

El revisor también se equivoca. Por cada bloqueante, abre el archivo y la
línea que cita y comprueba que dice lo que él dice. Si no, lo rechazas.

En la sesión donde implementaste, no en la del revisor:

```text
El revisor dice: "<pega el hallazgo>".

Abre el archivo y la línea que cita y dime si es cierto. Si lo es, arréglalo
sin tocar nada más. Si no lo es, dime por qué no.
```

Ningún hallazgo se corrige por obediencia. La aceptación final es tuya.

#### Paso 4 — Anota uno de cada

Para el portafolio: un hallazgo que aceptaste y uno que rechazaste, con el
motivo de cada uno. Si aceptaste todos, probablemente no verificaste ninguno.

| Si pasa esto | Haz esto |
|---|---|
| Solo devuelve estilo | Repite la restricción y pide gaps contra la spec |
| Devuelve veinte hallazgos | Pide los tres que afectan corrección |
| No encuentra nada | Que verifique criterio por criterio contra el diff antes de declararlo limpio |

---

### Actividad 5 — Verificar y documentar (8')

Ocho minutos y son justos. El orden importa: primero el gate, después la
comparación, al final la documentación.

#### Paso 1 — El gate

```bash
npm run verify
```

Esta salida es la evidencia. El resumen de Claude no la sustituye.

Si falla, no pidas un parche:

```text
npm run verify falló. Este es el output completo:

<pega el output>

Dime la causa raíz antes de proponer ningún cambio. No toques nada hasta que
me la digas.
```

#### Paso 2 — Turno: compara el diff contra la spec

```text
Compara git diff contra docs/changes/PAY-102-spec.md, criterio por criterio.
Dime qué archivo cubre cada criterio y qué parte del diff no responde a
ninguno.

Si docs/payment-flow.md quedó desalineado con el comportamiento nuevo,
actualízalo en el mismo cambio.

Cierra con un resumen de evidencia: un renglón por criterio, con la prueba y
el comando que lo demuestran.
```

#### Paso 3 — Las tres capturas

```bash
npm run verify      # que se vea el verde y el número de tests
git diff --stat     # el resumen del cambio
```

Más la salida del review sin bloqueantes abiertos.

**Checkpoint 3 — Done with evidence.**

**Responde en el portafolio:** ¿qué hallazgo aceptaste y cuál rechazaste, y
por qué?

Cierras si los criterios están cubiertos, `tests`, `lint` y `typecheck`
pasan, la documentación está actualizada, no hay bloqueantes y el diff está
dentro del alcance.

| Si pasa esto | Haz esto |
|---|---|
| `verify` en rojo al minuto 6 | Captura el estado real y el error. Un checkpoint honesto vale más que uno maquillado |
| No llegaste a implementar | Sube spec y plan; el debrief cierra el caso con la rama de solución |

---

## Si algo se rompe

Todo esto se corre sin hacer commit, así que nada de lo que pase hoy es
irreversible.

**Claude tocó un archivo que no debía.** Devuélvelo a como estaba:

```bash
git restore <ruta/del/archivo>
```

**Quieres volver el código al punto de partida** sin perder tu spec ni tu
plan, que viven en `docs/changes/`:

```bash
git restore src tests
npm run verify        # debe volver a los 16 tests en verde
```

**No sabes qué cambió.** `git status` te dice qué archivos están tocados y
`git diff` qué les pasó. Si el archivo aparece como `??`, es nuevo y
`git restore` no lo borra: bórralo tú.

**Claude se ofrece a hacer commit.** Dile que no. Hoy nadie commitea.

**Te quedaste sin tiempo en una actividad.** Ninguna actividad se salta: se
recorta. Cierra con lo que tengas, captura el estado real y sigue. Un
checkpoint honesto vale más que uno maquillado.

---

## Cierre

Tres preguntas al grupo, dos o tres respuestas al aire y el resto por
escrito en el portafolio:

- ¿En qué etapas Claude consultó, co-creó o ejecutó?
- ¿Dónde fuiste tú el gate?
- ¿Qué decisión de negocio jamás debió delegarse?

Y una tarea para la sesión 3: al entregar el portafolio, anoten **una
instrucción que hayan repetido tres veces hoy**. Hoy escribieron a mano
cosas que ya venían de la sesión 1, como explorar antes de preguntar o no
debilitar pruebas. En la sesión 3 esas instrucciones se convierten en
activos del equipo, con `CLAUDE.md`, rules, skills y MCP.

## Reglas duras de la sesión

- Las firmas públicas de `applyProviderUpdate` y `handleProviderNotification`
  no cambian.
- Ninguna prueba existente se debilita para hacer pasar el cambio.
- Si cambia el comportamiento del flujo de pagos, `docs/payment-flow.md` se
  actualiza en el mismo cambio.
- El resumen narrativo de Claude no sustituye la salida de `npm run verify`.
  Si dice que pasa y no muestra el comando, todavía no pasó.

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
programa. Cada persona entrega el suyo.

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

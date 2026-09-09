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

1. Clasifica la ruta y escribe una frase de justificación.
2. Entrega el brief a Claude pidiéndole que investigue el repositorio
   **antes** de preguntar, y que no modifique archivos.
3. Marca cada conclusión como hecho, inferencia o decisión humana.
4. Responde solo lo preguntado, desde la tarjeta.
5. Pide la especificación con sus nueve secciones.
6. Reléela buscando reglas que nunca acordaste.

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

Si Claude se queda corto de preguntas, contrasta con las siete que abren
cualquier brief: quién necesita el cambio, qué comportamiento actual es
incorrecto, cuáles son entradas y salidas, qué casos límite existen, qué
errores son esperables, qué no debe cambiar y cómo se demuestra el éxito.

Prompt de especificación, cuando ya respondiste desde la tarjeta:

```text
Con las decisiones que acabo de responder, escribe la especificación en
docs/changes/PAY-102-spec.md, completando las nueve secciones de la plantilla.

Cada criterio de aceptación tiene que ser verificable con una prueba o con un
comando. No inventes reglas que yo no haya acordado: si falta una decisión,
déjala marcada como PENDIENTE y pregúntamela.
```

Antes de aprobarla, pásale la prueba de fuego: ¿alcanza para arrancar una
sesión limpia de Claude Code sin volver a explicar nada de viva voz? Si hay
que aclarar algo hablando, todavía no está lista.

**Checkpoint 1 — Spec ready.** Captura que muestre ruta y justificación,
reglas acordadas, criterios de aceptación, casos límite y fuera de alcance.

**Responde en el portafolio:** ¿qué ambigüedad habría causado un error si
Claude implementaba directo?

Avanzas si están definidos estados, transiciones, idempotencia, error,
compatibilidad y un "terminado" verificable.

| Si pasa esto | Haz esto |
|---|---|
| Claude inventa reglas | Pídanle la lista explícita de supuestos y resuélvanlos antes de seguir |
| Hace demasiadas preguntas | "Investiga primero lo que el repo puede responder, y agrupa" |
| Se ofrece a implementar | Recuérdenle que no debe modificar archivos |
| Van tarde | Cierra con criterios y casos límite; el resto es ganancia |

---

### Actividad 2 — Diseñar y planificar (20')

1. Pide a Claude explorar el repositorio con la spec aprobada, sin
   modificar archivos.
2. Pide dos opciones reales, con componentes afectados, ventajas, riesgos,
   impacto en pruebas y compatibilidad.
3. Elige una y escribe por qué descartaste la otra.
4. Pide el plan trazable: criterio → archivo → cambio → prueba → comando.
5. Verifica que cada criterio de la spec aparece en el plan.

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

El diseño cabe en seis líneas: responsabilidad del componente, opción
seleccionada, alternativas descartadas, archivos o interfaces afectados,
riesgos y estrategia de pruebas. Ni un documento arquitectónico, ni nada.

Si las dos opciones que recibes son en realidad la misma, pide el trade-off
explícito o quédate con una. Una segunda opción inventada para complacerte
es ruido, no diseño.

**Checkpoint 2 — Plan ready.** Captura que muestre opción aprobada,
archivos afectados, estrategia de pruebas, riesgos y comando de
verificación.

**Responde en el portafolio:** ¿qué alternativa descartaron y por qué?

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

1. Pide implementar la spec y el plan aprobados, nada más.
2. Pasa las restricciones textuales.
3. Exige casos positivos, negativos, idempotentes y de regresión.
4. Pide que ejecute las pruebas relevantes durante el trabajo.
5. Revisa el diff mientras avanza; si se sale del alcance, detenlo.

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
pruebas en verde y un diff que puedas explicar línea por línea.

| Si pasa esto | Haz esto |
|---|---|
| Agrega una dependencia | Detenlo, pregunta si el repo ya ofrece esa capacidad, revierte |
| Modificó un test para que pase | Revierte y repite la restricción |
| El diff creció | `git diff --stat`, compara con el plan y pide revertir lo que sobra |
| No termina a tiempo | Congela el alcance en el criterio principal y pasa a review |

---

### Actividad 4 — Review independiente (14')

Quien implementó tiene sesgo hacia sus propias decisiones, y quien implementó
eres tú. Abre **otra terminal en esta misma carpeta** y ejecuta `claude` para
tener un contexto fresco, o pide un subagente. Dale solo la spec, el diff y
la salida de los checks.

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

Después:

1. Clasifica cada hallazgo en bloqueante o recomendación.
2. **Verifica cada bloqueante contra el código antes de aceptarlo.** El
   revisor también se equivoca.
3. Corrige los confirmados.
4. Registra uno que aceptaste y uno que rechazaste, con el motivo.

La aceptación final es humana. Ningún hallazgo se corrige por obediencia.

| Si pasa esto | Haz esto |
|---|---|
| Solo devuelve estilo | Repite la restricción y pide gaps contra la spec |
| Devuelve veinte hallazgos | Pide los tres que afectan corrección |
| No encuentra nada | Que verifique criterio por criterio contra el diff antes de declararlo limpio |

---

### Actividad 5 — Verificar y documentar (8')

1. Ejecuta `npm run verify`.
2. Si falla, pásale el output completo a Claude y pide causa raíz, no un
   parche.
3. Compara el diff final contra la spec, criterio por criterio.
4. Actualiza la documentación que quedó desalineada.
5. Pide el resumen de evidencia, criterio por criterio.

```text
Ejecuta npm run verify y muéstrame la salida completa.

Si falla, no parches el síntoma: dime la causa raíz antes de proponer nada.

Después compara git diff contra docs/changes/PAY-102-spec.md, criterio por
criterio. Si docs/payment-flow.md quedó desalineado con el comportamiento
nuevo, actualízalo. Cierra con un resumen de evidencia: un renglón por
criterio, con la prueba y el comando que lo demuestran.
```

**Checkpoint 3 — Done with evidence.** Capturas de `npm run verify` en
verde, del resumen del diff y del review sin bloqueantes abiertos.

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

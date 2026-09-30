# Mi workflow para PAY-105

Este es tu **documento de entrega individual**. Ábrelo en tu editor y completa cada apartado cuando lo indique el [README](../../README.md). No necesitas llenarlo todo al comenzar. Escribe tus decisiones y conserva resultados reales; marca como pendiente lo que aún no ocurrió.

- Nombre:
- Fecha:

| Durante la práctica | Apartados que completas |
|---|---|
| Clasificar y diseñar | Identidad; Ruta y decisiones; Herramientas y límites; Diseño aprobado |
| Aprobar especificación y plan | Decisiones de producto; Spec y plan aprobados; primeras filas de Pasos para repetir el trabajo |
| Implementar y verificar | Pruebas y aceptación; nuevas filas de Pasos para repetir el trabajo |
| Revisar y aceptar | Revisión técnica; decisión final en Pruebas y aceptación; Cambio verificado |
| Cerrar | Intercambio con otra persona; Próximo uso en tu equipo; Reflexión |

**Escribe cada evidencia una vez.** Los registros de avance indican dónde encontrarla dentro de este mismo documento. Pega extractos de la spec, del plan y de los comandos; no tienes que volver a redactarlos. Puedes usar enlaces externos solo si quien evalúa tendrá acceso. Evita rutas locales como única evidencia.

Al terminar, conserva este archivo y guarda una copia como `workflow-sesion-5-nombre-apellido.md` para enviarla por el canal del programa. El código, la spec y el plan quedan en tu clon.

<a id="a-identidad"></a>

## Identidad

**Completa en el paso 3.** Este apartado, «Ruta y decisiones» y «Herramientas y límites» forman tu ficha de diseño funcional y técnico. Responde cada campo brevemente.

- Nombre del workflow y tarea del SDLC que resuelve:
- Quién lo usaría o solicitaría:
- Cuándo lo usarías:
- Cuándo evitarías usarlo:

<a id="b-ruta-y-decisiones"></a>

## Ruta y decisiones

**Empieza en el paso 2 y completa en los pasos 3 y 4.**

- Ruta elegida y razón (rápida, estándar o reforzada; una frase):
- Riesgos y controles (riesgo concreto → cómo lo reduces o verificas):
- Qué haría que escales la ruta o detengas el trabajo:

### Responsabilidades

En este laboratorio tú asumes las decisiones humanas. Indica quién las asumiría en tu equipo real.

| Decisión | Persona responsable en el laboratorio | Puesto en tu equipo real |
|---|---|---|
| Definir alcance y comportamiento | | |
| Comprobar calidad y evidencia | | |
| Aceptar el resultado final | | |

### Decisiones de producto

**Completa cuando respondas a Claude en el paso 4.** Puedes pegar aquí el extracto correspondiente de tu spec. Si sigue abierto, escribe «pendiente».

| Pregunta | Tu respuesta | Quién decidió y cuándo |
|---|---|---|
| ¿Longitud mínima y máxima del motivo normalizado? | | |
| ¿Qué error, mensaje y datos devuelve una repetición con otro motivo? | | |
| Otras decisiones necesarias, si existen | | |

<a id="c-arquitectura"></a>

## Herramientas y límites

**Completa en el paso 3.** Registra tu selección y su razón. No es obligatorio usar todas las herramientas ni omitir alguna artificialmente.

| Recurso y ubicación | Cómo lo usarás, o por qué lo omites | Permisos y límites |
|---|---|---|
| `CLAUDE.md` y `.claude/rules/payments.md` | | |
| Skill `.claude/skills/payment-change/SKILL.md` | | |
| Reviewer `.claude/agents/payment-reviewer.md` | | |
| Hook `.claude/hooks/protect-files.mjs` | | |
| Solicitud local `scripts/fixtures/PAY-105-brief.md` o MCP `scripts/course-mcp-server.mjs` | | |
| Verificación `npm run verify` | | |
| Otro recurso o equivalente, si lo eliges | | |

- Hook: ¿está configurado?, ¿lo observaste actuar?, ¿lo seleccionaste para tu workflow? Responde las tres preguntas por separado:
- Si usaste MCP: ¿qué comprobaste realmente —self-test, conexión, llamada— y qué fuente recuperaste? Si no lo usaste, indícalo:
- Qué contenido externo tratarás como dato y qué harás si pide saltarse reglas o aprobaciones:

### Condiciones para avanzar

En cada fila, indica qué evidencia necesita la persona responsable y cuándo debe devolver el trabajo. Estas aprobaciones también se llaman *gates*.

| Aprobación | Evidencia exigida | Quién decide | Cuándo devolver o detener |
|---|---|---|---|
| Diseño aprobado — Workflow ready | | | |
| Especificación aprobada — Spec ready | | | |
| Plan aprobado — Plan ready | | | |
| Cambio aceptado — Done with evidence | | | |

<a id="d-flujo-reproducible"></a>

## Pasos para repetir el trabajo

**Empieza en el paso 5 y actualiza hasta el paso 8.** Escribe lo que hiciste, de forma que otra persona pueda repetirlo. Una frase o referencia precisa por celda es suficiente. Los resultados de pruebas se guardan en «Pruebas y aceptación».

- Prerrequisitos y cómo comprobar la base antes de empezar:
- Carpeta y primera acción o comando:
- Qué hacer si un paso falla y cómo retomar:

| Etapa | Qué hace Claude | Qué decides o compruebas tú | Entrada | Resultado | Aprobación necesaria |
|---|---|---|---|---|---|
| Leer la solicitud | | | | | |
| Explorar el proyecto | | | | | |
| Escribir la especificación | | | | | |
| Planificar | | | | | |
| Implementar | | | | | |
| Ejecutar pruebas | | | | | |
| Revisar y corregir | | | | | |
| Aceptar o devolver | | | | | |

<a id="e-definition-of-done"></a>

## Pruebas y aceptación

**Registra resultados en el paso 6, actualízalos tras corregir en el paso 7 y decide la aceptación en el paso 8.**

### Cambios y pruebas

- Archivos modificados y nuevos:
- Extractos relevantes del diff o enlaces accesibles para quien evalúa:
- Pruebas del comportamiento nuevo y de regresión (ubicación y qué comprueban: casos válidos, inválidos, límites, idempotencia y conflicto):
- Criterios cubiertos y pendientes (usa los identificadores de la spec; la tabla prevista está en «Spec y plan aprobados»):

### Resultados reales

Incluye `npm run verify` y `git diff --check -- .`, y otras comprobaciones relevantes. Pega la parte de la salida que permite verificar el resultado. Tras corregir, identifica qué ejecución corresponde al diff final; no presentes resultados anteriores como si comprobaran ese estado.

| Comando o inspección | Carpeta y fecha | Resultado y salida relevante | ¿Corresponde al estado final? |
|---|---|---|---|
| | | | |

### Decisión final

Completa al llegar al paso 8. Para aceptar: criterios satisfechos, `npm run verify` aprobado, review atendido y aceptación humana del diff. La respuesta a cada hallazgo está en «Revisión técnica»; no hace falta copiarla aquí.

- Estado: **Done with evidence** / **devuelto con pendientes**:
- Persona que acepta o devuelve el diff y fecha:
- Criterios incumplidos, bloqueos o evidencia que falta (o «ninguno», si lo comprobaste):
- Riesgos residuales y siguiente acción:
- Confirmación de que la evidencia no contiene datos reales ni secretos:

<a id="f-review-y-reproducción"></a>

## Revisión técnica

**Completa en el paso 7.**

- Revisor independiente usado:
- Contexto proporcionado (spec, plan, diff/lista de archivos y resultados de comandos):
- Veredicto recibido y limitaciones:

| Hallazgo y criterio afectado | Tu decisión y razón | Corrección aplicada, si corresponde | Evidencia posterior o referencia a Resultados reales |
|---|---|---|---|
| | | | |

Si no hubo hallazgos, indícalo y conserva el veredicto y sus limitaciones. El reviewer no ejecuta comandos; registra lo que recibió y revisó realmente.

<a id="g-adopción-acotada"></a>

## Próximo uso en tu equipo

**Completa en el paso 11, minutos 114–116.** Retoma una oportunidad de S1; si no tienes ese mapa, elige una tarea real de tu SDLC y explica por qué.

- Práctica a probar y razón:
- Tipo y cantidad de tareas:
- Plazo de la prueba y fecha para revisar resultados:
- Señal observable para saber si ayuda:
- Condición para ajustar o abandonar la prueba:

<a id="h-portafolio-de-evidencia"></a>

## Registro de avances

Este es tu portafolio. Los checkpoints son **momentos para comprobar el trabajo**. Completa cada uno cuando ocurra; usa las evidencias del mismo documento y no vuelvas a pegarlas.

### Diseño aprobado (CP1)

**Paso 3 · minuto 26.** La evidencia está en «Identidad», «Ruta y decisiones» y «Herramientas y límites».

- [ ] Revisé alcance, responsables, herramientas, permisos y condiciones para avanzar.
- Mi decisión: aprobado / devuelto:
- Quién decide y cuándo:
- Ajuste necesario o pendiente (o «ninguno»):

### Spec y plan aprobados (CP2)

**Paso 5 · minuto 53.** Las respuestas de producto están en «Ruta y decisiones». Incorpora los siguientes extractos de los archivos originales; no los redactes otra vez.

- Extracto o enlace accesible a **Approval** de `docs/changes/PAY-105-spec.md` (qué se aprobó, por quién y cuándo, o qué quedó pendiente):
- Extracto o enlace accesible a **Approval** de `docs/changes/PAY-105-plan.md`:
- Tabla de trazabilidad del plan (pega sus filas o usa un enlace accesible):

| Criterio de la spec | Archivo previsto | Prueba o inspección | Comando o método para verificar |
|---|---|---|---|
| | | | |

### Cambio verificado (CP3)

**Paso 8 · minuto 104.** La evidencia está en «Pruebas y aceptación» y «Revisión técnica»; la decisión final se escribe únicamente en «Pruebas y aceptación».

- [ ] Inspeccioné el diff y los archivos nuevos y registré evidencia relevante.
- [ ] Registré las salidas reales de checks correspondientes al estado final, incluidos fallos.
- [ ] Contrasté los criterios con las pruebas y registré qué falta.
- [ ] Documenté el review y mi respuesta a sus hallazgos o limitaciones.
- [ ] Registré mi aceptación o devolución, fecha, riesgos y siguiente acción.

Marca solo lo que hiciste. Un cambio incompleto puede quedar correctamente documentado como «devuelto con pendientes».

### Intercambio con otra persona

**Paso 9 · minutos 104–110.**

- Persona que leyó mi documento, o «revisión pendiente»:
- Observación recibida sobre claridad o reproducción:
- Mejora aplicada o razón para no aplicarla:
- ¿Pudo localizar el inicio, los checks y la recuperación sin explicación oral?:

<a id="i-reflexión-máximo-100-palabras"></a>

## Reflexión

**Paso 11 · minutos 116–118. Máximo 100 palabras.** Escribe una decisión que no delegaste a Claude, el control que más te ayudó y qué probarás después. Usa un ejemplo de tu trabajo.

Escribe aquí tu reflexión:

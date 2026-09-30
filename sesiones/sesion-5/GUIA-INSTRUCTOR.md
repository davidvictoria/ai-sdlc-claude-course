# Sesión 5 — Guía del instructor

El [README](./README.md) guía al estudiante con pasos numerados y nombres completos de apartados. Este archivo concentra tiempos de facilitación y correspondencias con la [presentación revisada](https://docs.google.com/presentation/d/1pG0W_APihVz7XzhWedqEpHy7jGCkAHcSjwF28tB_mHg/edit) y el minuto a minuto. La sesión sigue durando **120 minutos**, incluida pausa y cierre de 16 minutos.

## Antes de empezar

- Pide completar el preflight y obtener los 49 tests iniciales aprobados. Esa base no resuelve PAY-105.
- Prepara dos terminales en `sesiones/sesion-5`, Claude autenticado, editor, chat y cronómetro.
- Abre README, brief y documento de entrega. Define el canal exacto donde recibirás el Markdown y el medio para compartirlo en la revisión cruzada.
- Usa el brief local como ruta inicial. MCP es opcional; su configuración ocurre antes de clase.
- Durante cada demo, los estudiantes observan. Durante la práctica, atiende el paso actual sin introducir contenido nuevo.

## Recorrido y puntos de validación

| Minutos | Paso del README / slides | Tu intervención y distribución |
|---|---|---|
| 00–03 | Apertura / 1, 2, 4, 5 | Objetivo, trabajo individual, ayuda por chat y un archivo final. |
| 03–07 | 1. Materiales / 6–7 | Demo de 3 minutos; dentro de ella, 45 segundos para conectar S1–S4 con el entregable. Último minuto: confirmación de materiales y baseline por chat. |
| 07–11 | Activación / 8 | 2 minutos de respuestas por chat y 2 para contrastar dos ejemplos por micrófono. Si nadie habla, lee dos respuestas. Es el único icebreaker. |
| 11–16 | 2. Clasificación / 13 | 2 minutos individuales, 1 de chat y 2 de open mic: dos intervenciones de hasta 45 segundos y 30 segundos de devolución. |
| 16–26 | 3. Diseño / 21 | 1 minuto orientar, 7 trabajar, 2 validar CP1. Reutilizar la clasificación anterior. |
| 26–44 | 4. Spec / 22 | 2 orientar, 13 trabajar, 3 validar/open mic. Pide una decisión que Claude no debía resolver por su cuenta. |
| 44–53 | 5. Plan / 23 | 1 ejemplo de trazabilidad, 6 trabajar, 2 validar CP2. Reutilizar criterios de la spec. |
| 53–58 | Pausa / 24 | 5 minutos; indicar hora de regreso. |
| 58–82 | 6. Implementación / 25 | 2 orientar, 10 trabajar, 2 open mic (70–72), 8 trabajar, 2 validar. Registrar evidencia mientras ejecutan. |
| 82–96 | 7. Review / 26 | 2 orientar, 9 revisar/corregir, 3 validar/open mic (93–96). Pide hallazgo, decisión y evidencia posterior. |
| 96–104 | 8. Aceptación / 27 | 1 orientar, 5 comprobar registros, 2 validar CP3. La documentación ya viene elaborada. |
| 104–110 | 9. Intercambio / 29 | 2 leer, 2 intercambiar observaciones, 2 ajustar el documento. |
| 110–114 | 10. Open mic final / 30 | 1 recoger dudas por chat, 2 escuchar hasta dos intervenciones de 30 segundos y responder, 1 sintetizar. Si nadie habla, usa el chat. |
| 114–118 | 11. Adopción/reflexión / 31 | 2 minutos de escritura para cada apartado. |
| 118–120 | 12. Entrega / 32–33 | 1 checklist, 1 guardar/enviar y despedir. |

No añadas teoría entre bloques. Las 13 slides omitidas son consulta; el recorrido utiliza 20 activas. Protege el minuto 104 para iniciar el cierre. Si hay retraso, registra el estado real y el siguiente paso; no elimines aprobaciones ni presentes evidencia pendiente como realizada.

## Cómo referirte a los materiales

Nombra el **paso del README** y el **título del apartado**. Evita consignas como «completa D» o «guárdalo en H». Los enlaces existentes del MaM siguen abriendo el paso correspondiente.

Las letras de fases que aún aparecen en las slides se traducen así:

| Rótulo de la presentación / MaM | Paso de la guía del alumno |
|---|---|
| A. Diseño del workflow | 3. Diseña tu forma de trabajar |
| B. Exploración y spec | 4. Explora y aprueba la especificación |
| C. Plan y trazabilidad | 5. Crea y aprueba el plan |
| D. Implementación y pruebas | 6. Implementa y ejecuta las pruebas |
| E. Review independiente | 7. Pide una revisión independiente |
| F. Gate y documentación | 8. Decide si el cambio está terminado |

Las referencias anteriores a letras de la **plantilla**, distintas de las fases, corresponden a estos apartados. Esta tabla es para el instructor; el estudiante trabaja por nombres.

| Referencia anterior | Apartado actual del documento de entrega |
|---|---|
| A | Identidad |
| B | Ruta y decisiones |
| C | Herramientas y límites |
| D | Pasos para repetir el trabajo |
| E | Pruebas y aceptación |
| F | Revisión técnica |
| G | Próximo uso en tu equipo |
| H | Registro de avances |
| I | Reflexión |

La ficha de diseño funcional y técnico son los tres primeros apartados. El workflow reúne diseño, pasos, verificación, revisión y adopción. El portafolio está en «Registro de avances» y utiliza la evidencia del propio documento. Se entrega todo, con la reflexión, en **un único Markdown**.

## Qué debes comprobar

- **CP1, minuto 26:** diseño, responsable humano, herramientas, permisos y condiciones de devolución. La aprobación se registra en «Diseño aprobado».
- **Spec ready, minuto 44:** decisiones de producto respondidas y criterios verificables; aprobación humana en la spec.
- **CP2, minuto 53:** spec y plan aprobados; tabla criterio → archivo → prueba/inspección. La entrega conserva extractos o enlaces accesibles, sin reescribirlos.
- **CP3, minuto 104:** diff y archivos nuevos revisados, checks reales, review atendido y decisión humana. La evidencia vive en «Pruebas y aceptación» y «Revisión técnica»; CP3 comprueba esas referencias.

Para PAY-105, el humano decide los límites del motivo y el contrato exacto del conflicto. El reviewer solo lee y recibe las salidas de los checks; no los ejecuta. MCP y hook no dan puntos por sí solos. Si no hubo intercambio entre estudiantes, queda pendiente; no se inventa.

## Ayudar sin completar el reto por el estudiante

Pide **paso + intento + resultado/error**. Revisa un criterio y orienta el siguiente incremento. Ante una duda común, muestra una explicación breve y devuelve el tiempo de trabajo. Ante una depuración larga, conserva error y siguiente paso para el canal de apoyo del programa.

Valida decisiones y evidencia con las preguntas: «¿Qué aprobaste?», «¿Dónde se comprueba?» y «¿Qué falta?». La revisión cruzada evalúa claridad de uso y complementa la revisión técnica.

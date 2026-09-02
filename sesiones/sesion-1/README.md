# Sesión 1 — Fundamentos de Claude Code

Laboratorio de práctica del curso AI-SDLC. Trabajas sobre un servicio de
pagos **ficticio** en TypeScript: sin datos reales, sin secretos, sin
llamadas de red y sin dependencias de producción. El objetivo de esta
sesión es recorrer por primera vez el ciclo completo de Claude Code sobre
un repositorio que no conoces: explorar, planificar, implementar y
verificar, manteniendo el control sobre el alcance y las decisiones.

## La misión

> Ayuda al servicio de pagos a reconocer correctamente el estado
> `PROCESSING`, preservando su comportamiento actual y demostrando mediante
> checks que el cambio funciona.

- **Contexto.** El servicio normaliza los estados de pago que recibe de un
  proveedor externo y los traduce al vocabulario interno del dominio.
- **Problema.** El proveedor puede enviar `PROCESSING`. Hoy el servicio lo
  transforma en `UNKNOWN`, aunque `docs/payment-flow.md` lo lista como un
  valor válido del proveedor.
- **Comportamiento esperado.** `PROCESSING` debe transformarse en
  `PENDING`: para operaciones, un pago que el proveedor todavía está
  procesando es un pago que sigue esperando resolución. No hace falta un
  estado nuevo del dominio.

## Criterios de aceptación

1. `PROCESSING` produce `PENDING`.
2. `PENDING` permanece `PENDING`.
3. `APPROVED` permanece `APPROVED`.
4. `DECLINED` permanece `DECLINED`.
5. Un valor no reconocido produce `UNKNOWN`.
6. Un valor vacío produce `UNKNOWN`.
7. No cambia el contrato público del servicio.
8. Se agrega al menos una prueba para `PROCESSING`.
9. No se eliminan ni debilitan pruebas existentes.
10. No se agregan dependencias.
11. Se actualiza la documentación relacionada (`docs/payment-flow.md`).
12. `npm run verify` pasa.

## Qué hay en esta carpeta

- `src/domain`: tipos y errores del dominio (estado del pago, errores
  tipados).
- `src/service`: `PaymentService`, con un store en memoria (sin
  persistencia real).
- `src/provider`: adaptador de notificaciones entrantes del proveedor de
  pagos (ficticio).
- `docs/payment-flow.md`: el flujo completo, capa por capa, y las tablas
  de estados. Es la fuente de verdad documental del dominio.
- `docs/portafolio.md`: plantilla del portafolio de evidencias del equipo
  (tres checkpoints, mapa priorizado de oportunidades y reflexión).
- `tests/`: suite de Vitest.
- `CLAUDE.md`: convenciones del repositorio y definición de "terminado".

## Preflight

Debe estar hecho antes de la sesión; los pasos de instalación están en
[`PREFLIGHT.md`](../../PREFLIGHT.md), en la raíz del repositorio. Al
empezar, abre la terminal **dentro de esta carpeta**, no en la raíz:

```bash
cd sesiones/sesion-1
npm run verify
```

`npm run verify` encadena `typecheck`, `lint` y `test` y debe terminar en
verde antes de empezar. Si no lo hace, avisa al practitioner antes de
continuar.

## Cómo trabajar la sesión

Trabajan en equipos. El driver comparte pantalla y rota entre fases. Cada
fase termina en un checkpoint que se registra en `docs/portafolio.md`
(captura más una respuesta breve). Una afirmación de Claude ("ya está
corregido", "los tests pasan") no sustituye la salida real del comando.

### Fase 1: explorar y planificar (12 min)

Abre Claude Code en Plan Mode. En este modo Claude explora y propone, pero
no modifica archivos:

```bash
claude --permission-mode plan
```

Prompt de exploración:

```text
Explora este repositorio sin modificar archivos.

Necesitamos entender por qué el estado PROCESSING se transforma actualmente en UNKNOWN.

Identifica:
1. El flujo del estado desde el proveedor hasta la respuesta.
2. Los archivos relevantes.
3. La función responsable de normalizar estados.
4. Las pruebas existentes.
5. La documentación relacionada.
6. Las convenciones definidas en CLAUDE.md.
7. Los comandos disponibles para verificar el proyecto.

Después, crea un plan que incluya:
- cambios necesarios;
- pruebas;
- riesgos;
- restricciones;
- comandos de verificación;
- condición objetiva de finalización.

Todavía no modifiques archivos.
```

Lean el plan completo antes de aprobarlo y corrijan omisiones. Revisen en
voz alta: ¿identificó el código correcto? ¿incluyó pruebas? ¿incluyó
documentación? ¿preserva el contrato público? ¿limitó el alcance? ¿incluyó
`npm run verify`?

**Checkpoint 1.** Captura del plan en Plan Mode y respuesta a: ¿qué
decisión revisó o modificó el equipo antes de aprobar el plan? Avanzan
cuando el plan identifica archivos, cambio esperado, pruebas, restricciones
y verificación.

### Fase 2: implementar con alcance (13 min)

Aprueben el plan para salir de Plan Mode y ejecuten el prompt de
implementación:

```text
Implementa el plan aprobado.

Restricciones:
- PROCESSING debe transformarse en PENDING.
- Los estados existentes deben conservar su comportamiento.
- Los valores vacíos o desconocidos deben seguir devolviendo UNKNOWN.
- No cambies el contrato público.
- No elimines ni debilites pruebas.
- No agregues dependencias.
- No modifiques archivos fuera del alcance.

Agrega o actualiza las pruebas necesarias.
Actualiza la documentación relacionada.
Detente cuando el cambio esté listo para verificar.
```

Inspeccionen los archivos modificados con `git diff --stat` y `git diff`.
Si Claude amplía el alcance, deténganlo (Escape), revisen el diff y
vuelvan al plan.

**Checkpoint 2.** Captura de `git diff --stat` y respuesta a: ¿Claude
modificó únicamente lo acordado? ¿qué corrigió el equipo? Avanzan cuando
existe el cambio y su prueba, sin tests debilitados, sin dependencias
nuevas y sin archivos inesperados.

### Fase 3: verificar con evidencia (8 min)

```text
Ejecuta npm run verify.

Si algo falla:
1. Identifica la causa raíz.
2. Corrige solamente lo relacionado con el cambio.
3. Ejecuta nuevamente npm run verify.

No declares terminado el trabajo hasta que la validación completa pase.
Al finalizar, muestra los archivos modificados y resume la evidencia.
```

Ejecuten también `npm run verify` ustedes mismos en la terminal.

**Checkpoint 3.** Captura de `npm run verify` exitoso y respuesta a: ¿qué
evidencia demuestra que el cambio funciona sin romper el comportamiento
existente? Terminan cuando typecheck, lint y tests pasan y los doce
criterios están cubiertos.

### Mapa priorizado de oportunidades (10 min)

Es el entregable del módulo y se retoma en la sesión 5. Se registra en la
sección correspondiente de `docs/portafolio.md`:

1. Listen de tres a cinco actividades reales del SDLC de su equipo. Solo el
   nombre de la actividad: sin sistemas internos, código ni datos.
2. Asignen a cada una un modo de colaboración: consultar, co-crear,
   ejecutar, automatizar o gate humano.
3. Ubíquenla en impacto y esfuerzo, con valores alto o bajo.
4. Marquen dos quick wins: alto impacto, bajo esfuerzo y resultado
   verificable.
5. Para cada quick win, una frase con la forma de verificación esperada.

Un quick win sin forma de verificación no cuenta como quick win.

## Si algo se atasca

| Problema | Acción |
| --- | --- |
| Claude Code no inicia | Trabaja en pareja con otro equipo; la remediación individual se hace después de la sesión |
| Claude toca más archivos de los acordados | Escape, revisar `git diff`, revertir lo indebido y volver al plan con el alcance reducido |
| Claude cambió un test para que pase | Revertir, repetir la restricción de no debilitar pruebas y revisar las aserciones |
| `npm run verify` falla | Pasarle a Claude la salida completa, pedir la causa raíz y corregir solo el alcance del cambio |
| La captura muestra rutas o datos sensibles | No pegarla; repetir la captura sobre un área acotada |

## Scripts disponibles

| Script      | Qué hace                                    |
| ----------- | ------------------------------------------- |
| `typecheck` | `tsc --noEmit`, sin generar artefactos      |
| `lint`      | ESLint sobre toda la carpeta                |
| `test`      | Ejecuta la suite de tests con Vitest        |
| `verify`    | `typecheck` + `lint` + `test`, en ese orden |

## Solución de referencia

No está en esta carpeta ni en esta rama. El practitioner la comparte al
cerrar la sesión, y entonces cada equipo compara su enfoque contra ella.

## Convenciones y definición de terminado

Ver [`CLAUDE.md`](./CLAUDE.md).

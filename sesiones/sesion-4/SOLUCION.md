# Solución de referencia · Sesión 4

Material del practitioner. No se comparte con los participantes antes del debrief.

## Qué contiene esta rama

| Archivo | Estado inicial (main) | En esta solución |
|---|---|---|
| `.claude/agents/payment-reviewer.md` | Esqueleto con 6 TODO | Completo, solo lectura |
| `.claude/settings.json` | Sin bloque de hooks | Con `PreToolUse` configurado |
| `src/domain/transitions.ts` | Defecto A presente | Corregido |
| `tests/` | Sin prueba de `DECLINED -> REVERSED` | Prueba agregada |
| `docs/changes/PAY-104-review.md` | No existe | Informe esperado del reviewer |

## Los dos defectos plantados

### Defecto A — la idempotencia de `REVERSED` es inalcanzable

En `assertValidTransition`, la comprobación de terminalidad se evaluaba antes que
la de idempotencia, de modo que `REVERSED -> REVERSED` lanzaba error en lugar de
ser un no-op. Viola el criterio 5 de la spec.

Es el defecto importante de la sesión y está construido para que **no lo delate una
prueba**: el código lleva un comentario que justifica el orden como una decisión
deliberada de PAY-104. Un revisor que lee el código y acepta su explicación lo
aprueba; uno que compara contra la spec lo detecta.

Corrección aplicada: la idempotencia se evalúa primero, conservando que
`REVERSED` no admita ninguna transición de salida hacia otro estado.

### Defecto B — el criterio 3 no tiene prueba

No existía ninguna prueba de `DECLINED -> REVERSED`. El comportamiento del código
era correcto; faltaba la evidencia. Enseña que cobertura y corrección son cosas
distintas.

Corrección aplicada: prueba negativa agregada a nivel de dominio y de servicio.

## Por qué `npm run verify` estaba en verde con ambos defectos

Es el punto pedagógico central de la sesión y conviene decirlo explícitamente en
el debrief: **el gate determinístico no falló porque ninguno de los dos defectos
estaba cubierto por una prueba**. B1 es una desviación de comportamiento que nadie
ejercita; B2 es una prueba ausente. Un `verify` verde demuestra que lo cubierto
funciona, no que la especificación se cumple.

De ahí la frase que cierra el bloque de quality gates: un veredicto favorable del
reviewer no reemplaza a `npm run verify`, y un `verify` verde tampoco demuestra
por sí solo que la spec se cumplió. Son evidencias distintas y ninguna sustituye
a la otra.

## Qué mostrar en el debrief

1. El diff de `assertValidTransition` antes y después, señalando que el orden de
   dos comprobaciones es todo el defecto.
2. El informe `docs/changes/PAY-104-review.md`, comparándolo con los que
   produjeron los equipos. Lo que importa es que aparezcan los dos hallazgos y
   que estén trazados a un criterio de aceptación, no la redacción.
3. La sección "Brechas de evidencia" del informe: el reviewer declara que no
   ejecutó comandos porque no tiene `Bash`. Es la consecuencia visible del
   mínimo privilegio, no una limitación accidental.

## Evidencia del hook

Comprobado por entrada estándar sobre `.claude/hooks/protect-files.mjs`:

| Ruta del evento | Código de salida |
|---|---:|
| `fixtures/protected/demo.env` | 2 |
| `package-lock.json` | 2 |
| `.git/config` | 2 |
| `docs/lab-notes.md` | 0 |
| Entrada vacía o JSON inválido | 0 |

El control es específico: bloquea una lista explícita y permite el resto. Ante una
entrada de la que no puede deducir la ruta, permite en lugar de bloquear, para no
dejar la clase sin poder editar.

## Errores frecuentes de los equipos

| Síntoma | Causa habitual | Qué hacer |
|---|---|---|
| El agente no aparece en `/agents` | Ruta o frontmatter incorrectos; falta reiniciar | Verificar `.claude/agents/payment-reviewer.md` y reiniciar Claude Code |
| El reviewer propone editar archivos | Se le dejó `Edit` o `Write` en `tools` | Acotar a `Read, Glob, Grep` |
| El reviewer afirma haber ejecutado pruebas | Tiene `Bash`, o el prompt no le pide declarar sus límites | Quitar `Bash` y exigir la sección de brechas de evidencia |
| Solo encuentran el defecto B | Revisaron pruebas pero no compararon contra la spec | Pedir el mapeo criterio → implementación → prueba |
| El hook bloquea todo | Comparación contra la raíz del proyecto en vez de la ruta destino | Restaurar el script de esta rama |
| El hook no dispara | JSON inválido en `settings.json` o matcher incorrecto | Verificar con `/hooks` |

## Nota para el debrief del hook

En una corrida de prueba, Claude Code respondió a "agrega una línea a
`fixtures/protected/demo.env`" escribiendo con `Bash` (`printf >>`) en vez
de `Edit`, y el hook no intervino porque su matcher es `Edit|Write`. Con
`Edit` el bloqueo funciona y el mensaje de política aparece. Úsalo en el
debrief: el control protege exactamente lo que declara; lo demás lo cubren
los permisos de herramientas y la aceptación humana del diff.

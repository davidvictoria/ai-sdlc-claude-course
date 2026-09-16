# Portafolio de evidencias — sesión 3

**Entrega individual.** Renómbralo como
`portafolio-sesion-3-<nombre-apellido>.md` y envíalo por el canal del
programa. No lo evalúa `npm run verify`. `docs/lab-notes.md` es tu bitácora
de apoyo y no se entrega.

Regla para todas las capturas: sin secretos, sin rutas personales completas
y sin datos reales.

- Nombre:
- Fecha:

---

## Checkpoint 1 — Arquitectura de contexto

**Captura** con tu tabla terminada y la justificación de al menos una
decisión.

> Pega aquí la captura.

**Tu tabla**, resumida desde `context-candidates.md`:

| # | Destino | Justificación (si es discutible) |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
| 7 | | |
| 8 | | |
| 9 | | |
| 10 | | |

**Un desacuerdo con Claude** (fase A, paso 3): qué fila, qué propuso y qué
decidiste.

>

**Responde:** ¿qué sacaste de `CLAUDE.md`, y cambiaste los `paths` de
`.claude/rules/payments.md`? ¿Por qué?

>

---

## Checkpoint 2 — Skill reutilizable

**Captura** con la invocación de `/payment-change PAY-103`, el archivo
`docs/changes/PAY-103-spec.md` creado y la línea donde Claude pide
aprobación.

> Pega aquí la captura.

**Captura de la skill completa**, sin `TODO`.

> Pega aquí la captura.

**Revisión de la spec:**

| Pregunta | Sí / No | Dónde lo viste |
|---|---|---|
| ¿Dice de qué fuente sacó el ticket? | | |
| ¿Las decisiones abiertas quedaron como `PENDIENTE`? | | |
| ¿Cada criterio tiene prueba y comando en la trazabilidad? | | |
| ¿Se detuvo antes de implementar? | | |
| ¿`src/` y `tests/` quedaron intactos? | | |

**Responde:** ¿qué guardrail agregaste tú, y qué forma de fallar previene?

>

---

## Checkpoint 3 — Integración controlada

**Captura** con `course-context` conectado (`/mcp` o `claude mcp get
course-context`) y la respuesta con `PAY-103` recuperado.

Si usaste el plan B, escribe aquí "simulación MCP por restricción de
entorno" y la causa en una línea.

> Pega aquí la captura.

**Responde:** el ticket trae un comentario con instrucciones para el
agente. ¿Qué decía, qué hizo Claude con él y qué hiciste tú?

>

**Completa la frase:**

> La frontera de confianza está en…

---

## Debrief

1. ¿Qué información debe estar siempre disponible?

>

2. ¿Qué procedimiento merecía convertirse en skill?

>

3. ¿Por qué la solicitud de cambio pertenece a MCP y no a `CLAUDE.md`?

>

4. ¿Qué no debe poder hacer el servidor del laboratorio?

>

## Cierre

¿Qué dejó de depender hoy de la memoria de una persona?

>

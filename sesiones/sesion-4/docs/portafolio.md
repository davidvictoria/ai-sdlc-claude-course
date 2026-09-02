# Portafolio de evidencias — sesión 4

**Entrega individual.** Completa este archivo, renómbralo como
`portafolio-sesion-4-<nombre-apellido>.md` y envíalo por el canal del
programa. `docs/lab-notes.md` es tu bitácora de apoyo y el destino de la
edición permitida del hook; no se entrega.

- Nombre:
- Fecha:

## Fase A — Agente de revisión

- Captura del agente `payment-reviewer` completo, con su frontmatter.
- ¿Qué herramientas le diste y cuáles le negaste? ¿Por qué `Bash` no está
  en la lista?
- Captura de `/agents` mostrando el agente cargado.

## Fase B — Hook de protección

- Captura del intento **bloqueado** sobre la ruta protegida, con el mensaje
  de política.
- Captura del intento **permitido** sobre `docs/lab-notes.md`.
- El hook tiene un matcher `Edit|Write`. ¿Qué queda fuera de su alcance y
  qué control cubre ese hueco?

## Fase C — Revisión, corrección y verificación

- Captura del veredicto del reviewer.
- **Hallazgos bloqueantes que confirmaste** contra el repositorio:

| # | Hallazgo | ¿Confirmado? | Criterio de la spec | Qué corregiste |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |

- ¿Rechazaste algún hallazgo del reviewer? ¿Con qué evidencia?
- Captura de `npm run verify` en verde.
- ¿Qué criterio de aceptación no habría detectado el gate determinístico
  por sí solo?

## Reflexión final

Un veredicto del reviewer y un `npm run verify` en verde son evidencias
distintas. ¿Qué demuestra cada una y qué no demuestra ninguna de las dos?

>

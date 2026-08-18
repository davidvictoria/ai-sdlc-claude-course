# Notas del laboratorio (sesion 4)

Este archivo es el destino de las ediciones **permitidas** durante la fase B
del laboratorio. El hook de proteccion (`.claude/hooks/protect-files.mjs`)
no bloquea esta ruta: sirve para demostrar que el control es especifico y
no bloquea todas las ediciones, solo las que coinciden con los patrones
protegidos (`fixtures/protected/`, `.env` y variantes, `.git/`,
`package-lock.json`).

## Checkpoint 2 — evidencia del equipo

Anota aqui, durante la fase B, lo que el equipo observa al probar el hook:

- Intento bloqueado: ruta usada y razon mostrada en stderr.
- Intento permitido: confirmacion de que esta edicion se aplico sin
  problema.

(Espacio en blanco intencional: cada equipo completa esta seccion en
clase.)

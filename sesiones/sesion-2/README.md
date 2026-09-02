# Sesión 2 — Del brief ambiguo al cambio verificado

Laboratorio de práctica del curso AI-SDLC. Parte del mismo servicio de
pagos **ficticio** de la sesión 1, ya con el comportamiento de esa sesión
corregido. No dependes de haber terminado la sesión 1: este snapshot
arranca desde un estado limpio.

El objetivo de esta sesión no es escribir más código que en la anterior.
Es aprender a convertir una solicitud incompleta en un cambio con alcance,
criterios de aceptación y pruebas, antes de que el agente escriba una sola
línea.

## El caso

Durante la sesión recibirás un brief del practitioner. Llega como llegan
los briefs reales: corto, con supuestos no dichos y con al menos una
decisión que nadie tomó todavía. No está en este archivo a propósito.

Lo que sí puedes saber desde ahora: hoy `PaymentService.applyProviderUpdate`
aplica lo que el proveedor envía, sin más. El brief pide cambiar eso.

## Qué hay en esta carpeta

- `src/domain`: tipos y errores del dominio.
- `src/service`: `PaymentService`, con un store en memoria.
- `src/provider`: adaptador de notificaciones del proveedor (ficticio).
- `docs/payment-flow.md`: flujo completo y tablas de estados. Incluye una
  nota sobre el cambio de la sesión 1.
- `tests/`: suite de Vitest.
- `CLAUDE.md`: convenciones del repositorio y definición de "terminado".

## Preflight

Abre la terminal **dentro de esta carpeta**, no en la raíz del repositorio:

```bash
cd sesiones/sesion-2
npm run verify
claude
```

`npm run verify` encadena `typecheck`, `lint` y `test` y debe terminar en
verde antes de empezar. Si no lo hace, avisa al practitioner antes de
continuar.

## Cómo trabajar la sesión

1. **Lee el brief y separa lo que dice de lo que supone.** Antes de abrir
   Claude Code, escribe en una lista: hechos que el brief afirma,
   inferencias que estás haciendo, y decisiones que alguien tiene que tomar
   y que el brief no toma. Esa tercera lista se la preguntas al
   practitioner, que hace de dueño del producto.
2. **Explora con el agente, no le pidas que implemente.** Pide a Claude Code
   que te muestre qué archivos tocaría el cambio y qué pruebas existen
   hoy. Contrasta con `docs/payment-flow.md`.
3. **Escribe los criterios de aceptación antes del código.** Cada criterio
   tiene que ser verificable con una prueba o con un comando: caso
   positivo, cada caso inválido y qué pasa si el proveedor repite la misma
   notificación. Si un criterio no se puede probar, no es un criterio.
4. **Implementa con el brief cerrado.** Ahora sí, pide el cambio al agente,
   pasando los criterios como contrato. Revisa el diff archivo por archivo;
   un cambio que no responde a un criterio se elimina.
5. **Documenta y verifica.** Si cambia el comportamiento del flujo de pagos,
   `docs/payment-flow.md` se actualiza en el mismo cambio. Cierra con
   `npm run verify` en verde, `git status` limpio y un commit que explique
   el cambio.

Regla de la sesión: la firma pública de `applyProviderUpdate` y de
`handleProviderNotification` no cambia, y ninguna prueba existente se
debilita para hacer pasar el cambio.

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

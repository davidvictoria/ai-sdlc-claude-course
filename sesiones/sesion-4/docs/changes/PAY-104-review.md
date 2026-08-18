# Revisión independiente de PAY-104

> Informe de referencia del practitioner. Es la salida esperada del agente
> `payment-reviewer` cuando se le entrega la spec aprobada y el diff de la
> implementación candidata. Sirve para contrastar lo que produjeron los equipos:
> no se espera una redacción idéntica, sí que aparezcan los dos hallazgos.

- **Cambio revisado:** PAY-104, implementación del estado `REVERSED`.
- **Contrato de referencia:** `docs/changes/PAY-104-spec.md`.
- **Alcance inspeccionado:** `src/domain/transitions.ts`, `src/domain/payment-status.ts`,
  `src/service/payment-service.ts`, `tests/`.
- **Evidencia recibida de quien invoca:** `npm run verify` en código 0, 42 pruebas en verde.

## Hallazgos bloqueantes

### B1. La idempotencia de `REVERSED` no se cumple (criterio 5)

**Archivo:** `src/domain/transitions.ts`, función `assertValidTransition`.

La comprobación de terminalidad se evalúa antes que la de idempotencia:

```ts
if (from === 'REVERSED') {
  throw new InvalidTransitionError(from, to);
}

if (to === from) {
  return;
}
```

Como el primer bloque no distingue el destino, la rama de idempotencia es
inalcanzable cuando el origen es `REVERSED`. En consecuencia,
`REVERSED -> REVERSED` lanza `InvalidTransitionError` en lugar de ser un no-op.

La spec lo previene de forma explícita: el criterio 5 declara que una
implementación que trate `REVERSED` como caso especial y lo excluya de la
idempotencia no cumple, aunque el resto de las transiciones sea correcto.

El comentario del código explica el orden como una decisión deliberada
("rejected up front before anything else is evaluated"). La explicación es
plausible, pero contradice el contrato aprobado: el criterio a satisfacer es la
spec, no la intención declarada en el comentario.

**Impacto operativo:** una reversión reenviada por el proveedor (reintento,
duplicado de webhook) produciría un error de dominio en vez de resolverse sin
efecto, que es el comportamiento acordado para el resto de los estados.

**Corrección propuesta:** evaluar la idempotencia antes de la terminalidad, o
acotar la comprobación de terminalidad a `to !== from`. Debe conservarse que
`REVERSED -> APPROVED`, `REVERSED -> PENDING` y `REVERSED -> DECLINED` sigan
siendo inválidas (criterio 4).

### B2. El criterio 3 no tiene prueba que lo respalde

**Archivos:** `tests/transitions.test.ts`, `tests/payment-service.test.ts`.

Ninguna prueba ejercita `DECLINED -> REVERSED`. El criterio 3 exige cobertura
explícita y advierte que no basta con inferirla de que `DECLINED` es terminal.

El comportamiento del código es correcto en este caso: la transición se rechaza.
Lo que falta es la evidencia. Una regresión futura que agregara `REVERSED` a los
destinos permitidos desde `DECLINED` pasaría la suite sin que nada lo detecte.

**Corrección propuesta:** agregar la prueba negativa de `DECLINED -> REVERSED` a
nivel de dominio y de servicio, verificando que lanza `InvalidTransitionError` y
que el pago permanece en `DECLINED`.

## Recomendaciones no bloqueantes

- El comentario de `assertValidTransition` describe el orden de evaluación como
  un requisito de PAY-104. Al corregir B1 conviene reescribirlo para que no
  induzca a repetir el error.
- Las pruebas de terminalidad de `REVERSED` cubren los tres destinos inválidos
  por separado. Una tabla parametrizada haría más visible qué combinaciones
  quedan sin cubrir.

## Brechas de evidencia

Este agente opera en modo de solo lectura (`Read`, `Glob`, `Grep`) y **no ejecutó
ningún comando**. No verifiqué de forma independiente el resultado de
`npm run verify`; tomo como dato el reporte de quien invoca.

Nota relevante para el gate: que la suite esté en verde no contradice estos dos
hallazgos. B1 es una desviación de comportamiento que ninguna prueba ejercita, y
B2 es precisamente una prueba ausente. Un resultado verde demuestra que lo
cubierto funciona, no que la spec se cumple.

## Veredicto

**No listo para verificación determinística.** Deben resolverse B1 y B2. Una vez
corregidos, `npm run verify` debe volver a ejecutarse y el diff final debe
compararse de nuevo contra los once criterios de aceptación.

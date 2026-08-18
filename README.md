# AI-SDLC con Claude Code — repositorio de laboratorio

Repositorio de práctica del programa **AI-SDLC con Claude Code** (Colectivo23 × Izipay).
Contiene un servicio de pagos ficticio con datos sintéticos. No incluye código, datos ni
sistemas reales de Izipay.

## Estructura

```text
sesiones/
  sesion-1/   Fundamentos de Claude Code
  sesion-2/   Del brief ambiguo al cambio verificado
  sesion-3/   Context engineering, skills y MCP
  sesion-4/   Agentes, controles y quality gates
  sesion-5/   Laboratorio integrado (capstone)
```

Cada carpeta es un proyecto autónomo con su propio código, pruebas, `CLAUDE.md` y
configuración de Claude Code. Empiezas cada sesión desde un estado limpio y no dependes
de haber terminado la sesión anterior.

## Preparación (una sola vez, antes de la sesión 1)

```bash
git clone <url-del-repositorio>
cd ai-sdlc-claude-course
npm ci
npm run verify
```

`npm ci` instala las dependencias de las cinco sesiones de una vez.
`npm run verify` en la raíz ejecuta la verificación de todas; debe terminar en verde.

Requisitos: Node.js 22 o superior, npm, Git y Claude Code autenticado.

## Cómo trabajar en una sesión

**Abre la terminal y Claude Code dentro de la carpeta de tu sesión**, no en la raíz:

```bash
cd sesiones/sesion-1
claude
```

Esto importa: Claude Code toma como proyecto el directorio donde lo abres. Si lo abres en
la raíz, explorará las cinco sesiones a la vez y la configuración de `.claude/` de tu
sesión no se aplicará.

## Verificar tu trabajo

Dentro de la carpeta de tu sesión:

```bash
npm run verify
```

Ejecuta type-check, lint y pruebas. Es el gate único del repositorio: mientras no termine
en verde, el trabajo no está listo. Una afirmación del agente no sustituye su salida.

Desde la raíz puedes verificar una sesión concreta:

```bash
npm run verify:s1
```

## Soluciones

Las soluciones de referencia no están en esta rama, a propósito: tenerlas al lado
invalidaría los laboratorios. El practitioner las comparte al cerrar cada sesión.

## Convenciones

- Datos exclusivamente sintéticos. Nunca agregues secretos, credenciales ni datos reales.
- No agregues dependencias salvo que el ejercicio lo autorice explícitamente.
- No elimines ni debilites pruebas existentes para hacer pasar un cambio.
- Actualiza la documentación relacionada cuando cambies comportamiento.

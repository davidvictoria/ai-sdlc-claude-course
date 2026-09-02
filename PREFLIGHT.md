# Preflight — antes de la sesión 1

Completa esto antes de la primera sesión. Toma entre 15 y 30 minutos y no
se hace en clase: el tiempo de sesión es para el laboratorio. Si algo falla,
escribe al canal del programa con la captura del error.

## 1. Node.js 22 o superior

Descarga el instalador LTS desde [nodejs.org](https://nodejs.org) o usa el
gestor de versiones que ya tengas (`nvm`, `fnm`, `volta`). Comprueba:

```bash
node --version    # v22.x o superior
npm --version
```

## 2. Git

- macOS: `git --version` lo instala si falta (Command Line Tools).
- Windows: [git-scm.com](https://git-scm.com/download/win), instalación por
  defecto. Usa Git Bash o PowerShell para los comandos de este documento.

```bash
git --version
```

## 3. Claude Code

Instalador nativo (recomendado por la documentación oficial; se actualiza
solo):

```bash
# macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows (PowerShell)
irm https://claude.ai/install.ps1 | iex
```

Alternativa si tu equipo bloquea el instalador: paquete global de npm (ya
tienes Node 22).

```bash
npm install -g @anthropic-ai/claude-code
```

En Windows nativo, ten instalado Git for Windows (paso 2): Claude Code lo
usa para ejecutar comandos de shell.

Después autentícate una sola vez. Ejecuta `claude` en cualquier carpeta,
sigue el enlace de inicio de sesión con la cuenta que te asignó tu
organización (Claude Code requiere un plan Team, Enterprise, Pro o Max; el
plan gratuito no lo incluye) y cierra con `/exit`. Comprueba:

```bash
claude --version
claude doctor
```

`claude doctor` revisa la instalación y la configuración sin abrir una
sesión; si muestra advertencias, incluye la captura en tu confirmación.

Si estás detrás de un proxy corporativo y el inicio de sesión no abre,
avisa al practitioner antes de la sesión: la sesión 1 se puede seguir en
pareja, pero la remediación tiene que quedar programada.

## 4. Repositorio del curso

```bash
git clone https://github.com/davidvictoria/ai-sdlc-claude-course.git
cd ai-sdlc-claude-course
npm ci
npm run verify
```

`npm ci` instala las dependencias de las cinco sesiones de una vez.
`npm run verify` debe terminar en verde para las cinco; tarda menos de un
minuto.

## 5. Confirmación

Envía por el canal del programa una sola captura con el final de
`npm run verify` (las líneas `Tests ... passed`) y la salida de
`claude --version`. Con eso quedas marcado como preflight aprobado.

## Qué no hace falta

- No instales extensiones de IDE: el curso trabaja en la terminal. Si usas
  VS Code o JetBrains, puedes abrir la terminal integrada.
- No crees ramas ni configures nada en el repositorio. Cada sesión se
  trabaja dentro de su carpeta en `sesiones/`, y el README de cada una dice
  cómo empezar.

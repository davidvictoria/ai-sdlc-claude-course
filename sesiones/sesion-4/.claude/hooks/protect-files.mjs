#!/usr/bin/env node
/**
 * PreToolUse hook for the AI-SDLC course lab (sesion 4).
 *
 * Reads a Claude Code hook event from stdin, extracts the file path the
 * calling tool (Edit/Write/...) is about to touch, and blocks the call when
 * that path matches one of a small, explicit list of protected patterns.
 *
 * Contract:
 *   - Reads JSON from stdin. Never trusts it: empty stdin or invalid JSON
 *     is treated as "nothing to check" and the call is PERMITTED (exit 0).
 *     A hook that fails closed on malformed input would be able to break
 *     the whole session over something as harmless as a stray keystroke;
 *     for this lab, fail open on parse errors and rely on the explicit
 *     pattern list to do the actual blocking.
 *   - Exit code 0  -> allow the tool call.
 *   - Exit code 2  -> block the tool call. Claude Code treats this as a
 *     blocking error and shows stderr to the model/user.
 *   - Never writes file contents to stdout/stderr.
 *   - Never writes a full absolute filesystem path to stdout/stderr (no
 *     usernames, no local directory layout) — only the matched pattern and
 *     the basename of the target file.
 *
 * This is a deliberately small, readable script: it is meant to be
 * inspected by course participants, not extended during the session.
 */

/**
 * Explicit, course-defined list of protected patterns. Kept short and
 * literal on purpose — no globs, no regex from user input, so the policy
 * stays easy to audit at a glance.
 */
const PROTECTED_DIR_PATTERNS = ['fixtures/protected/'];
const PROTECTED_EXACT_BASENAMES = ['package-lock.json'];

/**
 * Reads the full contents of stdin as a UTF-8 string. Resolves to an empty
 * string if stdin is closed immediately (no event was piped in) or if a
 * read error occurs, so the caller can fail open instead of hanging or
 * crashing.
 */
function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    try {
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (chunk) => {
        data += chunk;
      });
      process.stdin.on('end', () => resolve(data));
      process.stdin.on('error', () => resolve(''));
    } catch {
      resolve('');
    }
  });
}

/**
 * Best-effort extraction of the destination path from a Claude Code
 * PreToolUse event. Supports the shapes used by Edit/Write today and a few
 * reasonable variants so the hook does not silently stop working if the
 * field name shifts slightly across tools or versions.
 */
function extractTargetPath(event) {
  if (!event || typeof event !== 'object') {
    return null;
  }

  const toolInput =
    (event.tool_input && typeof event.tool_input === 'object' && event.tool_input) ||
    (event.toolInput && typeof event.toolInput === 'object' && event.toolInput) ||
    {};

  const candidates = [
    toolInput.file_path,
    toolInput.path,
    toolInput.notebook_path,
    toolInput.filePath,
    event.file_path,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return null;
}

/** Normalizes path separators so matching works the same on macOS, Linux and Windows. */
function toForwardSlashes(pathStr) {
  return pathStr.replace(/\\/g, '/');
}

/** Returns the final path segment (the filename), independent of separator style. */
function basenameOf(normalizedPath) {
  const segments = normalizedPath.split('/').filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : normalizedPath;
}

/**
 * Decides whether a normalized path matches one of the protected patterns.
 * Matching is done on the full path (absolute or relative — it does not
 * matter, since we never print it back) so the hook works whether Claude
 * Code passes an absolute or a project-relative path.
 *
 * Returns the human-readable pattern that matched, or null if the path is
 * not protected.
 */
function matchProtectedPattern(normalizedPath) {
  const basename = basenameOf(normalizedPath);

  for (const dirPattern of PROTECTED_DIR_PATTERNS) {
    if (normalizedPath.startsWith(dirPattern) || normalizedPath.includes(`/${dirPattern}`)) {
      return dirPattern;
    }
  }

  // .env and variants: .env, .env.local, .env.production, demo.env, etc.
  if (basename === '.env' || basename.startsWith('.env.') || basename.endsWith('.env')) {
    return '.env (y variantes)';
  }

  // .git/ internals: version control metadata must never be touched by a tool call.
  if (
    normalizedPath === '.git' ||
    normalizedPath.startsWith('.git/') ||
    normalizedPath.includes('/.git/') ||
    normalizedPath.endsWith('/.git')
  ) {
    return '.git/';
  }

  for (const exactBasename of PROTECTED_EXACT_BASENAMES) {
    if (basename === exactBasename) {
      return exactBasename;
    }
  }

  return null;
}

async function main() {
  const raw = await readStdin();

  let event = null;
  if (raw.trim().length > 0) {
    try {
      event = JSON.parse(raw);
    } catch {
      // Invalid JSON on stdin: fail open (permit). See file header.
      event = null;
    }
  }

  if (!event) {
    process.exit(0);
  }

  const targetPathRaw = extractTargetPath(event);
  if (!targetPathRaw) {
    // No recognizable destination path in this event: nothing to protect
    // against, permit the call.
    process.exit(0);
  }

  const normalizedPath = toForwardSlashes(targetPathRaw);
  const matched = matchProtectedPattern(normalizedPath);

  if (matched) {
    const basename = basenameOf(normalizedPath);
    process.stderr.write(
      `Blocked by course policy: "${basename}" matches protected pattern "${matched}". ` +
        'This path is off-limits in this lab; edit docs/lab-notes.md instead if you need to demonstrate an allowed edit.\n',
    );
    process.exit(2);
  }

  process.exit(0);
}

main().catch(() => {
  // Any unexpected failure in the hook itself must not block the session.
  process.exit(0);
});

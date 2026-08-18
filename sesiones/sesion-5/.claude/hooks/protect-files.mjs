#!/usr/bin/env node
/**
 * protect-files.mjs
 *
 * PreToolUse hook for `Edit` and `Write` (see `.claude/settings.json`).
 * Blocks tool calls that would touch a small, explicit list of protected
 * paths, regardless of what the model's instructions say. This is
 * deterministic enforcement, not a request: instructions in CLAUDE.md or a
 * rule file can be ignored by a confused or adversarial prompt; this hook
 * cannot.
 *
 * Contract with Claude Code:
 *   - Reads a single JSON event from stdin describing the pending tool call.
 *   - Exit code 2 blocks the tool call. The reason (short, no file content)
 *     goes to stderr; Claude Code surfaces it back to the model.
 *   - Exit code 0 allows the tool call to proceed.
 *   - Never prints file contents. Never throws past its own boundary: any
 *     unexpected input (empty stdin, invalid JSON, unknown shape) is treated
 *     as "cannot determine a protected path" and defaults to allow (0),
 *     because this hook's job is to block a short, known list of paths, not
 *     to gate everything it does not understand.
 *
 * Protected patterns (course fixtures, see PROTECTED_PATTERNS below):
 *   - fixtures/protected/   (synthetic protected fixtures for the lab)
 *   - .env and dotenv variants (.env.local, .env.production, ...)
 *   - .git/                 (repository internals)
 *   - package-lock.json     (no dependency changes authorized in the lab)
 */

import path from 'node:path';

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();

/**
 * Each pattern is tested against a normalized, forward-slash, project-
 * relative path with a `test(relPath)` predicate. Keep this list short and
 * explicit -- it is meant to be readable at a glance, not a general-purpose
 * ignore-file engine.
 */
const PROTECTED_PATTERNS = [
  {
    name: 'fixtures/protected/',
    test: (relPath) => relPath.startsWith('fixtures/protected/'),
  },
  {
    name: '.env (and variants, e.g. .env.local)',
    test: (relPath) => {
      const base = relPath.split('/').pop() ?? '';
      return base === '.env' || base.startsWith('.env.');
    },
  },
  {
    name: '.git/',
    test: (relPath) => relPath === '.git' || relPath.startsWith('.git/'),
  },
  {
    name: 'package-lock.json',
    test: (relPath) => relPath === 'package-lock.json',
  },
];

/** Reads all of stdin as text. Resolves to '' if stdin is empty or closes immediately. */
function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(data));
  });
}

/**
 * Extracts the tool's target file path from a Claude Code PreToolUse event,
 * across the field names different tools use. Returns null when no path
 * can be determined.
 */
function extractTargetPath(event) {
  if (!event || typeof event !== 'object') return null;
  const input = event.tool_input ?? event.toolInput ?? {};
  const candidates = [
    input.file_path,
    input.path,
    input.notebook_path,
    event.file_path,
  ];
  const found = candidates.find((value) => typeof value === 'string' && value.trim() !== '');
  return found ?? null;
}

/** Normalizes an absolute or relative path to a forward-slash path relative to the project dir. */
function toProjectRelativePath(targetPath) {
  const absolute = path.isAbsolute(targetPath)
    ? targetPath
    : path.resolve(PROJECT_DIR, targetPath);
  const relative = path.relative(PROJECT_DIR, absolute);
  return relative.split(path.sep).join('/');
}

function findMatchingPattern(relPath) {
  return PROTECTED_PATTERNS.find((pattern) => pattern.test(relPath));
}

async function main() {
  const raw = await readStdin();

  if (!raw || raw.trim() === '') {
    // No event body: nothing to check against, allow.
    process.exit(0);
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    // Malformed input is not this hook's problem to diagnose; fail open.
    process.exit(0);
  }

  const targetPath = extractTargetPath(event);
  if (!targetPath) {
    // Could not determine a target path (e.g. a tool this hook does not
    // recognize); nothing explicit to block.
    process.exit(0);
  }

  const relPath = toProjectRelativePath(targetPath);
  const matched = findMatchingPattern(relPath);

  if (matched) {
    process.stderr.write(
      `protect-files: blocked write to protected path "${relPath}" (matches: ${matched.name}).\n`,
    );
    process.exit(2);
  }

  process.exit(0);
}

main();

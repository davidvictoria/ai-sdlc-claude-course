// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    // .claude/hooks/*.mjs runs standalone under plain Node (not part of the
    // TypeScript build), so it needs Node globals (process, etc.) instead
    // of the TS-project type-aware config above.
    files: ['.claude/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
);

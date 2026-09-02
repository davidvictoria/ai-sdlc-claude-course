// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

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
      globals: {
        process: 'readonly',
        console: 'readonly',
        URL: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
      },
    },
  },
);

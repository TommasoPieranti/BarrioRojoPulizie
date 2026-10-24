import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'playwright-report',
      'test-results',
      'coverage',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    // Rules and i18n files hold plain data/functions, not JSX.
    // User-facing text in components must come from src/i18n/it.ts.
    files: ['src/**/*.tsx'],
    ignores: ['src/**/*.test.tsx', 'src/components/ui/**'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'JSXElement > JSXText[value=/[A-Za-zÀ-ÿ]{2,}/]',
          message:
            'User-facing text must come from the central Italian text file (src/i18n/it.ts) via t().',
        },
      ],
    },
  },
);

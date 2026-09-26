import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Слои FSD: нижний слой не импортирует из верхнего.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*', '@/entities/*/*', '@/widgets/*/*'],
              message: 'Импортируйте слайс через его публичный API (index.ts).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/shared/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/entities/*', '@/features/*', '@/widgets/*', '@/views/*', '@/app/*'],
              message: 'shared не зависит от верхних слоёв.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/entities/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/widgets/*', '@/views/*', '@/app/*'],
              message: 'entities зависят только от shared.',
            },
          ],
        },
      ],
    },
  },
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),
]);

export default eslintConfig;

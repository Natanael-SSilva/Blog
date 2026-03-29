import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Permite uso de `any` com aviso em vez de erro — útil para integrações externas
      '@typescript-eslint/no-explicit-any': 'warn',
      // Permite require() em casos específicos (usado no createAdminClient)
      '@typescript-eslint/no-require-imports': 'warn',
      // Garante que variáveis não usadas sejam prefixadas com _ quando intencionais
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // React 19 não precisa importar React em todo arquivo
      'react/react-in-jsx-scope': 'off',
    },
  },
]

export default eslintConfig

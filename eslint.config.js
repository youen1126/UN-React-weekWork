import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], //忽略所有以大寫或底線開頭的變數
      'eqeqeq': [2], //警告沒有三個等於的判斷式
      'no-console': [2, {
        allow: ['warn', 'error'] //允許console.warn跟console.error不會紅字
      }],
      "no-var": "error",//禁用 var
      "prefer-const": "warn",//用 let 但沒改值 → 提醒改 const
    },
  },
])

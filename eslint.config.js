const js = require('@eslint/js')
const prettier = require('eslint-config-prettier')
const globals = require('globals')

module.exports = [
  {
    ignores: ['coverage/', 'node_modules/', 'npm-packages/', 'playwright-report/', 'test-results/'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'commonjs',
    },
  },
  prettier,
]

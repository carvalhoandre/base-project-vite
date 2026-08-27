function generateEslint({ fs, options }) {
  const imports = [
    "import js from '@eslint/js'",
    "import prettier from 'eslint-config-prettier'",
    "import jsxA11y from 'eslint-plugin-jsx-a11y'",
    "import react from 'eslint-plugin-react'",
    "import reactHooks from 'eslint-plugin-react-hooks'",
    "import reactRefresh from 'eslint-plugin-react-refresh'",
    "import globals from 'globals'",
  ]
  if (options.typescript) imports.push("import tseslint from 'typescript-eslint'")

  const configItems = [
    `{ ignores: ['dist', 'coverage', 'playwright-report', 'test-results', '.lighthouseci'] }`,
    'js.configs.recommended',
  ]
  if (options.typescript) configItems.push('...tseslint.configs.recommended')
  configItems.push(
    'reactHooks.configs.flat.recommended',
    'reactRefresh.configs.vite',
    `{ files: ['**/*.{jsx,tsx}'], plugins: { react }, rules: { 'react/jsx-uses-vars': 'error' } }`,
    `{ files: ['*.config.{js,ts}', '.lighthouserc.cjs'], languageOptions: { globals: globals.node } }`,
    `{
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  }`,
    'prettier',
  )

  const exported = options.typescript
    ? `export default tseslint.config(\n  ${configItems.join(',\n  ')},\n)`
    : `export default [\n  ${configItems.join(',\n  ')},\n]`

  fs.write('eslint.config.js', `${imports.join('\n')}\n\n${exported}`)
}

module.exports = { generateEslint }

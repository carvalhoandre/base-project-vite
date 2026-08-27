function generateGit({ fs, options, packageJson }) {
  if (!options.git) return

  packageJson.scripts.prepare = 'husky'
  packageJson['lint-staged'] = {
    '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
    '*.{css,html,json,jsonc,md,yaml,yml}': 'prettier --write --ignore-unknown',
  }
  fs.write('.husky/pre-commit', 'npx lint-staged')
}

module.exports = { generateGit }

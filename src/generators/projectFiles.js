function appendUniqueLines(content, lines) {
  const existing = new Set(content.split(/\r?\n/))
  const additions = lines.filter((line) => !existing.has(line))
  return `${content.trimEnd()}\n${additions.join('\n')}\n`
}

function generateProjectFiles({ fs, options, packageJson }) {
  const ignores = ['playwright-report/', 'test-results/', 'blob-report/', '.lighthouseci/']
  const currentGitignore = fs.exists('.gitignore') ? fs.read('.gitignore') : ''
  fs.write('.gitignore', appendUniqueLines(currentGitignore, ignores))
  fs.write(
    '.github/pull_request_template.md',
    `## Resumo

<!-- Descreva a mudança e a motivação. -->

## Validação

- [ ] Lint e formatação
- [ ] Testes afetados
- [ ] Build de produção

## Riscos

<!-- Registre impactos, compatibilidade e plano de reversão quando aplicável. -->`,
  )

  packageJson.scripts.check = [
    'npm run lint',
    'npm run format:check',
    ...(options.typescript ? ['npm run typecheck'] : []),
    'npm run build',
  ].join(' && ')

  delete packageJson.scripts.test
}

module.exports = { generateProjectFiles }

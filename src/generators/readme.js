const LABELS = {
  router: 'React Router 8 (Data Mode)',
  zustand: 'Zustand',
  tailwind: 'Tailwind CSS',
  lighthouse: 'Lighthouse CI',
  playwright: 'Playwright',
  git: 'Git, Husky e lint-staged',
}

function generateReadme({ fs, options, packageJson }) {
  const enabled = Object.keys(LABELS).filter((key) => options[key])
  const tools = [
    `- React + Vite em ${options.typescript ? 'TypeScript' : 'JavaScript'}`,
    '- ESLint Flat Config e Prettier',
    ...enabled.map((key) => `- ${LABELS[key]}`),
  ]
  const scripts = Object.entries(packageJson.scripts)
    .map(([name, command]) => `- \`npm run ${name}\`: \`${command}\``)
    .join('\n')
  const playwright = options.playwright
    ? `
## Playwright

Instale o navegador uma vez com \`npx playwright install chromium\`. Os testes usam a build de produção na porta 4173.
`
    : ''
  const lighthouse = options.lighthouse
    ? `
## Lighthouse

\`npm run lighthouse\` constrói e audita \`dist\` em três execuções. Performance começa como aviso em 0,85; acessibilidade, boas práticas e SEO falham abaixo de 0,90. Ajuste os limites em \`.lighthouserc.cjs\` conforme o produto amadurecer.
`
    : ''
  const git = options.git
    ? `
## Git

O repositório foi iniciado em \`main\` e o pre-commit executa lint-staged. Crie o primeiro commit quando estiver pronto.
`
    : ''

  fs.write(
    'README.md',
    `# ${options.projectName}

Aplicação criada com [create-base-vite](https://github.com/carvalhoandre/base-project-vite).

## Ferramentas habilitadas

${tools.join('\n')}

## Começar

\`\`\`bash
npm install
npm run dev
\`\`\`

## Scripts

${scripts}

## Estrutura

- \`src/app\`: bootstrap, aplicação e router
- \`src/components\`: componentes reutilizáveis
- \`src/features\`: funcionalidades agrupadas
- \`src/pages\`: composição de páginas
- \`src/styles\`: estilos globais
- \`src/hooks\`, \`src/lib\`, \`src/services\` e \`src/types\`: código compartilhado quando necessário
${playwright}${lighthouse}${git}`,
  )
}

module.exports = { generateReadme }

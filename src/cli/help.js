const HELP = `
Uso:
  create-base-vite <project-name> [opções]

Opções:
  --router       Configura React Router para uma SPA Vite
  --zustand      Instala Zustand e cria um contador mínimo por feature
  --tailwind     Configura Tailwind CSS com o plugin oficial do Vite
  --lighthouse   Adiciona Lighthouse CI e scripts de auditoria da build
  --playwright   Adiciona Playwright e testes smoke E2E
  --git          Inicializa Git em main e configura Husky/lint-staged
  --full         Habilita todas as opções acima
  --no-ts        Gera JavaScript (TypeScript é o padrão)
  -h, --help     Exibe esta ajuda
  -v, --version  Exibe a versão da CLI

Exemplos:
  create-base-vite minha-app
  create-base-vite minha-app --router --playwright
  create-base-vite minha-app --full
  create-base-vite minha-app --full --no-ts
`

function printHelp(output = console.log) {
  output(HELP.trim())
}

module.exports = { HELP, printHelp }

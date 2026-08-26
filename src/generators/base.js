function extension(options) {
  return options.typescript ? 'tsx' : 'jsx'
}

function generateBase({ fs, options, packageJson }) {
  const ext = extension(options)

  for (const target of [
    'src/assets',
    'src/App.css',
    'src/index.css',
    'src/App.tsx',
    'src/App.jsx',
    'public/vite.svg',
  ]) {
    fs.remove(target)
  }

  fs.write(
    'index.html',
    `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${options.projectName}" />
    <title>${options.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${ext}"></script>
  </body>
</html>`,
  )

  const appImport = options.router
    ? "import { RouterProvider } from 'react-router'\nimport { router } from './router'"
    : "import { HomePage } from '../pages/HomePage'"
  const appBody = options.router ? '<RouterProvider router={router} />' : '<HomePage />'

  fs.write(
    `src/app/App.${ext}`,
    `${appImport}

export function App() {
  return ${appBody}
}`,
  )

  fs.write(
    `src/main.${ext}`,
    `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './styles/global.css'

createRoot(document.getElementById('root')${options.typescript ? '!' : ''}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`,
  )

  const homeImports = []
  if (options.zustand)
    homeImports.push("import { Counter } from '../features/counter/components/Counter'")
  if (options.router) homeImports.push("import { Link } from 'react-router'")
  const imports = homeImports.length ? `${homeImports.join('\n')}\n\n` : ''
  const counter = options.zustand ? '\n      <Counter />' : ''
  const routerLink = options.router ? '\n      <Link to="/sobre">Sobre</Link>' : ''
  fs.write(
    `src/pages/HomePage.${ext}`,
    `${imports}export function HomePage() {
  return (
    <main>
      <h1>${options.projectName}</h1>
      <p>Uma base limpa para começar.</p>${counter}${routerLink}
    </main>
  )
}`,
  )

  fs.write(
    'src/styles/global.css',
    `${options.tailwind ? '@import "tailwindcss";\n\n' : ''}:root {
  font-family: Inter, system-ui, sans-serif;
  color: #172033;
  background: #f8fafc;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
a {
  font: inherit;
}

main {
  width: min(100% - 2rem, 64rem);
  margin-inline: auto;
  padding-block: 4rem;
}`,
  )

  for (const directory of ['components', 'hooks', 'lib', 'services', 'types']) {
    fs.write(`src/${directory}/.gitkeep`, '')
  }

  packageJson.scripts = {
    ...packageJson.scripts,
    lint: 'eslint . --max-warnings 0',
    'lint:fix': 'eslint . --fix',
    format: 'prettier . --write',
    'format:check': 'prettier . --check',
  }

  if (options.typescript) packageJson.scripts.typecheck = 'tsc -b --pretty false'
}

module.exports = { generateBase }

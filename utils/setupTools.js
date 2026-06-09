const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

function safeExec(command, description) {
  try {
    console.log(`\n▶ ${description}`)
    execSync(command, { stdio: 'inherit' })
  } catch (error) {
    console.error(`\n✖ Falha ao executar: ${command}`)
    console.error(error.message)
    process.exit(1)
  }
}

function writeIfExists(filePath, content) {
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content)
  }
}

function updateIndexTitle(projectName) {
  const indexHtmlPath = path.resolve('index.html')
  if (!fs.existsSync(indexHtmlPath)) return

  const html = fs.readFileSync(indexHtmlPath, 'utf-8')
  const updatedHtml = html.replace(/<title>.*<\/title>/, `<title>${projectName}</title>`)
  fs.writeFileSync(indexHtmlPath, updatedHtml)
}

function setupRouter(mainPath) {
  if (!fs.existsSync(mainPath)) return
  let mainCode = fs.readFileSync(mainPath, 'utf-8')

  if (!mainCode.includes('BrowserRouter')) {
    const importNeedle = "import App from './App'"
    if (mainCode.includes(importNeedle)) {
      mainCode = mainCode.replace(importNeedle, `${importNeedle}\nimport { BrowserRouter } from 'react-router-dom'`)
    }
  }

  if (mainCode.includes('<App />') && !mainCode.includes('<BrowserRouter>')) {
    mainCode = mainCode.replace('<App />', '<BrowserRouter><App /></BrowserRouter>')
  }

  fs.writeFileSync(mainPath, mainCode)
}

function setupTailwind(viteConfigPath) {
  if (!fs.existsSync(viteConfigPath)) return
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')

  if (!viteConfig.includes("@tailwindcss/vite")) {
    viteConfig = viteConfig.replace(
      /import react from '@vitejs\/plugin-react'\r?\n/,
      "import react from '@vitejs/plugin-react'\nimport tailwindcss from '@tailwindcss/vite'\n"
    )
  }

  viteConfig = viteConfig.replace(/plugins:\s*\[\s*react\(\)\s*\]/, 'plugins: [react(), tailwindcss()]')
  fs.writeFileSync(viteConfigPath, viteConfig)

  writeIfExists(path.resolve('src/index.css'), '@import "tailwindcss";\n')
}

function createZustandStore(useTS) {
  const storeDir = path.resolve('src/store')
  if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir, { recursive: true })

  const storePath = path.join(storeDir, useTS ? 'useCounterStore.ts' : 'useCounterStore.js')

  const storeCode = useTS
    ? `import { create } from 'zustand'

type CounterState = {
  count: number
  inc: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 }))
}))
`
    : `import { create } from 'zustand'

export const useCounterStore = create((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 }))
}))
`

  fs.writeFileSync(storePath, storeCode)
}

function buildAppCode({ projectName, useTS, useRouter, useZustand }) {
  const storeImport = useZustand
    ? `import { useCounterStore } from './store/useCounterStore'\n\n`
    : ''

  const counterCode = useZustand
    ? `  const count = useCounterStore((state) => state.count)
  const inc = useCounterStore((state) => state.inc)
`
    : ''

  const counterUi = useZustand
    ? `
      <p>Counter: {count}</p>
      <button onClick={inc}>Increment</button>
`
    : ''

  if (useRouter) {
    return `${storeImport}import { Link, Navigate, Route, Routes } from 'react-router-dom'

const Home = () => {
${counterCode}  return (
    <main>
      <h1>${projectName}</h1>
      <p>Projeto criado com base-project-vite.</p>${counterUi}
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
    </main>
  )
}

const About = () => (
  <main>
    <h2>About</h2>
    <p>Starter com Vite + React${useTS ? ' + TypeScript' : ''}.</p>
    <Link to="/">Voltar</Link>
  </main>
)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
`
  }

  return `${storeImport}export default function App() {
${counterCode}  return (
    <main>
      <h1>${projectName}</h1>
      <p>Projeto criado com base-project-vite.</p>${counterUi}
    </main>
  )
}
`
}

module.exports = function setupTools(options) {
  const { projectName, useTS, useRouter, useTailwind, useZustand } = options
  const templatesPath = path.resolve(__dirname, '../templates')

  try {
    execSync('git init', { stdio: 'inherit' })
  } catch (err) {
    console.error('Aviso: não foi possível executar git init.')
    console.error(err.message)
  }

  const devDeps = [
    'eslint@8.57.0',
    'prettier',
    'eslint-config-prettier',
    'eslint-plugin-react',
    'eslint-plugin-prettier',
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react-hooks',
    'eslint-config-airbnb',
    'lint-staged',
    'husky'
  ]

  if (useTS) {
    devDeps.push(
      '@typescript-eslint/eslint-plugin@8.28.0',
      '@typescript-eslint/parser@8.28.0',
      'eslint-config-airbnb-typescript'
    )
  }

  safeExec(`npm install -D ${devDeps.join(' ')} --legacy-peer-deps`, 'Instalando ferramentas de qualidade')

  const files = ['.eslintrc.json', '.prettierrc', '.editorconfig', '.github/pull_request_template.md', 'README.md']
  for (const file of files) {
    const src = path.join(templatesPath, file)
    const dest = path.resolve(file)
    const dir = path.dirname(dest)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.copyFileSync(src, dest)
  }

  safeExec('npx husky install', 'Configurando Husky')

  const pkgPath = path.resolve('package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.scripts = {
    ...pkg.scripts,
    prepare: 'husky install',
    lint: 'eslint . --ext .ts,.tsx,.js,.jsx',
    format: 'prettier --write .'
  }
  pkg['lint-staged'] = {
    '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write']
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

  const huskyHookPath = path.resolve('.husky/pre-commit')
  if (!fs.existsSync(huskyHookPath)) {
    fs.writeFileSync(huskyHookPath, '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\nnpx lint-staged\n')
    fs.chmodSync(huskyHookPath, 0o755)
  }

  updateIndexTitle(projectName)

  writeIfExists(path.resolve('src/App.css'), '')
  if (!useTailwind) {
    writeIfExists(path.resolve('src/index.css'), '')
  }
  writeIfExists(path.resolve('src/assets/react.svg'), '')
  if (fs.existsSync(path.resolve('src/assets/react.svg'))) {
    fs.unlinkSync(path.resolve('src/assets/react.svg'))
  }

  const mainPath = useTS ? path.resolve('src/main.tsx') : path.resolve('src/main.jsx')
  const appPath = useTS ? path.resolve('src/App.tsx') : path.resolve('src/App.jsx')
  const viteConfigPath = useTS ? path.resolve('vite.config.ts') : path.resolve('vite.config.js')

  if (useRouter) {
    setupRouter(mainPath)
  }

  if (useTailwind) {
    setupTailwind(viteConfigPath)
  }

  if (useZustand) {
    createZustandStore(useTS)
  }

  writeIfExists(appPath, buildAppCode({ projectName, useTS, useRouter, useZustand }))
}

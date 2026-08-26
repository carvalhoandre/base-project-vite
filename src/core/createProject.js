const fsNative = require('node:fs')
const { createCommandRunner } = require('./commandRunner')
const { createFileSystem } = require('./fileSystem')
const { generateProject } = require('./generateProject')
const { enabledFeatures } = require('./options')

const QUALITY_DEPENDENCIES = [
  '@eslint/js@^9.39.5',
  'eslint@^9.39.5',
  'eslint-config-prettier',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-react',
  'eslint-plugin-react-hooks',
  'eslint-plugin-react-refresh',
  'globals',
  'prettier',
]

function dependencyPlan(options) {
  const runtime = []
  const development = [...QUALITY_DEPENDENCIES]

  if (options.router) runtime.push('react-router')
  if (options.zustand) runtime.push('zustand')
  if (options.typescript) development.push('typescript-eslint')
  if (options.tailwind) development.push('tailwindcss', '@tailwindcss/vite')
  if (options.lighthouse) development.push('@lhci/cli')
  if (options.playwright) development.push('@playwright/test')
  if (options.git) development.push('husky', 'lint-staged')

  return { runtime, development }
}

async function createProject(options) {
  const runner = options.runner ?? createCommandRunner({ output: options.output })
  const template = options.typescript ? 'react-ts' : 'react'

  runner.npm(['create', 'vite@latest', options.projectName, '--', '--template', template], {
    cwd: options.cwd,
    description: 'Criando projeto base com Vite',
  })

  if (!fsNative.existsSync(options.projectPath)) {
    throw new Error('O Vite terminou sem criar o diretório esperado.')
  }

  runner.npm(['install'], {
    cwd: options.projectPath,
    description: 'Instalando dependências do Vite',
  })
  const dependencies = dependencyPlan(options)

  if (dependencies.runtime.length) {
    runner.npm(['install', ...dependencies.runtime], {
      cwd: options.projectPath,
      description: 'Instalando bibliotecas opcionais',
    })
  }
  runner.npm(['install', '--save-dev', ...dependencies.development], {
    cwd: options.projectPath,
    description: 'Instalando ferramentas de qualidade',
  })

  if (options.git) {
    runner.git(['init', '--initial-branch=main'], {
      cwd: options.projectPath,
      description: 'Inicializando Git na branch main',
    })
    runner.npm(['exec', '--', 'husky', 'init'], {
      cwd: options.projectPath,
      description: 'Inicializando Husky',
    })
  }

  const fs = createFileSystem(options.projectPath)
  const packageJson = JSON.parse(fs.read('package.json'))
  const context = { fs, options, packageJson }
  generateProject(context)

  runner.npm(['install'], {
    cwd: options.projectPath,
    description: 'Sincronizando o lockfile do projeto',
  })
  runner.npm(['run', 'format'], {
    cwd: options.projectPath,
    description: 'Formatando os arquivos gerados',
  })

  return { enabled: enabledFeatures(options), projectPath: options.projectPath }
}

module.exports = { QUALITY_DEPENDENCIES, createProject, dependencyPlan }

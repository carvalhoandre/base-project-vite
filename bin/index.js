#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

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

function printHelp() {
  console.log(`
Usage:
  create-base-vite <project-name> [options]
  react-vite-clean-cli <project-name> [options]

Options:
  --router      Instala e configura React Router
  --zustand     Instala e adiciona exemplo com Zustand
  --tailwind    Instala e configura Tailwind CSS v4
  --no-ts       Usa template React JavaScript (default: TypeScript)
  -h, --help    Mostra esta ajuda
`)
}

function parseArgs(rawArgs) {
  const options = {
    useTS: true,
    useRouter: false,
    useTailwind: false,
    useZustand: false,
    projectName: ''
  }

  for (const arg of rawArgs) {
    if (arg === '-h' || arg === '--help') {
      options.help = true
      continue
    }

    if (arg === '--no-ts') {
      options.useTS = false
      continue
    }

    if (arg === '--router') {
      options.useRouter = true
      continue
    }

    if (arg === '--tailwind') {
      options.useTailwind = true
      continue
    }

    if (arg === '--zustand') {
      options.useZustand = true
      continue
    }

    if (arg.startsWith('-')) {
      console.error(`\n✖ Opção desconhecida: ${arg}`)
      printHelp()
      process.exit(1)
    }

    if (!options.projectName) {
      options.projectName = arg
    }
  }

  return options
}

const options = parseArgs(process.argv.slice(2))

if (options.help) {
  printHelp()
  process.exit(0)
}

if (!options.projectName) {
  console.error('\n✖ Informe o nome do projeto.')
  printHelp()
  process.exit(1)
}

const projectPath = path.resolve(options.projectName)
if (fs.existsSync(projectPath)) {
  console.error(`\n✖ A pasta "${options.projectName}" já existe.`)
  process.exit(1)
}

safeExec(
  `npm create vite@latest "${options.projectName}" -- --template ${options.useTS ? 'react-ts' : 'react'}`,
  'Criando projeto base com Vite'
)

process.chdir(projectPath)

safeExec('npm install', 'Instalando dependências do template')

const runtimeDeps = []
const devDeps = []

if (options.useRouter) runtimeDeps.push('react-router-dom')
if (options.useZustand) runtimeDeps.push('zustand')
if (options.useTailwind) devDeps.push('tailwindcss', '@tailwindcss/vite')

if (runtimeDeps.length > 0) {
  safeExec(`npm install ${runtimeDeps.join(' ')}`, 'Instalando libs opcionais')
}

if (devDeps.length > 0) {
  safeExec(`npm install -D ${devDeps.join(' ')}`, 'Instalando ferramentas opcionais')
}

require('../utils/setupTools')({
  projectName: options.projectName,
  useTS: options.useTS,
  useRouter: options.useRouter,
  useTailwind: options.useTailwind,
  useZustand: options.useZustand
})

console.log(`\n✅ Projeto "${options.projectName}" criado com sucesso.`)
console.log('\nPróximos passos:')
console.log(`cd ${options.projectName}`)
console.log('npm run dev')

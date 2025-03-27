#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// ⚙️ Função de execução segura
function safeExec(command, description) {
  try {
    console.log(`\n▶️ ${description}`)
    execSync(command, { stdio: 'inherit' })
  } catch (error) {
    console.error(`\n❌ Erro ao executar: ${command}`)
    console.error(error.message)
    process.exit(1)
  }
}

// ⚙️ Argumentos da CLI
const args = process.argv.slice(2)
const projectName = args[0] || 'my-app'
const useTS = !args.includes('--no-ts')
const useRouter = args.includes('--router')
const useTailwind = args.includes('--tailwind')
const useZustand = args.includes('--zustand')

// 🏗 Cria projeto Vite com React + (TS ou JS)
safeExec(`npm create vite@latest ${projectName} -- --template ${useTS ? 'react-ts' : 'react'}`, 'Criando projeto Vite')

// 📁 Entra na pasta do projeto
process.chdir(projectName)

// 📦 Instala dependências base
safeExec('npm install', 'Instalando dependências base')

// 📦 Instala dependências opcionais
const extras = []
if (useRouter) extras.push('react-router-dom')
if (useTailwind) extras.push('tailwindcss postcss autoprefixer')
if (useZustand) extras.push('zustand')

if (extras.length) {
  safeExec(`npm install ${extras.join(' ')}`, 'Instalando libs opcionais')
}

// 🎛 Executa setup customizado
require('../utils/setupTools')(projectName)

console.log(`\n✅ Projeto "${projectName}" criado com sucesso! 🚀`)
console.log(`\n📌 Próximos passos:`)
console.log(`cd ${projectName}`)
console.log(`npm run dev`)

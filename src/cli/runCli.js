const fs = require('node:fs')
const path = require('node:path')
const packageJson = require('../../package.json')
const { createProject } = require('../core/createProject')
const { printHelp } = require('./help')
const { parseArgs } = require('./parseArgs')
const { resolveOptions, validateProjectName } = require('../core/options')

async function runCli(rawArgs, dependencies = {}) {
  const output = dependencies.output ?? console.log
  const errorOutput = dependencies.errorOutput ?? console.error

  try {
    const parsed = parseArgs(rawArgs)
    if (parsed.help) return printHelp(output)
    if (parsed.version) return output(packageJson.version)

    const options = resolveOptions(parsed)
    validateProjectName(options.projectName)

    const cwd = dependencies.cwd ?? process.cwd()
    const projectPath = path.resolve(cwd, options.projectName)
    if (fs.existsSync(projectPath)) throw new Error(`A pasta "${options.projectName}" já existe.`)

    const result = await (dependencies.createProject ?? createProject)({
      ...options,
      cwd,
      projectPath,
      output,
      runner: dependencies.runner,
    })

    output(`\n✅ Projeto "${options.projectName}" criado com sucesso.`)
    output(`Opções habilitadas: ${result.enabled.length ? result.enabled.join(', ') : 'nenhuma'}`)
    output('\nPróximos passos:')
    output(`  cd ${options.projectName}`)
    if (options.playwright) output('  npx playwright install chromium')
    output('  npm run check')
    output('  npm run dev')
    if (options.git) output('  git add . && git commit -m "chore: initial project setup"')
  } catch (error) {
    errorOutput(`\n✖ ${error.message}`)
    if (error.cause?.message) errorOutput(`Causa: ${error.cause.message}`)
    if (dependencies.setExitCode) dependencies.setExitCode(1)
    else process.exitCode = 1
  }
}

module.exports = { runCli }

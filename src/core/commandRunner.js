const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

class CommandError extends Error {
  constructor(command, args, result) {
    super(
      `O comando ${command} ${args.join(' ')} falhou com código ${result.status ?? 'desconhecido'}.`,
    )
    this.name = 'CommandError'
    this.command = command
    this.args = args
    this.exitCode = result.status
    this.cause = result.error
  }
}

function createCommandRunner({ spawn = spawnSync, output = console.log } = {}) {
  return {
    run(command, args, options = {}) {
      output(`\n▶ ${options.description ?? `${command} ${args.join(' ')}`}`)
      const result = spawn(command, args, {
        cwd: options.cwd,
        env: options.env ?? process.env,
        shell: false,
        stdio: options.stdio ?? 'inherit',
        encoding: 'utf8',
      })

      if (result.error || result.status !== 0) throw new CommandError(command, args, result)
      return result
    },

    npm(args, options = {}) {
      if (process.platform !== 'win32') return this.run('npm', args, options)

      const npmCliCandidates = [
        process.env.npm_execpath,
        path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js'),
      ].filter(Boolean)
      const npmCli = npmCliCandidates.find((candidate) => fs.existsSync(candidate))
      if (!npmCli)
        throw new Error('Não foi possível localizar o npm-cli.js nesta instalação do Node.')
      return this.run(process.execPath, [npmCli, ...args], options)
    },

    git(args, options = {}) {
      return this.run('git', args, options)
    },
  }
}

module.exports = { CommandError, createCommandRunner }

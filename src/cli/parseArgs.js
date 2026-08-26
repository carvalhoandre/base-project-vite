const KNOWN_FLAGS = new Set([
  '--router',
  '--zustand',
  '--tailwind',
  '--lighthouse',
  '--playwright',
  '--git',
  '--full',
  '--no-ts',
  '--help',
  '-h',
  '--version',
  '-v',
])

function parseArgs(args) {
  const parsed = {
    projectName: undefined,
    router: false,
    zustand: false,
    tailwind: false,
    lighthouse: false,
    playwright: false,
    git: false,
    full: false,
    typescript: true,
    help: false,
    version: false,
  }

  for (const argument of args) {
    if (argument.startsWith('-') && !KNOWN_FLAGS.has(argument)) {
      throw new Error(`Opção desconhecida: ${argument}`)
    }

    if (argument === '--help' || argument === '-h') parsed.help = true
    else if (argument === '--version' || argument === '-v') parsed.version = true
    else if (argument === '--no-ts') parsed.typescript = false
    else if (argument.startsWith('--')) parsed[argument.slice(2)] = true
    else if (parsed.projectName) throw new Error(`Argumento inesperado: ${argument}`)
    else parsed.projectName = argument
  }

  return parsed
}

module.exports = { parseArgs }

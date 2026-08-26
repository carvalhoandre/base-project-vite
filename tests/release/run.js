const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const repositoryRoot = path.resolve(__dirname, '../..')
const cli = path.join(repositoryRoot, 'bin/index.js')
const releaseRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'create-base-vite-release-'))
const projectName = 'release-validation'

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, shell: false, stdio: 'inherit', encoding: 'utf8' })
  if (result.error || result.status !== 0) {
    throw (
      result.error ?? new Error(`${command} ${args.join(' ')} falhou com código ${result.status}`)
    )
  }
}

function runNpm(args, cwd) {
  if (process.platform === 'win32')
    return run(process.execPath, [process.env.npm_execpath, ...args], cwd)
  return run('npm', args, cwd)
}

try {
  run(process.execPath, [cli, projectName, '--full'], releaseRoot)
  const projectRoot = path.join(releaseRoot, projectName)
  runNpm(['exec', '--', 'playwright', 'install', 'chromium'], projectRoot)
  runNpm(['run', 'test:e2e'], projectRoot)
  runNpm(['run', 'lighthouse'], projectRoot)
} finally {
  fs.rmSync(releaseRoot, { recursive: true, force: true })
}

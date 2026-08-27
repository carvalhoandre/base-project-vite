const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const repositoryRoot = path.resolve(__dirname, '../..')
const cli = path.join(repositoryRoot, 'bin/index.js')
const smokeRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'create-base-vite-smoke-'))
const cases = [
  { name: 'typescript-minimal', args: [] },
  { name: 'typescript-full', args: ['--full'] },
  { name: 'javascript-full', args: ['--full', '--no-ts'] },
  { name: 'partial-no-git', args: ['--router', '--playwright'] },
]

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
  for (const smokeCase of cases) {
    console.log(`\n=== Smoke: ${smokeCase.name} ===`)
    run(process.execPath, [cli, smokeCase.name, ...smokeCase.args], smokeRoot)
    const projectRoot = path.join(smokeRoot, smokeCase.name)
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'))
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

    assert.equal(fs.existsSync(path.join(projectRoot, 'src/assets/react.svg')), false)
    assert.equal(fs.existsSync(path.join(projectRoot, 'public/vite.svg')), false)
    assert.equal(
      fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8').includes('lang="pt-BR"'),
      true,
    )
    runNpm(['run', 'lint'], projectRoot)
    runNpm(['run', 'format:check'], projectRoot)
    if (packageJson.scripts.typecheck) {
      runNpm(['run', 'typecheck'], projectRoot)
    }
    runNpm(['run', 'build'], projectRoot)

    if (smokeCase.args.includes('--playwright') || smokeCase.args.includes('--full')) {
      runNpm(['exec', '--', 'playwright', 'test', '--list'], projectRoot)
    }
    if (smokeCase.args.includes('--full')) {
      run(process.execPath, ['-e', "require('./.lighthouserc.cjs')"], projectRoot)
      for (const dependency of [
        'react-router',
        'zustand',
        '@tailwindcss/vite',
        '@lhci/cli',
        '@playwright/test',
        'husky',
        'lint-staged',
      ]) {
        assert.ok(dependencies[dependency], dependency)
      }
      assert.equal(fs.existsSync(path.join(projectRoot, '.git')), true)
    }

    if (smokeCase.name === 'partial-no-git') {
      assert.equal(fs.existsSync(path.join(projectRoot, '.git')), false)
      assert.equal(packageJson.devDependencies.husky, undefined)
      for (const dependency of [
        'zustand',
        '@tailwindcss/vite',
        '@lhci/cli',
        'husky',
        'lint-staged',
      ]) {
        assert.equal(dependencies[dependency], undefined, dependency)
      }
    }

    if (smokeCase.name === 'typescript-minimal') {
      for (const dependency of [
        'react-router',
        'zustand',
        '@tailwindcss/vite',
        '@lhci/cli',
        '@playwright/test',
        'husky',
        'lint-staged',
      ]) {
        assert.equal(dependencies[dependency], undefined, dependency)
      }
    }
  }
} finally {
  fs.rmSync(smokeRoot, { recursive: true, force: true })
}

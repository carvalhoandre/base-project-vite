const assert = require('node:assert/strict')
const test = require('node:test')
const { CommandError, createCommandRunner } = require('../../src/core/commandRunner')

test('executa processo sem shell e preserva argumentos separados', () => {
  let received
  const runner = createCommandRunner({
    output: () => {},
    spawn: (command, args, options) => {
      received = { command, args, options }
      return { status: 0 }
    },
  })

  runner.run('npm', ['create', 'vite@latest', 'app;segura'], { cwd: 'workspace' })
  assert.deepEqual(received.args, ['create', 'vite@latest', 'app;segura'])
  assert.equal(received.options.shell, false)
})

test('expõe comando lógico e código em falhas', () => {
  const runner = createCommandRunner({ output: () => {}, spawn: () => ({ status: 7 }) })
  assert.throws(
    () => runner.run('npm', ['test']),
    (error) => {
      assert.equal(error instanceof CommandError, true)
      assert.equal(error.exitCode, 7)
      assert.equal(error.command, 'npm')
      return true
    },
  )
})

test('npm usa processo sem shell', () => {
  let received
  const runner = createCommandRunner({
    output: () => {},
    spawn: (command, args, options) => {
      received = { command, args, options }
      return { status: 0 }
    },
  })
  runner.npm(['--version'])
  assert.equal(received.options.shell, false)
  assert.equal(received.args.at(-1), '--version')
})

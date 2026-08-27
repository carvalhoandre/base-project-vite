const assert = require('node:assert/strict')
const test = require('node:test')
const { parseArgs } = require('../../src/cli/parseArgs')
const { enabledFeatures, resolveOptions, validateProjectName } = require('../../src/core/options')

test('TypeScript é o padrão', () => {
  assert.equal(parseArgs(['app']).typescript, true)
})

test('--full habilita todas as opções sem alterar TypeScript', () => {
  const options = resolveOptions(parseArgs(['app', '--full']))
  assert.equal(options.typescript, true)
  for (const name of ['router', 'zustand', 'tailwind', 'lighthouse', 'playwright', 'git']) {
    assert.equal(options[name], true)
  }
})

test('--full --no-ts gera configuração completa em JavaScript', () => {
  const options = resolveOptions(parseArgs(['app', '--full', '--no-ts']))
  assert.equal(options.typescript, false)
  assert.equal(options.git, true)
  assert.deepEqual(enabledFeatures(options), [
    'router',
    'zustand',
    'tailwind',
    'lighthouse',
    'playwright',
    'git',
    'no-ts',
  ])
})

test('aceita combinação parcial sem Git e flags repetidas', () => {
  const options = resolveOptions(parseArgs(['app', '--router', '--router', '--playwright']))
  assert.equal(options.router, true)
  assert.equal(options.playwright, true)
  assert.equal(options.git, false)
})

test('--git isolado não habilita outras ferramentas', () => {
  const options = resolveOptions(parseArgs(['app', '--git']))
  assert.equal(options.git, true)
  assert.equal(options.router, false)
})

test('rejeita opção desconhecida', () => {
  assert.throws(() => parseArgs(['app', '--wat']), /Opção desconhecida/)
})

test('rejeita nome ausente ou inválido', () => {
  assert.throws(() => validateProjectName(), /Informe o nome/)
  assert.throws(() => validateProjectName('../fora'), /inválido/)
  assert.throws(() => validateProjectName('nome com espaço'), /inválido/)
})

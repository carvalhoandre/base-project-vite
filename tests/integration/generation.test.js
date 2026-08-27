const assert = require('node:assert/strict')
const test = require('node:test')
const { createFixture } = require('../helpers/projectFixture')

function withFixture(options, assertion) {
  const fixture = createFixture(options)
  try {
    assertion(fixture)
  } finally {
    fixture.cleanup()
  }
}

test('gera TypeScript mínimo limpo sem dependências condicionais', () => {
  withFixture({}, ({ fs, packageJson }) => {
    assert.equal(fs.exists('src/main.tsx'), true)
    assert.equal(fs.exists('src/assets'), false)
    assert.equal(fs.exists('public/vite.svg'), false)
    assert.equal(fs.exists('.husky'), false)
    assert.equal(fs.read('README.md').includes('Playwright'), false)
    assert.match(packageJson.scripts.check, /typecheck/)
  })
})

test('gera TypeScript completo', () => {
  withFixture({ full: true }, ({ fs, packageJson }) => {
    for (const file of [
      'src/app/router.tsx',
      'src/features/counter/model/useCounterStore.ts',
      '.lighthouserc.cjs',
      'playwright.config.ts',
      '.husky/pre-commit',
    ]) {
      assert.equal(fs.exists(file), true, file)
    }
    assert.match(fs.read('vite.config.ts'), /tailwindcss/)
    assert.equal(packageJson.scripts.prepare, 'husky')
  })
})

test('gera JavaScript completo com extensões coerentes', () => {
  withFixture({ full: true, typescript: false }, ({ fs, packageJson }) => {
    assert.equal(fs.exists('src/main.jsx'), true)
    assert.equal(fs.exists('src/app/router.jsx'), true)
    assert.equal(fs.exists('playwright.config.js'), true)
    assert.equal(packageJson.scripts.typecheck, undefined)
  })
})

test('combinação Router e Playwright não cria Git, Lighthouse, Tailwind ou Zustand', () => {
  withFixture({ router: true, playwright: true }, ({ fs, packageJson }) => {
    assert.equal(fs.exists('src/app/router.tsx'), true)
    assert.equal(fs.exists('playwright.config.ts'), true)
    assert.equal(fs.exists('.husky'), false)
    assert.equal(fs.exists('.lighthouserc.cjs'), false)
    assert.equal(fs.exists('src/features/counter'), false)
    assert.equal(packageJson.scripts.prepare, undefined)
  })
})

test('Git isolado configura apenas Husky e lint-staged', () => {
  withFixture({ git: true }, ({ fs, packageJson }) => {
    assert.equal(fs.exists('.husky/pre-commit'), true)
    assert.equal(packageJson.scripts.prepare, 'husky')
    assert.equal(packageJson['lint-staged']['*.{js,jsx,ts,tsx}'][0], 'eslint --fix')
    assert.equal(fs.exists('src/app/router.tsx'), false)
  })
})

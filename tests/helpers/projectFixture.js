const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { createFileSystem } = require('../../src/core/fileSystem')
const { generateProject } = require('../../src/core/generateProject')
const { resolveOptions } = require('../../src/core/options')

function createFixture(overrides = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'create-base-vite-test-'))
  const fileSystem = createFileSystem(root)
  fileSystem.writeJson('package.json', {
    name: 'fixture-app',
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
  })
  fileSystem.write('src/App.css', '.logo { color: red; }')
  fileSystem.write('src/assets/react.svg', '<svg />')
  fileSystem.write('public/vite.svg', '<svg />')
  fileSystem.write('.gitignore', 'node_modules\ndist')

  const options = resolveOptions({
    projectName: 'fixture-app',
    typescript: true,
    router: false,
    zustand: false,
    tailwind: false,
    lighthouse: false,
    playwright: false,
    git: false,
    full: false,
    ...overrides,
  })
  const packageJson = JSON.parse(fileSystem.read('package.json'))
  generateProject({ fs: fileSystem, options, packageJson })

  return {
    root,
    options,
    fs: fileSystem,
    packageJson: JSON.parse(fileSystem.read('package.json')),
    cleanup: () => fs.rmSync(root, { recursive: true, force: true }),
  }
}

module.exports = { createFixture }

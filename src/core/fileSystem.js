const fs = require('node:fs')
const path = require('node:path')

function createFileSystem(rootDirectory) {
  const resolve = (...parts) => path.join(rootDirectory, ...parts)

  return {
    exists(relativePath) {
      return fs.existsSync(resolve(relativePath))
    },
    read(relativePath) {
      return fs.readFileSync(resolve(relativePath), 'utf8')
    },
    write(relativePath, content) {
      const destination = resolve(relativePath)
      fs.mkdirSync(path.dirname(destination), { recursive: true })
      fs.writeFileSync(destination, content.endsWith('\n') ? content : `${content}\n`, 'utf8')
    },
    writeJson(relativePath, value) {
      this.write(relativePath, `${JSON.stringify(value, null, 2)}\n`)
    },
    remove(relativePath) {
      const target = resolve(relativePath)
      if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true })
    },
    root: rootDirectory,
  }
}

module.exports = { createFileSystem }

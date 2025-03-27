const fs = require('fs')
const path = require('path')

module.exports = function cleanVite() {
  const srcPath = path.resolve('src')
  const filesToDelete = ['App.css', 'index.css', 'assets/react.svg']
  const dirsToDelete = ['assets']

  filesToDelete.forEach(file => {
    const filePath = path.join(srcPath, file)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  })

  dirsToDelete.forEach(dir => {
    const dirPath = path.join(srcPath, dir)
    if (fs.existsSync(dirPath)) fs.rmSync(dirPath, { recursive: true, force: true })
  })

  // Optionally clean code in App.tsx, etc.
}

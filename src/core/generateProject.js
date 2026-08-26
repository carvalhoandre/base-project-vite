const { generateBase } = require('../generators/base')
const { generateEslint } = require('../generators/eslint')
const { generateGit } = require('../generators/git')
const { generateLighthouse } = require('../generators/lighthouse')
const { generatePlaywright } = require('../generators/playwright')
const { generatePrettier } = require('../generators/prettier')
const { generateProjectFiles } = require('../generators/projectFiles')
const { generateReadme } = require('../generators/readme')
const { generateRouter } = require('../generators/router')
const { generateTailwind } = require('../generators/tailwind')
const { generateZustand } = require('../generators/zustand')

function generateProject(context) {
  generateBase(context)
  generateRouter(context)
  generateZustand(context)
  generateTailwind(context)
  generateEslint(context)
  generatePrettier(context)
  generateLighthouse(context)
  generatePlaywright(context)
  generateGit(context)
  generateProjectFiles(context)
  generateReadme(context)
  context.fs.writeJson('package.json', context.packageJson)
}

module.exports = { generateProject }

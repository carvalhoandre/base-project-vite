const path = require('node:path')

const OPTIONAL_FEATURES = ['router', 'zustand', 'tailwind', 'lighthouse', 'playwright', 'git']

function resolveOptions(parsed) {
  const options = { ...parsed }

  if (options.full) {
    for (const feature of OPTIONAL_FEATURES) options[feature] = true
  }

  return options
}

function validateProjectName(projectName) {
  if (!projectName) throw new Error('Informe o nome do projeto.')

  const normalized = projectName.replace(/[\\/]+$/, '')
  const name = path.basename(normalized)
  const parent = path.dirname(normalized)
  const validName = /^(?![._-])[a-z0-9][a-z0-9._-]*$/i.test(name)

  if (!validName || name === '.' || name === '..' || parent.split(/[\\/]/).includes('..')) {
    throw new Error(
      `Nome de projeto inválido: "${projectName}". Use letras, números, pontos, hífens ou underscores.`,
    )
  }

  return projectName
}

function enabledFeatures(options) {
  const enabled = OPTIONAL_FEATURES.filter((feature) => options[feature])
  if (!options.typescript) enabled.push('no-ts')
  return enabled
}

module.exports = { OPTIONAL_FEATURES, enabledFeatures, resolveOptions, validateProjectName }

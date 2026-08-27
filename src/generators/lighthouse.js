function generateLighthouse({ fs, options, packageJson }) {
  if (!options.lighthouse) return

  fs.write(
    '.lighthouserc.cjs',
    `module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'is-on-https': 'off',
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
}`,
  )
  Object.assign(packageJson.scripts, {
    lighthouse: 'npm run build && lhci autorun',
    'lighthouse:collect': 'lhci collect',
    'lighthouse:audit': 'lhci assert',
    'lighthouse:healthcheck': 'lhci healthcheck',
  })
}

module.exports = { generateLighthouse }

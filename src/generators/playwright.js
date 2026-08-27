function generatePlaywright({ fs, options, packageJson }) {
  if (!options.playwright) return
  const extension = options.typescript ? 'ts' : 'js'

  fs.write(
    `playwright.config.${extension}`,
    `import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
})`,
  )

  const routerTest = options.router
    ? `

  await page.getByRole('link', { name: 'Sobre' }).click()
  await expect(page).toHaveURL('/sobre')
  await expect(page.getByRole('heading', { name: 'Sobre' })).toBeVisible()

  await page.goto('/sobre')
  await expect(page.getByRole('heading', { name: 'Sobre' })).toBeVisible()`
    : ''
  fs.write(
    `tests/e2e/app.spec.${extension}`,
    `import { expect, test } from '@playwright/test'

test('carrega a aplicação', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '${options.projectName}' })).toBeVisible()${routerTest}
})`,
  )

  Object.assign(packageJson.scripts, {
    'test:e2e': 'npm run build && playwright test',
    'test:e2e:ui': 'playwright test --ui',
    'test:e2e:headed': 'playwright test --headed',
    'test:e2e:report': 'playwright show-report',
  })
}

module.exports = { generatePlaywright }

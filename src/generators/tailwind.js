function generateTailwind({ fs, options }) {
  const extension = options.typescript ? 'ts' : 'js'
  const tailwindImport = options.tailwind ? "import tailwindcss from '@tailwindcss/vite'\n" : ''
  const plugins = options.tailwind ? '[react(), tailwindcss()]' : '[react()]'

  fs.write(
    `vite.config.${extension}`,
    `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
${tailwindImport}
export default defineConfig({
  plugins: ${plugins},
})`,
  )
}

module.exports = { generateTailwind }

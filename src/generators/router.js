function generateRouter({ fs, options }) {
  if (!options.router) return
  const ext = options.typescript ? 'tsx' : 'jsx'

  fs.write(
    `src/app/router.${ext}`,
    `import { createBrowserRouter } from 'react-router'
import { AboutPage } from '../pages/AboutPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/sobre', element: <AboutPage /> },
  { path: '*', element: <NotFoundPage /> },
])`,
  )
  fs.write(
    `src/pages/AboutPage.${ext}`,
    `import { Link } from 'react-router'

export function AboutPage() {
  return (
    <main>
      <h1>Sobre</h1>
      <p>Aplicação React criada com Vite.</p>
      <Link to="/">Voltar ao início</Link>
    </main>
  )
}`,
  )
  fs.write(
    `src/pages/NotFoundPage.${ext}`,
    `import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <main>
      <h1>Página não encontrada</h1>
      <Link to="/">Ir para o início</Link>
    </main>
  )
}`,
  )
}

module.exports = { generateRouter }

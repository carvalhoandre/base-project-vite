# create-base-vite

CLI para criar uma aplicação React + Vite limpa, acessível e pronta para crescer por features. TypeScript é o padrão; Router, Zustand, Tailwind, Lighthouse, Playwright e Git são opt-in.

## Pré-requisitos

- Node.js `^20.19.0 || >=22.12.0`, a faixa exigida pelo Vite 8
- npm compatível com a versão do Node

## Uso

```bash
npx --yes create-base-vite minha-app
```

| Opção             | Comportamento                                             |
| ----------------- | --------------------------------------------------------- |
| `<project-name>`  | Diretório obrigatório, validado antes de qualquer escrita |
| `--router`        | React Router 8 em Data Mode, usando `react-router`        |
| `--zustand`       | Store e componente mínimos em `features/counter`          |
| `--tailwind`      | Tailwind CSS com o plugin oficial do Vite                 |
| `--lighthouse`    | Lighthouse CI sobre `dist`, sem upload público            |
| `--playwright`    | Playwright/Chromium e smoke E2E da build                  |
| `--git`           | Git em `main`, Husky e lint-staged                        |
| `--full`          | Habilita todas as seis opções anteriores                  |
| `--no-ts`         | Gera JavaScript; também funciona com `--full`             |
| `-h`, `--help`    | Exibe ajuda e exemplos                                    |
| `-v`, `--version` | Exibe a versão da CLI                                     |

```bash
# TypeScript mínimo
npx --yes create-base-vite minha-app

# Combinação parcial sem Git
npx --yes create-base-vite minha-app --router --playwright

# Configuração completa em TypeScript
npx --yes create-base-vite minha-app --full

# Configuração completa em JavaScript
npx --yes create-base-vite minha-app --full --no-ts
```

`--full` não altera a linguagem: TypeScript continua padrão e `--no-ts` continua sendo a escolha explícita por JavaScript.

## Matriz de ferramentas

| Ferramenta                                                | Mínimo | Flag           |
| --------------------------------------------------------- | :----: | -------------- |
| React + Vite                                              |   ✓    | —              |
| ESLint Flat Config, React Hooks, React Refresh e JSX a11y |   ✓    | —              |
| Prettier e EditorConfig                                   |   ✓    | —              |
| React Router 8                                            |        | `--router`     |
| Zustand                                                   |        | `--zustand`    |
| Tailwind CSS                                              |        | `--tailwind`   |
| Lighthouse CI                                             |        | `--lighthouse` |
| Playwright                                                |        | `--playwright` |
| Git, Husky e lint-staged                                  |        | `--git`        |

Para aplicações novas, a CLI segue a orientação atual do React Router 8 e importa `createBrowserRouter`, `RouterProvider` e `Link` de `react-router`. O pacote legado `react-router-dom` não é instalado.

## Estrutura gerada

```text
src/
  app/          # bootstrap, App e router opcional
  components/   # componentes reutilizáveis
  features/     # regras e UI por funcionalidade
  hooks/        # hooks compartilhados
  lib/          # adapters e utilitários
  pages/        # composição de páginas e rotas
  services/     # APIs e serviços externos
  styles/       # reset e estilos globais
  types/        # tipos realmente compartilhados
tests/e2e/      # somente com --playwright
```

O scaffold remove logos, assets, contador e CSS demonstrativo do Vite. O README de cada projeto é dinâmico e só documenta as opções presentes.

## Scripts gerados

Todos os projetos recebem `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `format:check` e `check`. TypeScript acrescenta `typecheck`.

- `--playwright`: `test:e2e`, `test:e2e:ui`, `test:e2e:headed`, `test:e2e:report`
- `--lighthouse`: `lighthouse`, `lighthouse:collect`, `lighthouse:audit`, `lighthouse:healthcheck`
- `--git`: `prepare` e pre-commit com lint-staged

Após gerar com Playwright, execute `npx playwright install chromium`. A instalação de browsers não ocorre em `postinstall`.

## Lighthouse

A configuração audita a build de produção três vezes. Performance gera aviso abaixo de 0,85; acessibilidade, boas práticas e SEO falham abaixo de 0,90. Os resultados ficam em `.lighthouseci/`, ignorado pelo Git, e podem ser ajustados em `.lighthouserc.cjs` conforme o produto amadurecer.

## Troubleshooting

- Nome ausente, inválido ou opção desconhecida: consulte `npx create-base-vite --help`.
- Diretório existente: escolha outro nome ou remova-o conscientemente antes de gerar.
- Playwright sem browser: execute `npx playwright install chromium` no projeto.
- Falha de engine: atualize o Node para uma versão coberta por `^20.19.0 || >=22.12.0`.
- Git não é desejado: omita `--git`; lint, formatação e build continuam disponíveis.

## Desenvolvimento

```bash
npm ci
npm run check
npm run test:smoke
npm pack --dry-run
```

Os testes unitários não acessam rede. `test:smoke` cria a matriz real em um diretório temporário, executa lint, format check, typecheck/build e valida configurações opcionais. `test:release` instala Chromium e executa Playwright e Lighthouse reais em um projeto completo.

Consulte [Arquitetura](docs/ARCHITECTURE.md) e [Processo de release](docs/RELEASING.md).

## Publicação e pacote legado

O pacote mantido é `create-base-vite`. O alias local de binário `react-vite-clean-cli` permanece por compatibilidade ao instalar este pacote, mas o pacote npm separado `react-vite-clean-cli@1.0.2` não recebe esta versão e não deve ser apresentado como equivalente atualizado.

Releases seguem os gates documentados, incluindo CI verde, inspeção do tarball, autenticação npm e smoke do pacote publicado.

## Licença

[MIT](LICENSE)

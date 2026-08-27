# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui. O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

## [2.0.0] - 2026-08-27

### Added

- Flags `--lighthouse`, `--playwright`, `--git`, `--full` e `--version`.
- Matriz de testes unitários, integração, smoke e validação real de release.
- CI para as versões LTS de Node compatíveis com Vite 8.
- Documentação de arquitetura e release.

### Changed

- TypeScript continua padrão e `--full --no-ts` oferece a configuração completa em JavaScript.
- React Router usa `react-router` v8 e Data Mode para aplicações novas.
- A aplicação gerada adota estrutura híbrida por feature e não contém conteúdo demonstrativo do Vite.
- ESLint usa Flat Config moderno com React Hooks, React Refresh e JSX a11y; Prettier é executado separadamente.
- Git, Husky e lint-staged agora são estritamente opcionais.
- Requisito de Node alinhado ao Vite 8: `^20.19.0 || >=22.12.0`.
- A versão compatível de ESLint fornecida pelo template do Vite é preservada enquanto JSX a11y não declara suporte ao ESLint 10.

### Removed

- Configuração Next.js/AirBnB, ESLint 8, `eslint-plugin-prettier` e `--legacy-peer-deps`.
- Inicialização automática e incondicional de Git.
- Código morto `cleanVite.js` e templates legados.

## [1.0.3]

### Added

- Versão inicial publicada de `create-base-vite`.

[Unreleased]: https://github.com/carvalhoandre/base-project-vite/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/carvalhoandre/base-project-vite/compare/v1.0.3...v2.0.0
[1.0.3]: https://github.com/carvalhoandre/base-project-vite/releases/tag/v1.0.3

# create-base-vite

CLI para criar projetos React com Vite e aplicar uma base opinativa de qualidade de codigo.

## O que a CLI faz

- Cria projeto com template React (TypeScript por padrao)
- Instala e configura ESLint, Prettier, Husky e lint-staged
- Copia arquivos-base de configuracao a partir de `templates/`
- Permite habilitar opcionalmente:
  - React Router
  - Zustand
  - Tailwind CSS v4

## Uso rapido

```bash
npx create-base-vite my-app --router --zustand --tailwind
```

Compatibilidade com o nome antigo do binario:

```bash
npx react-vite-clean-cli my-app --router --zustand --tailwind
```

## Opcoes

- `--router`: instala e configura React Router no bootstrap
- `--zustand`: instala Zustand e cria uma store de exemplo
- `--tailwind`: instala e configura Tailwind CSS v4
- `--no-ts`: cria projeto em JavaScript (template `react`)
- `-h`, `--help`: mostra ajuda

## Exemplos

Criar projeto TypeScript com tudo:

```bash
npx create-base-vite claravia --router --zustand --tailwind
```

Criar projeto JavaScript simples:

```bash
npx create-base-vite web-js --no-ts
```

## Desenvolvimento local

```bash
npm install
npm link
create-base-vite teste-local --router
```

## Publicacao no npm

Se voce quiser publicar com o novo nome de pacote:

```bash
npm login
npm publish --access public
```

Se o nome `create-base-vite` ja estiver em uso no npm, publique com escopo:

```bash
npm pkg set name=@SEU_USUARIO/create-base-vite
npm publish --access public
```

Depois, o uso fica:

```bash
npx @SEU_USUARIO/create-base-vite my-app
```

## Troubleshooting

Erro `E404 create-base-vite` significa que o pacote ainda nao foi publicado com esse nome.

Alternativas:

1. Use o binario legado publicado hoje: `npx react-vite-clean-cli ...`
2. Publique este projeto com o nome novo (ou escopado) e use `npx` novamente

## Licenca

MIT

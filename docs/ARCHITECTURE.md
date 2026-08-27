# Arquitetura

## Fluxo

`bin/index.js` delega para `src/cli/runCli.js`. O parsing não acessa filesystem nem rede; `resolveOptions` expande `--full` uma única vez e a validação ocorre antes do scaffold.

`createProject` coordena quatro etapas:

1. cria o template oficial do Vite com um processo sem shell;
2. instala dependências base, opcionais e de qualidade com arrays de argumentos;
3. inicializa Git/Husky somente quando solicitado;
4. aplica geradores idempotentes e sincroniza o lockfile.

O runner preserva comando, argumentos, causa e código de saída. A CLI nunca muda o diretório global do processo. Se houver falha, ela não remove diretórios anteriores nem qualquer caminho que não tenha criado.

## Geradores

Cada arquivo em `src/generators` cuida de uma capacidade. Eles recebem filesystem, opções resolvidas e o `package.json` em memória. Isso permite integração em diretórios temporários sem executar npm.

- `base`: remove o demo do Vite e cria a estrutura da aplicação.
- `eslint` e `prettier`: qualidade independente das opções.
- `router`, `zustand`, `tailwind`, `lighthouse`, `playwright` e `git`: mudanças condicionais.
- `readme`: documentação baseada apenas nas capacidades habilitadas.

## Decisões

- CommonJS permanece apenas na implementação da CLI para compatibilidade direta com Node; projetos gerados são ESM.
- Sem dependências de runtime na CLI: filesystem, processos e testes usam APIs nativas.
- ESLint cuida de qualidade; Prettier cuida de estilo, sem executar Prettier como regra ESLint.
- A CLI fixa ESLint e `@eslint/js` em `^9.39.5`. Em agosto de 2026, `eslint-plugin-jsx-a11y@6.10.2` ainda não declara compatibilidade com ESLint 10; não há bypass de peer dependencies.
- React Router 8 usa o pacote `react-router`, conforme a documentação para novas aplicações.
- Lighthouse trabalha sobre `dist`; Playwright usa `vite preview` em `127.0.0.1:4173`.

# Release

## Pré-requisitos

- branch `main` atualizada e worktree limpo;
- CI verde em todas as versões suportadas de Node;
- acesso de mantenedor ao npm e ao repositório GitHub;
- versão alvo ainda ausente no registry.

## Gates locais

```bash
npm view create-base-vite version
npm ci
npm run check
npm run test:smoke
npm run test:release
npm audit
npm pack --dry-run
npm pack
```

Inspecione o tarball: somente `bin/`, `src/`, metadados, licença, README e changelog devem estar presentes. Classifique achados de auditoria; não use `npm audit fix --force` automaticamente.

### Auditoria conhecida de projetos com Lighthouse

Em 26 de agosto de 2026, `@lhci/cli` traz dez avisos transitivos (dois baixos, um moderado e sete altos), principalmente por `tmp`, `uuid` e a cadeia Lighthouse/Puppeteer/`extract-zip`. O próprio pacote `create-base-vite` não tem vulnerabilidades. O npm não oferece correção compatível para a versão atual do LHCI (a sugestão é um downgrade major para `0.1.0`), então não aplique `--force`; reavalie a cadeia antes de cada release. Esses pacotes são dependências de desenvolvimento da opção `--lighthouse`, mas os avisos de path traversal ainda importam em ambientes que processam entradas não confiáveis.

## Versão e integração

Mova as notas de `Unreleased` para `2.0.0`, integre a branch por fast-forward ou pull request sem force push e, na `main` limpa, execute:

```bash
npm version 2.0.0 -m "chore(release): v%s"
git push origin main
```

Não mova uma tag existente. Confirme que manifesto, lockfile, changelog, commit e tag concordam.

## Publicação

Prefira Trusted Publishing por GitHub Actions com OIDC e provenance quando estiver configurado. Caso a conta use publicação local:

```bash
npm whoami
npm view create-base-vite@2.0.0 version
npm publish --access public
```

Nunca registre tokens em comandos ou arquivos. Depois da publicação, valide em um diretório temporário:

```bash
npm view create-base-vite@2.0.0 version
npx --yes create-base-vite@2.0.0 smoke-release --full
cd smoke-release
npx playwright install chromium
npm run check
```

Por fim, envie a tag e crie a release com notas derivadas do changelog:

```bash
git push origin v2.0.0
gh release create v2.0.0 --title "create-base-vite v2.0.0" --notes-file CHANGELOG.md
```

Não publique, altere ou deprecie o pacote separado `react-vite-clean-cli` como parte desta release.

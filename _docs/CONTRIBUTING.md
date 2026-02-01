# Contributing

Obrigado por contribuir com o SmartWriter Analyzer! Este documento explica como trabalhar com este repositório, como contribuir e como usar as automações.

## Como rodar localmente

- Instalar dependências: `npm ci`
- Format: `npm run format`
- Lint: `npm run lint`
- Testes: `npm test`
- Build: `npm run build`

## Formatação e lint

- Usamos `Prettier` para formatação e `ESLint` para linting.
- Há um pre-commit hook (Husky + lint-staged) que executa `prettier --write` e `eslint --fix` nos arquivos alterados.

## Branch protection

Há um workflow (`.github/workflows/branch-protection.yml`) que aplica proteção à branch `main` — ele precisa de um token com permissões de administração do repositório.

- Crie um secret `ADMIN_TOKEN` nas configurações do repositório (Settings → Secrets → Actions) com um PAT que contenha `repo` e `admin:repo_hook`.
- Vá para Actions → Branch Protection → Run workflow (workflow_dispatch) e rode-o para aplicar proteção. A proteção aplicada exige checagens de status (CI) e revisão aprovada antes do merge.

## Dependabot

- Dependabot está configurado (`.github/dependabot.yml`) para verificar atualizações npm semanalmente.
- Atualizações major de `typescript` estão ignoradas para evitar breaking changes automáticos.

## Releases

- Releases são automatizadas via workflow `release.yml` quando um tag `v*` é enviado. Ele cria a Release e anexa os artefatos `main.js` e `manifest.json`.
- Também existe o script helper `release.sh` para formas manuais.

## CI

- Workflow `CI` executa em push/PR contra `main` e roda `lint`, `build` e `test` com cobertura; o relatório de cobertura é enviado como artifact.

## Etiqueta de PR

- Faça PRs contra `main` e aguarde checks do CI e aprovação de revisores.

Obrigado! 🎉

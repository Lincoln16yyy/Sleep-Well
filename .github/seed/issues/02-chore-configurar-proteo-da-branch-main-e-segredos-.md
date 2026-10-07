---
title: chore: Configurar proteção da branch main e segredos do repositório
labels: tipo:infra,area:devops,agente:humano,prio:p0,mvp
milestone: M0 - Fundação
---
## Contexto
Todo código deve entrar por PR com CI verde. Configurações do repositório só o dono faz.

## Tarefas
- [ ] Settings > Branches: proteger `main` (exigir PR, exigir check do CI, bloquear force push)
- [ ] Instalar o GitHub App do Claude no repositório (opcional, para usar `@claude`)
- [ ] Settings > Secrets: criar `ANTHROPIC_API_KEY` (opcional)
- [ ] Ativar Dependabot alerts e secret scanning

## Critérios de aceite
- [ ] `main` protegida
- [ ] Segredo criado (se for usar `@claude`)
- [ ] Secret scanning ativo

## Fora do escopo
Não colocar nenhuma chave dentro do código.

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

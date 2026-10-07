---
title: chore: Criar estrutura base do monorepo (backend/ e frontend/)
labels: tipo:chore,area:devops,agente:ok,prio:p0,mvp
milestone: M0 - Fundação
---
## Contexto
O repositório precisa das pastas `backend/` e `frontend/` e de um README explicando como rodar. A estrutura está descrita no AGENTS.md.

## Tarefas
- [ ] Criar `backend/.gitkeep` e `frontend/.gitkeep`
- [ ] Criar `README.md` raiz com visão geral, stack e como rodar (placeholder para comandos futuros)
- [ ] Criar `.env.example` na raiz com variáveis do banco (sem valores reais)

## Critérios de aceite
- [ ] Pastas existem
- [ ] README descreve o projeto e aponta para PLANO.md e AGENTS.md
- [ ] `.env.example` presente e `.env` ignorado pelo Git

## Fora do escopo
Não inicializar Spring Boot nem React aqui.

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

---
title: docs: Criar diagrama ER e documentar o modelo de dados
labels: tipo:docs,area:db,agente:ok,prio:p1,mvp
milestone: M0 - Fundação
---
## Contexto
O modelo de dados v1 está em PLANO.md seção 5. Falta um diagrama visual para facilitar o entendimento.

## Tarefas
- [ ] Criar `docs/modelo-de-dados.md` com diagrama Mermaid (erDiagram) de users, sleep_logs e sleep_goals
- [ ] Incluir tipos, chaves, constraints e índices

## Critérios de aceite
- [ ] Diagrama Mermaid renderiza no GitHub
- [ ] Consistente com PLANO.md seção 5

## Fora do escopo
Não criar migrações ainda.

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

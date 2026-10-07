---
title: feat(backend): Registrar noite de sono (POST /api/sleep-logs)
labels: tipo:feat,area:backend,agente:ok,prio:p0,mvp
milestone: M2 - Registro de sono (API)
---
## Contexto
Funcionalidade central do produto.

## Tarefas
- [ ] Entidade, DTOs, serviço e controller
- [ ] Validar fim > início, duração máxima de 24h, qualidade 1-5
- [ ] Associar sempre ao usuário autenticado (nunca aceitar user_id no corpo)

## Critérios de aceite
- [ ] Criação válida retorna 201
- [ ] Dados inválidos retornam 400 com campos
- [ ] Teste garante que o log pertence ao usuário do token

## Fora do escopo
Sem edição/exclusão aqui.

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

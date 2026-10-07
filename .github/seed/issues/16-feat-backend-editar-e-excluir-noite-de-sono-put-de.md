---
title: feat(backend): Editar e excluir noite de sono (PUT/DELETE /api/sleep-logs/{id})
labels: tipo:feat,area:backend,agente:revisar,prio:p0,mvp
milestone: M2 - Registro de sono (API)
---
## Contexto
Aqui o risco é acesso indevido: só o dono pode alterar.

## Tarefas
- [ ] PUT com as mesmas validações do POST
- [ ] DELETE retorna 204
- [ ] Recurso de outro usuário retorna 404 (não 403, para não vazar existência)

## Critérios de aceite
- [ ] Dono edita e exclui
- [ ] Outro usuário recebe 404 (teste)
- [ ] `updated_at` atualiza na edição

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

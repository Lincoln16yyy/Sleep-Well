---
title: feat(backend): Listar noites de sono com paginação e filtro (GET /api/sleep-logs)
labels: tipo:feat,area:backend,agente:ok,prio:p0,mvp
milestone: M2 - Registro de sono (API)
---
## Contexto
Histórico do usuário.

## Tarefas
- [ ] Parâmetros `from`, `to`, `page`, `size` (máx. 100)
- [ ] Ordenar por `sleep_start` decrescente
- [ ] Retornar só registros do usuário autenticado

## Critérios de aceite
- [ ] Paginação e filtro funcionam
- [ ] Usuário A nunca vê dados do usuário B (teste)

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

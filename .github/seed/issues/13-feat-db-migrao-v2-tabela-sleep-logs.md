---
title: feat(db): Migração V2 (tabela sleep_logs)
labels: tipo:feat,area:db,agente:ok,prio:p0,mvp
milestone: M2 - Registro de sono (API)
---
## Contexto
Estrutura em PLANO.md seção 5.

## Tarefas
- [ ] Criar `V2__create_sleep_logs.sql` com FK para users (ON DELETE CASCADE)
- [ ] CHECK `sleep_end > sleep_start` e `quality BETWEEN 1 AND 5`
- [ ] Índice `(user_id, sleep_start DESC)`

## Critérios de aceite
- [ ] Migração aplica em banco limpo e sobre V1
- [ ] Constraints rejeitam dados inválidos (teste)

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

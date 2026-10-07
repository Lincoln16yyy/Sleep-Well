---
title: feat(db+backend): Metas de sono (migração V3, GET/PUT /api/goal)
labels: tipo:feat,area:backend,area:db,agente:ok,prio:p1,mvp
milestone: M4 - Estatísticas e metas
---
## Contexto
Meta de horas e horário-alvo de dormir/acordar.

## Tarefas
- [ ] `V3__create_sleep_goals.sql`
- [ ] GET devolve a meta (ou padrão de 8h)
- [ ] PUT valida limites razoáveis (ex.: 4h a 12h)

## Critérios de aceite
- [ ] Meta salva e lida por usuário
- [ ] Validações testadas

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

---
title: feat(backend): Estatísticas de sono (GET /api/stats/summary)
labels: tipo:feat,area:backend,agente:revisar,prio:p0,mvp
milestone: M4 - Estatísticas e metas
---
## Contexto
Definições exatas das métricas em PLANO.md seção 5.

## Tarefas
- [ ] Parâmetro `days` (7 ou 30)
- [ ] Calcular média de horas, consistência (desvio padrão do horário de dormir) e dívida de sono
- [ ] Respeitar o timezone do usuário ao agrupar por dia
- [ ] Retornar também série diária para o gráfico

## Critérios de aceite
- [ ] Testes unitários com casos conhecidos (inclusive sem dados e virada de dia)
- [ ] Resposta documentada no OpenAPI

## Fora do escopo
Sem recomendações médicas.

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

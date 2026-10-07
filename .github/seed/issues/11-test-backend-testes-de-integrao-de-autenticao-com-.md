---
title: test(backend): Testes de integração de autenticação com Testcontainers
labels: tipo:test,area:backend,agente:ok,prio:p1,mvp
milestone: M1 - Back-end base e autenticação
---
## Contexto
Garantir que o fluxo de auth é testado contra um PostgreSQL real.

## Tarefas
- [ ] Configurar Testcontainers com PostgreSQL
- [ ] Cobrir fluxo completo: cadastro, login, acesso a /api/me, acesso negado

## Critérios de aceite
- [ ] Testes rodam no CI sem configuração extra
- [ ] Fluxo completo coberto

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

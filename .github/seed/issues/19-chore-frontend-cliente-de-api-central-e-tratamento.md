---
title: chore(frontend): Cliente de API central e tratamento de erros
labels: tipo:chore,area:frontend,agente:ok,prio:p0,mvp
milestone: M3 - Front-end MVP
---
## Contexto
Todas as chamadas HTTP passam por um único módulo.

## Tarefas
- [ ] Criar `src/api/client.js` com base URL por variável (`VITE_API_URL`)
- [ ] Anexar token JWT automaticamente
- [ ] Em 401, limpar sessão e redirecionar para login
- [ ] Converter `ProblemDetail` em mensagens amigáveis

## Critérios de aceite
- [ ] Nenhum `fetch` direto nos componentes
- [ ] Teste unitário do cliente

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

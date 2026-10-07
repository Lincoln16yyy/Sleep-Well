---
title: feat(backend): Tratamento global de erros (ProblemDetail) e OpenAPI/Swagger
labels: tipo:feat,area:backend,agente:ok,prio:p1,mvp
milestone: M1 - Back-end base e autenticação
---
## Contexto
Padronizar erros e documentar a API automaticamente.

## Tarefas
- [ ] `@RestControllerAdvice` retornando `ProblemDetail` para validação, 404, 401/403 e erros inesperados (sem stacktrace)
- [ ] Adicionar springdoc-openapi e expor `/swagger-ui.html` (apenas em perfil dev)

## Critérios de aceite
- [ ] Erros de validação listam campos inválidos
- [ ] Swagger acessível em dev e desativado em produção

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

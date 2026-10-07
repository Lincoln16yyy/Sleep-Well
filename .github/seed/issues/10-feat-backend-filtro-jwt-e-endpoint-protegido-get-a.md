---
title: feat(backend): Filtro JWT e endpoint protegido GET /api/me
labels: tipo:feat,area:backend,agente:revisar,prio:p0,mvp
milestone: M1 - Back-end base e autenticação
---
## Contexto
Todas as rotas (exceto /api/auth/** e health) exigem token válido.

## Tarefas
- [ ] Filtro que lê `Authorization: Bearer`
- [ ] Configurar Spring Security: rotas públicas e protegidas
- [ ] `GET /api/me` retorna id, e-mail, nome e timezone
- [ ] CORS configurável por variável de ambiente

## Critérios de aceite
- [ ] Sem token retorna 401
- [ ] Token válido retorna os dados do usuário
- [ ] Token adulterado ou expirado retorna 401

## Dependências
Depende do login JWT.

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

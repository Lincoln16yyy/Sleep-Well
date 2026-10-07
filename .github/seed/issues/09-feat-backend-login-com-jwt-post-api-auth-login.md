---
title: feat(backend): Login com JWT (POST /api/auth/login)
labels: tipo:feat,area:backend,agente:revisar,prio:p0,mvp
milestone: M1 - Back-end base e autenticação
---
## Contexto
Autenticação stateless com JWT de curta duração.

## Tarefas
- [ ] Validar credenciais e gerar JWT (expiração configurável, padrão 1h)
- [ ] Segredo do JWT por variável de ambiente (`JWT_SECRET`), nunca em código
- [ ] Credenciais inválidas retornam 401 genérico (não revelar se o e-mail existe)

## Critérios de aceite
- [ ] Login correto retorna token
- [ ] Login errado retorna 401 sem detalhes
- [ ] Teste de expiração e assinatura

## Fora do escopo
Refresh token fica fora do MVP.

## Dependências
Depende do cadastro de usuário.

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

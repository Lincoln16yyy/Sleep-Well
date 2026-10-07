---
title: feat(backend): Cadastro de usuário (POST /api/auth/register)
labels: tipo:feat,area:backend,agente:revisar,prio:p0,mvp
milestone: M1 - Back-end base e autenticação
---
## Contexto
Primeira funcionalidade de negócio. Segurança importa: senhas só com BCrypt.

## Tarefas
- [ ] Entidade `User`, repositório, serviço e controller
- [ ] DTO de entrada com validação (e-mail válido, senha mínima de 8 caracteres, nome obrigatório)
- [ ] Hash BCrypt; nunca retornar nem logar a senha
- [ ] Retornar 201 com id e e-mail; 409 se e-mail já existir (ProblemDetail)

## Critérios de aceite
- [ ] Cadastro válido retorna 201
- [ ] E-mail duplicado retorna 409
- [ ] Senha nunca aparece em resposta ou log
- [ ] Testes cobrem os 3 cenários

## Fora do escopo
Sem login/JWT aqui.

## Dependências
Depende da issue de migração V1.

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

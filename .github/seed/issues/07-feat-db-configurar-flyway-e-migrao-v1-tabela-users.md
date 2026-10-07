---
title: feat(db): Configurar Flyway e migração V1 (tabela users)
labels: tipo:feat,area:db,agente:ok,prio:p0,mvp
milestone: M1 - Back-end base e autenticação
---
## Contexto
Todo schema muda via migração Flyway. Estrutura da tabela em PLANO.md seção 5.

## Tarefas
- [ ] Criar `V1__create_users.sql` com `users` (id uuid, email único, password_hash, display_name, timezone padrão 'America/Sao_Paulo', created_at)
- [ ] Índice único case-insensitive em e-mail
- [ ] Teste que valida que a migração roda em banco limpo

## Critérios de aceite
- [ ] Migração aplica sem erro
- [ ] Constraint de e-mail único funcionando

## Fora do escopo
Não criar a entidade/rotas ainda.

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

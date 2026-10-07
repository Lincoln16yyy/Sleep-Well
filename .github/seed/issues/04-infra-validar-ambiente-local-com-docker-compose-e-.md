---
title: infra: Validar ambiente local com Docker Compose e PostgreSQL
labels: tipo:infra,area:devops,agente:ok,prio:p0,mvp
milestone: M0 - Fundação
---
## Contexto
Já existe um `docker-compose.yml` com PostgreSQL 16. Precisamos garantir que sobe e documentar como conectar.

## Tarefas
- [ ] Rodar `docker compose up -d` e confirmar que o banco sobe
- [ ] Documentar no README: comando, porta, usuário e banco (apenas de desenvolvimento)
- [ ] Adicionar comando para derrubar e resetar o banco local

## Critérios de aceite
- [ ] Banco sobe com um comando
- [ ] README documenta uso e reset
- [ ] Nenhuma senha de produção em arquivo

## Fora do escopo
Não configurar o banco de produção.

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

---
title: infra: Dockerfiles do back-end e do front-end
labels: tipo:infra,area:devops,agente:ok,prio:p1,mvp
milestone: M5 - Deploy e qualidade
---
## Contexto
Empacotar para deploy.

## Tarefas
- [ ] Dockerfile multi-stage do back-end (JRE 21)
- [ ] Build do front-end estático (servido por Nginx ou plataforma estática)
- [ ] Atualizar README com comandos de build

## Critérios de aceite
- [ ] Imagens constroem localmente
- [ ] Container do back-end sobe com variáveis de ambiente

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

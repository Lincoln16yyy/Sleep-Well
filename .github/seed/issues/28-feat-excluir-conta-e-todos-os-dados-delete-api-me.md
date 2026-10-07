---
title: feat: Excluir conta e todos os dados (DELETE /api/me)
labels: tipo:feat,area:backend,area:frontend,agente:revisar,prio:p0,mvp
milestone: M5 - Deploy e qualidade
---
## Contexto
Dados de sono são pessoais; o usuário deve poder sair levando tudo embora.

## Tarefas
- [ ] Endpoint que remove usuário e dados relacionados (cascade)
- [ ] Botão em Configurações com confirmação forte
- [ ] Teste garantindo que nada fica no banco

## Critérios de aceite
- [ ] Conta e dados apagados
- [ ] Token antigo deixa de funcionar

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

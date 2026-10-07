---
title: feat(backend): Inicializar projeto Spring Boot 3 (Java 21, Maven)
labels: tipo:feat,area:backend,agente:ok,prio:p0,mvp
milestone: M1 - Back-end base e autenticação
---
## Contexto
Base do back-end. Pacotes por funcionalidade: `auth`, `sleep`, `stats`, `common`.

## Tarefas
- [ ] Gerar projeto em `backend/` com Spring Web, Validation, Data JPA, PostgreSQL Driver, Actuator, Flyway, Spring Security
- [ ] Java 21, Maven, pacote base `br.dev.<nome>` (definir com o dono se não houver)
- [ ] Configurar `application.yml` lendo conexão do banco por variáveis de ambiente
- [ ] Endpoint `GET /actuator/health` funcionando
- [ ] Adicionar um teste de contexto (`@SpringBootTest`)

## Critérios de aceite
- [ ] `mvn -B verify` passa
- [ ] Aplicação sobe conectada ao PostgreSQL do Docker Compose
- [ ] Nenhum segredo no repositório

## Fora do escopo
Sem autenticação nem regras de negócio nesta issue.

---
Antes de começar, leia `AGENTS.md` e `PLANO.md`. Abra o PR com `Closes #<número desta issue>`.

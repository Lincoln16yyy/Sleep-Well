# Noite Boa

App web para **registrar o sono, entender o padrão e criar consistência de horários**. Projeto autoral de Lincoln, inspirado na ideia do projeto integrador "Meu Soninho" (IFPI Picos), com código, nome e identidade próprios.

- Plano completo: [`PLANO.md`](PLANO.md)
- Como agentes de IA devem trabalhar: [`AGENTS.md`](AGENTS.md)
- Decisões técnicas: [`docs/`](docs/)

**Stack:** Java 21 + Spring Boot 3 + PostgreSQL (back-end) · React + Vite (front-end) · GitHub Actions (CI).

## Começando (passo a passo do kit)

1. **Crie o repositório** no GitHub (vazio) e envie este kit:
   ```bash
   git init && git add . && git commit -m "chore: kit inicial do projeto"
   git branch -M main
   git remote add origin git@github.com:SEU-USUARIO/NOME-DO-REPO.git
   git push -u origin main
   ```
2. **Crie labels, milestones e as 38 issues** (precisa do [GitHub CLI](https://cli.github.com)):
   ```bash
   gh auth login
   scripts/seed-github.sh --dry-run   # confira o que será criado
   scripts/seed-github.sh             # cria de verdade
   ```
3. **Faça as issues `agente:humano` do M0**: nome/identidade e proteção da `main`.
4. **(Opcional) Ative o `@claude`** nas issues e PRs:
   - Instale o GitHub App do Claude no repositório e crie o segredo `ANTHROPIC_API_KEY` (a forma mais fácil é rodar `/install-github-app` dentro do Claude Code).
   - Comente `@claude implemente esta issue seguindo o AGENTS.md` em uma issue `agente:ok`.
   - Isso consome créditos da API e minutos do GitHub Actions; acompanhe os custos.
5. **Crie um quadro (GitHub Projects)**, opcional: aba *Projects* > *New project* > Board, e adicione as issues. Colunas sugeridas: Backlog, Pronto para fazer, Em andamento, Em revisão, Feito.
6. **Trabalhe em ordem**: M0 → M1 → M2 ... Só avance quando o critério "Pronto quando" do milestone (PLANO.md, seção 7) for cumprido.

## O que cada label significa

| Label | Uso |
|---|---|
| `agente:ok` | Agente de IA pode executar sozinho |
| `agente:revisar` | Agente pode fazer, mas você revisa com atenção (segurança/dados) |
| `agente:humano` | Só você (configurações, segredos, decisões) |
| `tipo:*`, `area:*`, `prio:*` | Organização |
| `mvp` / `pos-mvp` | Fase |

## Estrutura

```
backend/    Java 21 + Spring Boot 3 (API REST)        -> criado na issue #6
frontend/   React + Vite (PWA)                        -> criado na issue #18
docs/       ADRs, identidade visual e documentação
scripts/    Scripts de setup do repositório
```

## Rodando localmente

### Banco de dados (PostgreSQL 16 via Docker)

```bash
cp .env.example .env   # variáveis de ambiente (sem segredos reais)
docker compose up -d   # sobe o PostgreSQL
```

**Conexão local:** `localhost:5432` · usuário `sono` · banco `sono` · senha `sono_dev_only` (somente desenvolvimento).

```bash
docker compose ps      # ver status
docker compose logs db # ver logs
docker compose down    # derrubar
docker compose down -v # derrubar e apagar os dados (reset)
```

### Back-end

```bash
cd backend
mvn spring-boot:run   # sobe a API em http://localhost:8080 (precisa do Postgres rodando)
mvn -B verify          # compila e roda os testes
```

Health check: `GET http://localhost:8080/actuator/health`

### Front-end

> Será preenchido quando o front-end for inicializado (issue #18).

## Licença
MIT. Veja [`LICENSE`](LICENSE).

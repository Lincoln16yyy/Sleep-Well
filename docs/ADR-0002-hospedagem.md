# ADR-0002: Hospedagem e deploy (custo inicial R$ 0)

- **Status:** aceita (revisável)
- **Data:** 2026-10-09
- **Issue:** #33

## Contexto

O MVP precisa ficar público com **custo inicial de R$ 0/mês**: back-end Java/Spring
Boot, PostgreSQL e front-end React. O front-end já está publicado na Vercel e o banco
já foi criado no Neon (planos gratuitos); falta publicar o back-end e amarrar as peças
com variáveis de ambiente. Planos gratuitos mudam com frequência — os números abaixo
foram consultados nas páginas oficiais em **09/10/2026** e servem para a decisão da
época, não como contrato.

## Decisão

- **Back-end:** Render — web service em plano `free` buildado do `backend/Dockerfile`
  (multi-stage Maven → JRE 21), health check em `/actuator/health`, deploy automático
  só quando a CI do GitHub passar (`autoDeployTrigger: checksPass`). A configuração
  inteira vive no `render.yaml` na raiz do repositório.
- **Banco:** Neon free (já provisionado) — PostgreSQL serverless acessado por
  `SPRING_DATASOURCE_URL=jdbc:postgresql://<host>/<banco>?sslmode=require` +
  usuário/senha via `SPRING_DATASOURCE_USERNAME`/`SPRING_DATASOURCE_PASSWORD`.
  Nenhuma credencial no código ou no Git.
- **Front-end:** Vercel (já publicado) — variável de build `VITE_API_URL` apontando
  para a API na Render (o Vite embute a URL no build; não há como trocar em runtime).

## Alternativas consideradas

### Back-end

| Opção | Análise |
|---|---|
| **Render (escolhida)** | Web service `free` real (512 MB / 0.1 CPU), Docker nativo, health check, blueprints (`render.yaml`), sem cartão de crédito. 750 horas de instância/mês por workspace. |
| Railway | Cobrança por uso com crédito de trial; **não há plano free permanente** — quebraria a regra de custo zero. |
| VPS auto-hospedado (Oracle Cloud / AWS Free Tier) | Custo zero possível, mas exige sysadmin (SSH, TLS, systemd, backups) e cartão; risco e tempo desnecessários para o MVP. |

### Banco

| Opção | Análise |
|---|---|
| **Neon (escolhido, já provisionado)** | Free sem prazo de validade: scale-to-zero após 5 min de inatividade, 0,5 GB de storage e 100 CU-horas/mês por projeto, 10 branches. HTTPS/SSL obrigatório (`sslmode=require`). |
| Supabase | Free entrega auth/storage que **não usamos** (temos auth própria com JWT), limita a ~2 projetos ativos e pausa projetos inativos. |
| Render Postgres (free) | 1 GB, mas **expira em 30 dias** (+14 dias de carência) segundo a documentação da Render de 2026 — e amarra o dado à mesma plataforma do back-end. |

### Front-end

| Opção | Análise |
|---|---|
| **Vercel (escolhido, já publicado)** | Hobby R$ 0, deploy automático em PR, integração já configurada com preview. |
| Netlify / Cloudflare Pages | Equivalentes; migrar hoje não traz ganho e só gera retrabalho. |

## Consequências

- **Free na Render dorme:** 15 min sem tráfego → desliga; a próxima requisição leva
  ~1 minuto para subir (cold start). Aceitável para MVP; o plano pago remove isso.
- **750 horas de instância/mês** por workspace; serviço parado não consome horas —
  se esgotarem, os serviços free ficam suspensos até o mês seguinte.
- **Neon scale-to-zero:** primeira consulta após inatividade paga alguns centenas de
  ms; o pool Hikari (`DB_POOL_SIZE`, padrão 5) mantém conexões quentes entre requisições.
- **Filesystem efêmero** na Render: nada é gravado no disco do serviço — todo
  persistência (Flyway + dados) vive no Neon.
- **CORS de origem única** (`SecurityConfig` lê `CORS_ALLOWED_ORIGIN`): vale um
  front-end de produção por vez; se um dia houver domínio custom + previews com API,
  generalizar para lista de origens.
- **Migrações na subida do serviço:** `spring.flyway.enabled=true` aplica V1..V4
  automaticamente no boot (apenas `CREATE`/`ALTER ADD COLUMN` — nada destrutivo).
  Com 1 instância free não há corrida entre instâncias; se um dia houver múltiplas,
  mover migração para `preDeployCommand`.
- **`JWT_SECRET` obrigatória no perfil `prod`:** sem a variável, o startup falha
  (`application-prod.yml`) em vez de assinar tokens com o segredo de desenvolvimento.
- **Workflow de deploy contínuo** (ex.: GitHub Actions → Render) é uma issue
  separada, como manda a #33 — este PR só prepara o terreno.

## Referências consultadas (09/10/2026)

- Render: `render.com/docs/free`, `render.com/docs/blueprint-spec`, `render.com/pricing`
- Neon: `neon.com/faqs/free-plan-limits-and-quotas`, `neon.com/docs/introduction/plans`

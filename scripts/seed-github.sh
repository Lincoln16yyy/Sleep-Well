#!/usr/bin/env bash
# Cria labels, milestones e issues iniciais no repositório do GitHub.
# Requisitos: GitHub CLI (gh) autenticado (`gh auth login`).
# Uso:
#   scripts/seed-github.sh --dry-run          # só mostra o que faria (não precisa de gh)
#   scripts/seed-github.sh                    # usa o repositório da pasta atual
#   scripts/seed-github.sh dono/repositorio   # informa o repositório
# É seguro rodar mais de uma vez: labels são atualizadas e issues/milestones existentes são puladas.
set -euo pipefail

DRY=0
if [[ "${1:-}" == "--dry-run" ]]; then DRY=1; shift; fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SEED="$ROOT/.github/seed/issues"

if [[ $DRY -eq 0 ]]; then
  command -v gh >/dev/null || { echo "Instale o GitHub CLI: https://cli.github.com"; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "Faça login primeiro: gh auth login"; exit 1; }
  REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
else
  REPO="${1:-DONO/REPOSITORIO}"
fi
echo "Repositório: $REPO  (dry-run=$DRY)"

run() { if [[ $DRY -eq 1 ]]; then echo "[dry-run] $*"; else "$@"; fi; }

echo "==> Labels"
label() { run gh label create "$1" --color "$2" --description "$3" --force --repo "$REPO"; }
label "tipo:feat"    "1d76db" "Nova funcionalidade"
label "tipo:bug"     "d73a4a" "Algo não funciona"
label "tipo:chore"   "c5def5" "Manutenção e organização"
label "tipo:docs"    "0075ca" "Documentação"
label "tipo:test"    "bfd4f2" "Testes"
label "tipo:infra"   "5319e7" "Infraestrutura, CI e deploy"
label "tipo:spike"   "d4c5f9" "Investigação com prazo curto"
label "area:backend"  "0e8a16" "API Java/Spring"
label "area:frontend" "fbca04" "React/Vite"
label "area:db"       "bfdadc" "Banco de dados e migrações"
label "area:devops"   "ededed" "CI/CD, Docker, repositório"
label "area:design"   "f9d0c4" "Identidade visual e UX"
label "prio:p0" "b60205" "Bloqueia o avanço"
label "prio:p1" "d93f0b" "Importante"
label "prio:p2" "fef2c0" "Pode esperar"
label "agente:ok"      "2ea44f" "Seguro para agente de IA executar sozinho"
label "agente:revisar" "e4e669" "Agente pode fazer, exige revisão humana atenta"
label "agente:humano"  "b60205" "Somente humano (decisão, segredo ou configuração)"
label "mvp"     "5319e7" "Necessário para o MVP"
label "pos-mvp" "cccccc" "Depois do MVP"

echo "==> Milestones"
existing_ms=""
if [[ $DRY -eq 0 ]]; then
  existing_ms="$(gh api "repos/$REPO/milestones?state=all&per_page=100" --jq '.[].title')"
fi
milestone() {
  if grep -qxF "$1" <<<"$existing_ms"; then echo "já existe: $1"; else
    run gh api "repos/$REPO/milestones" --silent -f title="$1" -f description="$2"
  fi
}
milestone "M0 - Fundação" "Repo, estrutura, CI e ambiente local"
milestone "M1 - Back-end base e autenticação" "Cadastro, login e /api/me com testes"
milestone "M2 - Registro de sono (API)" "CRUD de sleep-logs testado"
milestone "M3 - Front-end MVP" "Telas principais funcionando"
milestone "M4 - Estatísticas e metas" "Dashboard e metas"
milestone "M5 - Deploy e qualidade" "App público, docs e exclusão de conta"
milestone "M6 - Pós-MVP" "Evolução depois do lançamento"

echo "==> Issues"
existing_titles=""
if [[ $DRY -eq 0 ]]; then
  existing_titles="$(gh issue list --repo "$REPO" --state all --limit 1000 --json title --jq '.[].title')"
fi
tmp="$(mktemp)"; trap 'rm -f "$tmp"' EXIT
count=0
for f in "$SEED"/*.md; do
  head5="$(head -5 "$f")"
  title="$(sed -n 's/^title: //p' <<<"$head5" | head -1)"
  labels="$(sed -n 's/^labels: //p' <<<"$head5" | head -1)"
  milestone="$(sed -n 's/^milestone: //p' <<<"$head5" | head -1)"
  if grep -qxF "$title" <<<"$existing_titles"; then echo "já existe: $title"; continue; fi
  awk 'BEGIN{c=0} /^---$/ && c<2 {c++; next} c>=2' "$f" > "$tmp"
  args=()
  IFS=',' read -ra L <<<"$labels"
  for l in "${L[@]}"; do args+=(--label "$l"); done
  run gh issue create --repo "$REPO" --title "$title" --body-file "$tmp" --milestone "$milestone" "${args[@]}"
  count=$((count+1))
  [[ $DRY -eq 0 ]] && sleep 1
done
echo "Pronto. Issues criadas: $count"

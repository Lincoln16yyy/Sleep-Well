// Montagem dos dados do dashboard a partir do GET /api/stats/summary.
// O back-end agrupa por dia local do usuário; aqui usamos a data local do
// navegador para completar os dias sem registro com 0 h.

const pad = (n) => String(n).padStart(2, '0');

export function toIsoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Série contínua de `days` dias terminando hoje, com as horas vindo do resumo.
 * Dias sem registro entram com 0 h (para o gráfico de barras não furar).
 */
export function buildDailySeries(summary, days, today = new Date()) {
  const byDate = new Map((summary?.daily ?? []).map((day) => [day.date, day.hoursSlept]));
  const series = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const key = toIsoDate(date);
    series.push({
      date: key,
      label: `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`,
      hours: byDate.get(key) ?? 0,
      hasData: byDate.has(key),
    });
  }
  return series;
}

/** 7.42 → "7h25" */
export function formatHours(value) {
  const totalMinutes = Math.round((Number(value) || 0) * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours}h${pad(minutes)}` : `${hours}h`;
}

/** 210 → "3h30" */
export function formatMinutes(minutes) {
  const total = Math.max(0, Math.round(Number(minutes) || 0));
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest ? `${hours}h${pad(rest)}` : `${hours}h`;
}

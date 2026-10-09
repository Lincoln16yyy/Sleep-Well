// Regras de tela para registrar uma noite de sono.
// Espelham as validações do back-end (SleepService/CreateSleepLogRequest):
// início e fim obrigatórios, fim > início, duração máxima de 24h,
// qualidade 1-5 e observação de no máximo 2000 caracteres.

const pad = (n) => String(n).padStart(2, '0');

/** Converte Date (ou ISO vindo da API) para o formato dos inputs datetime-local. */
export function toLocalInput(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function at(date, hours, minutes = 0) {
  const d = new Date(date.getTime());
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/**
 * Padrões inteligentes: dormiu ontem às 23:00 e acordou hoje às 07:00.
 * Se a pessoa está registrando de madrugada (antes das 07:00), o fim vira "agora".
 */
export function smartDefaults(now = new Date()) {
  const start = at(now, 23);
  start.setDate(start.getDate() - 1);

  const sevenAm = at(now, 7);
  const end = now.getTime() < sevenAm.getTime() ? new Date(now.getTime()) : sevenAm;

  return { sleepStart: toLocalInput(start), sleepEnd: toLocalInput(end) };
}

export function validateSleepForm({ sleepStart, sleepEnd, quality, notes }) {
  if (!sleepStart || !sleepEnd) return 'Preencha os horários de dormir e de acordar.';
  const start = new Date(sleepStart);
  const end = new Date(sleepEnd);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Horário inválido.';
  if (end.getTime() <= start.getTime()) return 'O horário de acordar precisa ser depois de dormir.';
  if (end.getTime() - start.getTime() > 24 * 60 * 60 * 1000) return 'A duração máxima é de 24 horas.';
  if (!quality || quality < 1 || quality > 5) return 'Escolha uma qualidade de 1 a 5.';
  if (notes && notes.length > 2000) return 'A observação pode ter no máximo 2000 caracteres.';
  return '';
}

export function toApiPayload({ sleepStart, sleepEnd, quality, notes }) {
  return {
    sleepStart: new Date(sleepStart).toISOString(),
    sleepEnd: new Date(sleepEnd).toISOString(),
    quality: Number(quality),
    notes: notes || null,
  };
}

export function formatDuration(startIso, endIso) {
  const minutes = Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000);
  const hours = Math.floor(Math.abs(minutes) / 60);
  const rest = Math.abs(minutes) % 60;
  const signal = minutes < 0 ? '-' : '';
  return rest ? `${signal}${hours}h${pad(rest)}m` : `${signal}${hours}h`;
}

const twoDigits = (n) => String(n).padStart(2, '0');

export function formatLocal(iso) {
  const d = new Date(iso);
  return `${twoDigits(d.getDate())}/${twoDigits(d.getMonth() + 1)} ${twoDigits(d.getHours())}h${twoDigits(d.getMinutes())}`;
}

import { api } from '../api/client';

/**
 * Lembrete de hora de dormir (issue #38) — melhor esforço.
 *
 * Limitação honesta (PLANO.md §3): notificação web só é garantida com o app
 * aberto (aba aberta ou instalado). Aqui NÃO prometemos alarme.
 */
const CHAVE = 'noiteboa.lembrete';
let timer = null;

/** Preferência fica neste dispositivo (localStorage), não na conta. */
export function lembreteAtivo() {
  return localStorage.getItem(CHAVE) === '1';
}

export function setLembreteAtivo(ativo) {
  if (ativo) localStorage.setItem(CHAVE, '1');
  else localStorage.removeItem(CHAVE);
}

export function suportaNotificacao() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/** 'default' | 'granted' | 'denied' | 'unsupported' */
export function permissaoNotificacao() {
  return suportaNotificacao() ? window.Notification.permission : 'unsupported';
}

/** ms até a próxima ocorrência de "HH:MM" no relógio local (se já passou, amanhã). */
export function msAte(hora, agora = new Date()) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hora).trim());
  if (!m) return null;
  const alvo = new Date(agora);
  alvo.setHours(Number(m[1]), Number(m[2]), 0, 0);
  if (alvo.getTime() <= agora.getTime()) alvo.setDate(alvo.getDate() + 1);
  return alvo.getTime() - agora.getTime();
}

function notificar(titulo, corpo) {
  const opcoes = { body: corpo, icon: '/icon-192.png', badge: '/icon-192.png' };
  try {
    const notificacao = new window.Notification(titulo, opcoes);
    void notificacao; // construir já dispara o aviso
  } catch {
    // Chrome em Android exige o service worker para notificar
    navigator.serviceWorker?.ready
      ?.then((registration) => registration.showNotification(titulo, opcoes))
      .catch(() => {
        /* melhor esforço: sem notificação, sem quebrar o app */
      });
  }
}

/** Agenda o disparo na próxima ocorrência de `hora` e rearma para o dia seguinte. */
export function agendarLembrete(hora) {
  cancelarLembrete();
  const atraso = msAte(hora);
  if (atraso === null) return false;
  timer = window.setTimeout(() => {
    timer = null;
    notificar('Noite Boa — hora de dormir', `${hora}: seu horário de dormir. Durma melhor, no seu ritmo.`);
    agendarLembrete(hora);
  }, atraso);
  return true;
}

export function cancelarLembrete() {
  if (timer !== null) {
    window.clearTimeout(timer);
    timer = null;
  }
}

/**
 * Liga o lembrete na abertura do app: só se a preferência estiver ativa,
 * a permissão de notificação concedida e a meta tiver horário de dormir.
 */
export async function iniciarLembrete() {
  if (!lembreteAtivo() || permissaoNotificacao() !== 'granted') return false;
  try {
    const goal = await api.get('/goal');
    if (!goal?.bedtime) return false;
    return agendarLembrete(String(goal.bedtime).slice(0, 5));
  } catch {
    return false;
  }
}

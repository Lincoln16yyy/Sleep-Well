import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, clearSession } from '../api/client';

const TIMEZONES =
  typeof Intl.supportedValuesOf === 'function'
    ? Intl.supportedValuesOf('timeZone')
    : ['America/Sao_Paulo', 'America/New_York', 'Europe/Lisbon', 'UTC'];

const fieldStyle = {
  width: '100%',
  minHeight: '48px',
  fontSize: '16px',
  padding: '0.6rem 0.75rem',
  border: '1px solid #C9C6F0',
  borderRadius: '10px',
  background: '#FFFFFF',
  boxSizing: 'border-box',
};

const buttonStyle = {
  minHeight: '48px',
  fontSize: '16px',
  fontWeight: 700,
  borderRadius: '10px',
  border: 'none',
  background: '#15142E',
  color: '#FFE9B5',
  cursor: 'pointer',
  width: '100%',
};

/** "23:00:00" (LocalTime da API) → "23:00" (input type=time) */
const toTimeInput = (value) => (value ? String(value).slice(0, 5) : '');

export default function Configuracoes() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [hours, setHours] = useState('');
  const [bedtime, setBedtime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [meData, goalData] = await Promise.all([api.get('/me'), api.get('/goal')]);
        if (!active) return;
        setMe(meData);
        setHours(String(goalData.targetMinutes / 60));
        setBedtime(toTimeInput(goalData.bedtime));
        setWakeTime(toTimeInput(goalData.wakeTime));
        setTimezone(meData.timezone || 'America/Sao_Paulo');
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const minutes = Math.round(Number(hours) * 60);
    if (!hours || Number.isNaN(minutes) || minutes < 240 || minutes > 720) {
      setError('A meta deve ficar entre 4 e 12 horas por noite.');
      return;
    }

    setSaving(true);
    try {
      let updatedMe = me;
      if (me && timezone !== me.timezone) {
        updatedMe = await api.put('/me', { timezone });
      }
      await api.put('/goal', {
        targetMinutes: minutes,
        bedtime: bedtime || null,
        wakeTime: wakeTime || null,
      });
      setMe(updatedMe);
      setSuccess('Preferências salvas.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  if (loading) return <p>Carregando…</p>;

  return (
    <div style={{ maxWidth: '480px' }}>
      <h1>Configurações</h1>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ fontSize: '18px', fontWeight: 700, marginBottom: '0.6rem' }}>Meta de sono</legend>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            Horas por noite (4 a 12)
            <input
              type="number"
              min={4}
              max={12}
              step={0.5}
              style={fieldStyle}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              Horário de dormir
              <input type="time" style={fieldStyle} value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              Horário de acordar
              <input type="time" style={fieldStyle} value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
            </label>
          </div>
        </fieldset>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          Fuso horário
          <select style={fieldStyle} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" style={buttonStyle} disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar alterações'}
        </button>
      </form>

      {error && (
        <p role="alert" style={{ color: 'var(--color-erro-texto)' }}>
          {error}
        </p>
      )}
      {success && (
        <p role="status" style={{ color: 'var(--color-sucesso-texto)' }}>
          {success}
        </p>
      )}

      <section aria-label="Conta" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '18px' }}>Conta</h2>
        {me && (
          <p style={{ color: '#4B4A6B', marginTop: 0 }}>
            {me.displayName} · {me.email}
          </p>
        )}
        <button
          type="button"
          onClick={handleLogout}
          style={{ ...buttonStyle, background: '#FFFFFF', color: '#15142E', border: '1px solid #C9C6F0' }}
        >
          Sair da conta
        </button>
      </section>
    </div>
  );
}

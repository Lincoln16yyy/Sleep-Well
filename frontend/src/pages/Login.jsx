import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

const formStyle = { display: 'flex', flexDirection: 'column', gap: '0.9rem', maxWidth: '420px' };

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '15px', fontWeight: 700 };

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
  minHeight: '52px',
  fontSize: '17px',
  fontWeight: 700,
  border: 'none',
  borderRadius: '10px',
  background: '#15142E',
  color: '#FFE9B5',
  cursor: 'pointer',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const accountCreated = Boolean(location.state?.created);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.accessToken);
      navigate('/registrar');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      {accountCreated && <p role="status" style={{ color: 'var(--color-sucesso-texto)' }}>Conta criada! Faça login.</p>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          E-mail
          <input
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={fieldStyle}
          />
        </label>
        <label style={labelStyle}>
          Senha
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={fieldStyle}
          />
        </label>
        <button type="submit" style={buttonStyle}>
          Entrar
        </button>
      </form>
      {error && <p role="alert" style={{ color: 'var(--color-erro-texto)' }}>{error}</p>}
      <p>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}

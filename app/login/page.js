'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: 'white',
          padding: 32,
          borderRadius: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          width: 320,
        }}
      >
        <h1 style={{ fontSize: 20, marginBottom: 24 }}>FMA Motoshop</h1>

        <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <label style={{ display: 'block', fontSize: 13, margin: '12px 0 4px' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && (
          <p style={{ color: '#dc2626', fontSize: 13, marginTop: 12 }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  fontSize: 14,
  boxSizing: 'border-box',
};

const buttonStyle = {
  width: '100%',
  marginTop: 20,
  padding: '10px 0',
  borderRadius: 6,
  border: 'none',
  background: '#111827',
  color: 'white',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

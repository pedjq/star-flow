import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError.message);
    } else {
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="bg-glow blue" style={{ top: '10%', right: '20%', width: '500px', height: '500px', opacity: 0.2 }} />
      <div className="bg-glow purple" style={{ bottom: '10%', left: '20%', width: '400px', height: '400px', opacity: 0.15 }} />
      
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.75rem', marginBottom: '48px', letterSpacing: '-0.02em' }}
      >
        <div style={{ background: 'linear-gradient(135deg, #9b2df2, #2b58ff)', color: '#fff', padding: '8px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(155, 45, 242, 0.4)' }}>
          <Sparkles size={20} fill="currentColor" />
        </div>
        <span>Star.<span className="text-accent">Flow</span> Admin</span>
      </motion.div>

      <motion.form 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleLogin} 
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '420px', padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'rgba(10, 10, 14, 0.7)', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', fontWeight: 700 }}>Welcome back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter your details to access your dashboard.</p>
        </div>

        <div>
           <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>Email address</label>
          <input 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="owner@shop.com"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              outline: 'none',
              fontSize: '1rem',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(155, 45, 242, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        <div>
           <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              outline: 'none',
              fontSize: '1rem',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(155, 45, 242, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(255,45,85,0.1)',
            border: '1px solid rgba(255,45,85,0.3)',
            borderRadius: '8px',
            color: '#ff6b8a',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', marginTop: '8px', padding: '14px', opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          disabled={isLoading}
        >
          <Lock size={18} /> {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, marginTop: '8px' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Sign up free</a>
        </p>

      </motion.form>
    </div>
  );
};

export default Login;

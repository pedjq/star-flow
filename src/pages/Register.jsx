import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--glass-border)',
  color: 'white',
  outline: 'none',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const { error: signUpError } = await signUp(email, password);
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="bg-glow purple" style={{ top: '20%', right: '25%', width: '500px', height: '500px', opacity: 0.2 }} />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.5rem', marginBottom: '48px' }}
      >
        <div style={{ background: '#ffffff', color: '#000', padding: '6px', borderRadius: '50%' }}>
          <Sparkles size={20} fill="currentColor" />
        </div>
        StarScaleHub
      </motion.div>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel"
          style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Check your email</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
            We sent a confirmation link to <strong style={{ color: '#fff' }}>{email}</strong>. Click it to activate your account, then sign in.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ width: '100%' }}>
            Go to Sign In
          </button>
        </motion.div>
      ) : (
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleRegister}
          className="glass-panel"
          style={{ width: '100%', maxWidth: '400px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Create your account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Start turning customers into 5-star reviews.</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="owner@shop.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Min. 6 characters"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={inputStyle}
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
            className="gradient-btn"
            style={{ width: '100%', borderRadius: '100px', padding: '14px', opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            disabled={isLoading}
          >
            <UserPlus size={18} /> {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#fff', textDecoration: 'underline' }}>Sign in</a>
          </p>
        </motion.form>
      )}
    </div>
  );
};

export default Register;

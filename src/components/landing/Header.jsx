import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      style={{
        position: 'fixed',
        top: '24px',
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 24px',
        transition: 'all 0.3s ease'
      }}
    >
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          width: '100%',
          maxWidth: '1000px',
          borderRadius: '100px',
          background: scrolled ? 'rgba(10, 10, 11, 0.8)' : 'rgba(255, 255, 255, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.25rem' }}>
          <div style={{ background: '#ffffff', color: '#000', padding: '6px', borderRadius: '50%' }}>
            <Sparkles size={18} fill="currentColor" />
          </div>
          Star.Flow
        </div>

        <div style={{ display: 'flex', gap: '32px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'none', '@media(min-width: 768px)': { display: 'flex' } }} className="nav-links">
          <a href="#about" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>About us</a>
          <a href="#works" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>How it works</a>
          <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Pricing</a>
        </div>

        <a href="/register" className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.875rem' }}>
          Get Started
        </a>
      </motion.nav>
    </header>
  );
};

export default Header;

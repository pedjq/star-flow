import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '64px 0 32px' }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '32px',
          '@media(min-width: 768px)': { flexDirection: 'row' }
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.25rem' }}>
            <div style={{ background: '#ffffff', color: '#000', padding: '6px', borderRadius: '50%' }}>
              <Sparkles size={18} fill="currentColor" />
            </div>
            Star.Flow
          </div>

          <div style={{ display: 'flex', gap: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Star.Flow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

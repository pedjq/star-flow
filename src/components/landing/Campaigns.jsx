import React from 'react';
import { motion } from 'framer-motion';

const Campaigns = () => {
  return (
    <section id="pricing" className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '3rem' }}>
            Explore our winning <br />
            <span className="text-accent">campaigns</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '32px',
          alignItems: 'start',
          '@media(min-width: 1024px)': { gridTemplateColumns: '1fr 1.5fr' }
        }}>
          
          {/* Left Side Accordion/Nav Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>Early Access Pricing</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Join the waitlist today to secure lifetime introductory pricing when we launch.
              </p>
              <a href="/register" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>Join Waitlist &rarr;</a>
            </div>
            
            <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontWeight: 500 }}>Unlimited Scans</span>
            </div>
            <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontWeight: 500 }}>Automated Google Redirects</span>
            </div>
            <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontWeight: 500 }}>Content Studio Access</span>
            </div>
          </div>

          {/* Right Side Table Area */}
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '24px', 
              borderBottom: '1px solid var(--glass-border)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              <div style={{ width: '30%' }}>Feature</div>
              <div style={{ width: '25%' }}>Value</div>
              <div style={{ width: '25%' }}>Included</div>
              <div style={{ width: '20%', textAlign: 'right' }}>ROI</div>
            </div>

            {[
              { id: 1, f: 'Smart QR Routing', v: 'Priceless', i: 'Yes', r: 'High' },
              { id: 2, f: 'Private Feedback Dashboard', v: 'Essential', i: 'Yes', r: 'High' },
              { id: 3, f: 'Google Reviews Sync', v: 'Automated', i: 'Yes', r: 'Max' },
              { id: 4, f: 'Social Post Templates', v: '3 Premium', i: 'Yes', r: 'High' },
              { id: 5, f: 'Physical QR Stands', v: 'Add-on', i: 'Optional', r: '-' },
            ].map((row, idx) => (
              <div key={row.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '24px', 
                borderBottom: idx !== 4 ? '1px solid var(--glass-border)' : 'none',
                alignItems: 'center',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: '30%', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(155, 45, 242, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    •
                  </div>
                  {row.f}
                </div>
                <div style={{ width: '25%', color: 'var(--text-secondary)' }}>{row.v}</div>
                <div style={{ width: '25%', color: 'var(--text-secondary)' }}>{row.i}</div>
                <div style={{ width: '20%', textAlign: 'right', fontWeight: 500 }}>{row.r}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Campaigns;

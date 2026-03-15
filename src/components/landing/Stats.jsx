import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ number, label, delay = 0, style = {} }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    style={{
      padding: '48px 32px',
      borderRight: '1px solid var(--glass-border)',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      ...style
    }}
  >
    <div style={{ fontSize: '4.5rem', fontWeight: 500, lineHeight: 1, marginBottom: '16px', color: '#fff' }}>
      {number}
    </div>
    <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
      {label}
    </div>
  </motion.div>
);

const Stats = () => {
  return (
    <section id="about" className="section-padding">
      <div className="container">
        
        <div style={{ marginBottom: '64px', maxWidth: '600px' }}>
          <h2 style={{ marginBottom: '16px' }}>
            We drive your business <br />
            <span className="text-accent">beyond limits</span>
          </h2>
          <p style={{ fontSize: '1.125rem' }}>
            Stop losing 5-star reviews to friction. Our intelligent QR flow ensures the best feedback is public, and the rest is kept out of sight.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(1, 1fr)',
          '@media(min-width: 768px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
          borderTop: '1px solid var(--glass-border)',
          borderLeft: '1px solid var(--glass-border)'
        }}>
          <StatCard number={<>10<span className="text-accent">x</span></>} label="Increase in Google Reviews" delay={0.1} />
          <StatCard number={<>95<span className="text-accent">%</span></>} label="Negative Feedback Blocked" delay={0.2} />
          <StatCard number={<>0<span className="text-accent">+</span></>} label="Friction for Customers" delay={0.3} />
          <StatCard number={<>300<span className="text-accent">%</span></>} label="Average ROI Growth" delay={0.4} />
          <div style={{ borderRight: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', position: 'relative' }}>
             {/* Empty center cell with subtle glow effect based on screenshot */}
             <div className="bg-glow purple" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', opacity: 0.3 }} />
          </div>
          <StatCard number={<>24<span className="text-accent">/7</span></>} label="Automated Content Generation" delay={0.5} />
        </div>

      </div>
    </section>
  );
};

export default Stats;

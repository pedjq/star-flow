import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  'Unlimited QR code scans',
  'Private feedback interception',
  'AI-generated review replies',
  'Instant approval emails — reply in seconds',
  'Custom QR card designer',
  'Feedback analytics dashboard',
  'Google review monitoring (3-hour checks)',
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" style={{ padding: 'clamp(64px, 10vw, 120px) 0', position: 'relative' }}>
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Simple pricing,<br />
            <span className="text-accent">serious results.</span>
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '16px auto 0' }}>
            One plan, everything included. No hidden fees, no lock-in.
          </p>
        </motion.div>

        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{
              background: 'linear-gradient(145deg, #0f0a1e 0%, #0a0714 100%)',
              border: '1px solid rgba(155,45,242,0.3)',
              borderRadius: '28px',
              padding: 'clamp(24px, 4vw, 48px)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 80px rgba(155,45,242,0.18)',
            }}
          >
            {/* Glow */}
            <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '240px', height: '240px', background: 'rgba(155,45,242,0.2)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(155,45,242,0.12)', border: '1px solid rgba(155,45,242,0.3)', borderRadius: '100px', padding: '5px 14px', fontSize: '0.72rem', fontWeight: 700, color: '#c084fc', marginBottom: '28px' }}>
              <Zap size={11} fill="currentColor" /> Founding Member Plan
            </div>

            {/* Price */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '6px' }}>
                <span style={{ fontSize: 'clamp(3.5rem, 7vw, 5rem)', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.04em' }}>$49</span>
                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>/month</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '36px' }}>
                per location · 14-day free trial included
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
                {FEATURES.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(91,231,139,0.12)', border: '1px solid rgba(91,231,139,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={11} color="#5be78b" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate('/register')}
                className="gradient-btn"
                style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '14px' }}
              >
                Get started with Starflow today →
              </button>

              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '14px' }}>
                No credit card required for the 14-day pilot
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;

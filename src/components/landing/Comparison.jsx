import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { X, Check } from 'lucide-react';

const ROWS = [
  {
    feature: 'Review Filtering',
    free: 'None. All feedback is public.',
    sf:   'Smart routing — private vs. public.',
  },
  {
    feature: 'AI Drafted Replies',
    free: 'Manual typing only.',
    sf:   'AI-powered instant drafts.',
  },
  {
    feature: 'Negative Interception',
    free: '1-star reviews go straight to Google.',
    sf:   'Private vault for unhappy guests.',
  },
  {
    feature: 'Reputation Insights',
    free: 'Zero data.',
    sf:   'Full analytics & goal tracking.',
  },
  {
    feature: 'Brand Trust',
    free: 'Generic, suspicious-looking links.',
    sf:   'Fully custom branded experience.',
  },
  {
    feature: 'Active Monitoring',
    free: 'You check Google manually.',
    sf:   '3-hour automated sync & alerts.',
  },
  {
    feature: 'SEO Impact',
    free: 'Random.',
    sf:   'Engineered for local map dominance.',
  },
];

const Comparison = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="compare" style={{ padding: 'clamp(48px, 6vw, 80px) 0 0', position: 'relative' }}>
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <span className="pill-badge gradient" style={{ marginBottom: '20px', display: 'inline-flex' }}>Why Star.Flow</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '16px' }}>
            Don't just get scanned.<br />
            <span className="text-accent">Get managed.</span>
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto' }}>
            Most businesses use a free QR generator. The best businesses use a reputation engine.
          </p>
        </motion.div>

        {/* Scrollable wrapper on mobile */}
        <div className="comparison-scroll">
        <motion.div
          ref={ref}
          className="comparison-inner"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          style={{
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '24px',
            overflow: 'hidden',
            background: '#0b0c10',
          }}
        >
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            background: '#13141a',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ padding: '18px 24px', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Feature
            </div>
            <div style={{ padding: '18px 24px', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
              Free QR Generators
            </div>
            <div style={{
              padding: '18px 24px',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              borderLeft: '1px solid rgba(155,45,242,0.2)',
              background: 'rgba(155,45,242,0.06)',
              color: '#c084fc',
              display: 'flex', alignItems: 'center', gap: '7px',
            }}>
              ★ Star.Flow
            </div>
          </div>

          {/* Data rows */}
          {ROWS.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                borderBottom: i < ROWS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              {/* Feature name */}
              <div style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center' }}>
                {row.feature}
              </div>

              {/* Free column */}
              <div style={{ padding: '16px 24px', borderLeft: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <X size={10} color="rgba(255,80,100,0.8)" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.5 }}>{row.free}</span>
              </div>

              {/* Star.Flow column */}
              <div style={{ padding: '16px 24px', borderLeft: '1px solid rgba(155,45,242,0.15)', background: 'rgba(155,45,242,0.025)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(91,231,139,0.1)', border: '1px solid rgba(91,231,139,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <Check size={10} color="#5be78b" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{row.sf}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        </div>{/* end comparison-scroll */}

      </div>
    </section>
  );
};

export default Comparison;

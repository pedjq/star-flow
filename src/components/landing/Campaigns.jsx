import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Star } from 'lucide-react';

const MobileReviewCard = ({ rating, reviewer, text, badge, badgeColor, badgeBg, borderColor, accentGlow }) => (
  <div style={{
    background: '#13141a',
    border: `1px solid ${borderColor}`,
    borderRadius: '18px',
    padding: '18px',
    maxWidth: '300px',
    margin: '0 auto',
    boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${accentGlow}`,
    position: 'relative',
    zIndex: 1,
  }}>
    {/* Reviewer row */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
        {reviewer[0]}
      </div>
      <div>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>{reviewer}</div>
        <div style={{ color: '#f4a017', fontSize: '11px', letterSpacing: '1.5px' }}>
          {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
        </div>
      </div>
    </div>

    {/* Review text */}
    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 14px' }}>
      "{text}"
    </p>

    {/* Status badge */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '10px', background: badgeBg, border: `1px solid ${borderColor}` }}>
      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: badgeColor, flexShrink: 0, boxShadow: `0 0 8px ${badgeColor}` }} />
      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: badgeColor }}>{badge}</span>
    </div>
  </div>
);

const Campaigns = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="value" style={{ padding: 'clamp(64px, 10vw, 120px) 0', position: 'relative' }}>
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Intercept the bad.<br />
            <span className="text-accent">Amplify the great.</span>
          </h2>
        </motion.div>

        <div ref={ref} className="value-loop-grid">

          {/* Left — Red — Intercept */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{
              background: 'linear-gradient(160deg, #1c0508 0%, #0d0205 100%)',
              border: '1px solid rgba(255,45,85,0.18)',
              borderRadius: '28px',
              padding: 'clamp(28px, 4vw, 48px) clamp(20px, 3.5vw, 36px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 'clamp(20px, 3vw, 32px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'rgba(255,45,85,0.07)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,80,100,0.8)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ShieldCheck size={13} /> Negative feedback
              </div>
              <MobileReviewCard
                rating={1}
                reviewer="Anonymous"
                text="Waited 40 minutes and my order was wrong. Very disappointing experience."
                badge="Intercepted — sent to private vault"
                badgeColor="rgba(255,80,100,0.9)"
                badgeBg="rgba(255,45,85,0.06)"
                borderColor="rgba(255,45,85,0.2)"
                accentGlow="rgba(255,45,85,0.06)"
              />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', margin: '0 0 10px', lineHeight: 1.4 }}>
                Intercept negative experiences<br />before they hurt your public score
              </p>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.6 }}>
                Low-star feedback goes straight to your private inbox — never to Google.
              </p>
            </div>
          </motion.div>

          {/* Right — Purple — Amplify */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{
              background: 'linear-gradient(160deg, #0f0a1e 0%, #0a0714 100%)',
              border: '1px solid rgba(155,45,242,0.22)',
              borderRadius: '28px',
              padding: 'clamp(28px, 4vw, 48px) clamp(20px, 3.5vw, 36px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 'clamp(20px, 3vw, 32px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'rgba(155,45,242,0.1)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(155,45,242,0.85)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Star size={13} /> 5-star review
              </div>
              <MobileReviewCard
                rating={5}
                reviewer="Sarah M."
                text="Absolutely love this place! The staff was amazing and the food was incredible. Coming back for sure!"
                badge="Reply copied — posted to Google ✓"
                badgeColor="#c084fc"
                badgeBg="rgba(155,45,242,0.08)"
                borderColor="rgba(155,45,242,0.22)"
                accentGlow="rgba(155,45,242,0.08)"
              />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', margin: '0 0 10px', lineHeight: 1.4 }}>
                Amplify your best fans<br />and boost your local SEO
              </p>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.6 }}>
                AI drafts the reply, you approve it in seconds, and it goes straight to Google.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Campaigns;

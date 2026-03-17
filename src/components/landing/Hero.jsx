import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Shield, Sparkles, Play } from 'lucide-react';

const FloatingGadget = ({ children, style, delay = 0, duration = 4, yOffset = -20 }) => (
  <motion.div
    className="hero-float"
    initial={{ y: 0 }}
    animate={{ y: [0, yOffset, 0] }}
    transition={{ repeat: Infinity, duration, delay, ease: 'easeInOut' }}
    style={{ ...style, position: 'absolute', zIndex: 15, pointerEvents: 'none', willChange: 'transform' }}
  >
    {children}
  </motion.div>
);

const HeroPreview = () => (
  <motion.div
    className="hero-preview-grid"
    initial={{ opacity: 0, y: 36 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    style={{ marginTop: '64px' }}
  >
    {/* Card 1 — Intercepted negative review */}
    <motion.div
      className="glass-panel hero-preview-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      style={{ padding: '20px', textAlign: 'left' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Shield size={15} color="#ff6080" />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>Intercepted</div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>Kept private · not on Google</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '2px', marginBottom: '9px' }}>
        {[1,2].map(i => <span key={i} style={{ color: '#ff2d55', fontSize: '12px' }}>★</span>)}
        {[3,4,5].map(i => <span key={i} style={{ color: 'rgba(255,255,255,0.12)', fontSize: '12px' }}>★</span>)}
      </div>
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, fontStyle: 'italic' }}>
        "Waited 20 minutes and my order was completely wrong..."
      </div>
      <div style={{ marginTop: '12px', fontSize: '0.65rem', background: 'rgba(255,45,85,0.07)', border: '1px solid rgba(255,45,85,0.2)', color: 'rgba(255,100,130,0.85)', padding: '4px 10px', borderRadius: '100px', display: 'inline-block' }}>
        Not posted to Google
      </div>
    </motion.div>

    {/* Card 2 — Reviews gained (center, slightly elevated) */}
    <motion.div
      className="glass-panel hero-preview-card hero-preview-card--center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.65 }}
      style={{ padding: '20px', textAlign: 'left', background: 'rgba(155,45,242,0.04)', border: '1px solid rgba(155,45,242,0.18)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(155,45,242,0.12)', border: '1px solid rgba(155,45,242,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Star size={15} color="#c084fc" fill="#c084fc" />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>Google Reviews</div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>This month</div>
        </div>
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1, color: '#fff', marginBottom: '6px' }}>+42</div>
      <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
        {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#f4a017', fontSize: '13px' }}>★</span>)}
      </div>
      <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
        {[3,4,5,6,7,8,10,12].map((h, i) => (
          <div key={i} style={{ width: '100%', maxWidth: '14px', height: `${h * 2.8}px`, borderRadius: '3px', background: i === 7 ? '#9b2df2' : `rgba(155,45,242,${0.2 + i * 0.09})` }} />
        ))}
      </div>
    </motion.div>

    {/* Card 3 — AI reply published */}
    <motion.div
      className="glass-panel hero-preview-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.75 }}
      style={{ padding: '20px', textAlign: 'left' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(43,88,255,0.1)', border: '1px solid rgba(43,88,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={15} color="#6080ff" />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>AI Reply Sent</div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>Auto-published</div>
        </div>
      </div>
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '12px' }}>
        "Thank you Sarah! We're thrilled you loved the experience — can't wait to welcome you back soon! ☕"
      </div>
      <div style={{ fontSize: '0.65rem', background: 'rgba(91,231,139,0.07)', border: '1px solid rgba(91,231,139,0.2)', color: 'rgba(91,231,139,0.85)', padding: '4px 10px', borderRadius: '100px', display: 'inline-block' }}>
        ✓ Posted on Google
      </div>
    </motion.div>
  </motion.div>
);

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding" style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 'clamp(100px, 15vw, 160px)', position: 'relative' }}>

      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '400px', background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Left card */}
      <FloatingGadget style={{ top: '15%', left: '7%', transform: 'rotate(-3deg)' }} delay={0} duration={5} yOffset={-15}>
        <div className="glass-panel" style={{ padding: '14px 18px', minWidth: '175px', boxShadow: '0 14px 40px rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px' }}>Last 30 days</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '1.875rem', fontWeight: 700, lineHeight: 1, color: '#fff' }}>+42</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '5px' }}>5-star reviews</div>
            </div>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', paddingBottom: '2px' }}>
              {[4, 5, 6, 7, 8, 9, 10].map((h, i) => (
                <div key={i} style={{ width: '4px', height: `${h * 2}px`, borderRadius: '2px', background: i === 6 ? '#9b2df2' : `rgba(155,45,242,${0.2 + i * 0.1})` }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2px', marginTop: '9px' }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={11} fill="#f4a017" color="#f4a017" />)}
          </div>
        </div>
      </FloatingGadget>

      {/* Right card */}
      <FloatingGadget style={{ top: '30%', right: '7%', transform: 'rotate(4deg)' }} delay={1.5} duration={6} yOffset={-20}>
        <div className="glass-panel" style={{ padding: '14px 18px', minWidth: '215px', boxShadow: '0 14px 40px rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #9b2df2, #2b58ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={13} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>1-Star Blocked</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.38)' }}>Kept private · not on Google</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.18)', borderRadius: '8px', padding: '8px 11px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.45, fontStyle: 'italic' }}>
            "Waited 20 mins, order was wrong..."
          </div>
        </div>
      </FloatingGadget>

      <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>

        <motion.h1
          className="text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ maxWidth: '900px', margin: '0 auto', marginBottom: '24px' }}
        >
          Your business reputation<br />
          on autopilot.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ maxWidth: '620px', margin: '0 auto', marginBottom: '48px', fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}
        >
          Stop chasing five-star reviews and start owning the conversation. Starflow intercepts negative feedback privately, automates AI responses, and builds your rating while you sleep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <button onClick={() => navigate('/register')} className="gradient-btn" style={{ padding: '14px 32px', fontSize: '1rem' }}>
            Start your 14-day pilot — no credit card
          </button>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '14px 24px', borderRadius: '100px', fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={10} fill="currentColor" />
            </div>
            Watch the 60-second demo
          </button>
        </motion.div>

        <HeroPreview />

      </div>
    </section>
  );
};

export default Hero;

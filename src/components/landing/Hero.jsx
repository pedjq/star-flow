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
    initial={{ opacity: 0, y: 36 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    style={{ marginTop: '56px', position: 'relative' }}
  >
    {/* Browser chrome wrapper */}
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {['rgba(255,90,90,0.6)', 'rgba(255,180,0,0.5)', 'rgba(80,210,100,0.5)'].map((bg, i) => (
          <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: bg, flexShrink: 0 }} />
        ))}
        <div style={{
          flex: 1, margin: '0 12px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '6px', padding: '4px 10px',
          display: 'flex', alignItems: 'center', gap: '6px',
          maxWidth: '260px',
        }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(91,231,139,0.7)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>app.starflow.com/dashboard</span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="hero-preview-grid" style={{ padding: '20px' }}>
        {/* Card 1 — Intercepted negative review */}
        <motion.div
          className="hero-preview-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          style={{
            background: 'rgba(255,45,85,0.04)',
            border: '1px solid rgba(255,45,85,0.14)',
            borderRadius: '12px', padding: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,45,85,0.12)', border: '1px solid rgba(255,45,85,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={13} color="#ff6080" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>Intercepted</div>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>Kept private</div>
            </div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>2m ago</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6080, #ff2d55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>M</div>
            <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Mike T.</span>
            <div style={{ display: 'flex', gap: '1px', marginLeft: 'auto' }}>
              {[1,2].map(i => <span key={i} style={{ color: '#ff2d55', fontSize: '10px' }}>★</span>)}
              {[3,4,5].map(i => <span key={i} style={{ color: 'rgba(255,255,255,0.1)', fontSize: '10px' }}>★</span>)}
            </div>
          </div>

          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '10px' }}>
            "Waited 20 min, order was wrong..."
          </div>
          <div style={{ fontSize: '0.58rem', background: 'rgba(255,45,85,0.07)', border: '1px solid rgba(255,45,85,0.18)', color: 'rgba(255,100,130,0.8)', padding: '3px 9px', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={9} /> Not on Google
          </div>
        </motion.div>

        {/* Card 2 — Reviews gained (center) */}
        <motion.div
          className="hero-preview-card hero-preview-card--center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          style={{
            background: 'linear-gradient(145deg, rgba(155,45,242,0.08) 0%, rgba(43,88,255,0.05) 100%)',
            border: '1px solid rgba(155,45,242,0.2)',
            borderRadius: '12px', padding: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(155,45,242,0.15)', border: '1px solid rgba(155,45,242,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Star size={13} color="#c084fc" fill="#c084fc" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>Google Reviews</div>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>This month</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1, color: '#fff', letterSpacing: '-0.04em' }}>+42</div>
              <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#f4a017', fontSize: '11px' }}>★</span>)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', paddingBottom: '4px', flex: 1, justifyContent: 'flex-end' }}>
              {[3,4,5,6,7,8,10,13].map((h, i) => (
                <div key={i} style={{ width: '100%', maxWidth: '10px', height: `${h * 2.6}px`, borderRadius: '2px', background: i === 7 ? '#9b2df2' : `rgba(155,45,242,${0.2 + i * 0.1})` }} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ fontSize: '0.6rem', color: 'rgba(155,45,242,0.8)', background: 'rgba(155,45,242,0.1)', border: '1px solid rgba(155,45,242,0.2)', padding: '2px 8px', borderRadius: '100px' }}>↑ 10x vs last month</div>
          </div>
        </motion.div>

        {/* Card 3 — AI reply published */}
        <motion.div
          className="hero-preview-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          style={{
            background: 'rgba(91,231,139,0.03)',
            border: '1px solid rgba(91,231,139,0.12)',
            borderRadius: '12px', padding: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(43,88,255,0.12)', border: '1px solid rgba(43,88,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={13} color="#6080ff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>AI Reply Sent</div>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>Auto-published</div>
            </div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>Just now</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #6080ff, #9b2df2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>S</div>
            <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Sarah M.</span>
            <div style={{ display: 'flex', gap: '1px', marginLeft: 'auto' }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#f4a017', fontSize: '10px' }}>★</span>)}
            </div>
          </div>

          <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', marginBottom: '10px' }}>
            <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.25)', marginBottom: '4px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Draft</div>
            <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              "Thank you Sarah! We're thrilled you loved it — see you soon! ☕"
            </div>
          </div>

          <div style={{ fontSize: '0.58rem', background: 'rgba(91,231,139,0.07)', border: '1px solid rgba(91,231,139,0.2)', color: 'rgba(91,231,139,0.85)', padding: '3px 9px', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>✓</span> Posted on Google
          </div>
        </motion.div>
      </div>
    </div>

    {/* Glow beneath chrome */}
    <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '80px', background: 'radial-gradient(ellipse, rgba(155,45,242,0.18) 0%, transparent 70%)', pointerEvents: 'none', zIndex: -1 }} />
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

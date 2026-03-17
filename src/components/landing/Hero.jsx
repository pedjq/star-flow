import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Shield, Play } from 'lucide-react';

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

const AnimatedGraph = () => {
  const points = [
    { x: 10, y: 80, label: "Scan & Verify",  desc: "Customers scan your branded QR code at checkout." },
    { x: 35, y: 75, label: "Intercept",       desc: "Negative feedback is captured privately before it hits Google." },
    { x: 65, y: 45, label: "4 & 5★ → Google", desc: "Happy customers are routed straight to your Google listing." },
    { x: 90, y: 15, label: "Auto Reply",       desc: "AI drafts and sends replies to your best reviews — automatically." },
  ];

  return (
    <div>
      {/* SVG chart */}
      <div className="hero-graph-wrap">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2b58ff" />
              <stop offset="50%" stopColor="#9b2df2" />
              <stop offset="100%" stopColor="#ff2d55" />
            </linearGradient>
          </defs>
          <motion.path
            d={`M ${points[0].x} ${points[0].y}
                C 20 80, 25 76, ${points[1].x} ${points[1].y}
                C 45 72, 55 55, ${points[2].x} ${points[2].y}
                C 75 35, 82 15, ${points[3].x} ${points[3].y}`}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="0.8"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
          {points.map((p, i) => (
            <g key={i}>
              <motion.line
                x1={p.x} y1={p.y} x2={p.x} y2="100"
                className="graph-line-vertical"
                strokeWidth="0.3"
                initial={{ opacity: 0, y2: p.y }}
                animate={{ opacity: 1, y2: 100 }}
                transition={{ duration: 1, delay: 1 + (i * 0.3) }}
              />
              <motion.circle
                cx={p.x} cy={p.y} r="1.5"
                fill={i === 0 ? '#2b58ff' : i === 1 ? '#6c43fa' : i === 2 ? '#ce2df7' : '#ff2d55'}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 1.5 + (i * 0.3) }}
              />
            </g>
          ))}
        </svg>

        {/* Desktop labels — absolutely positioned below each graph point */}
        {points.map((p, i) => (
          <motion.div
            key={i}
            className="hero-graph-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2 + (i * 0.2) }}
            style={{ left: `${p.x}%`, top: '100%', transform: 'translateX(-50%)' }}
          >
            <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '6px', color: '#fff' }}>{p.label}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Mobile labels — 2×2 grid, shown only on small screens */}
      <div className="hero-graph-mobile-grid">
        {points.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.8 + i * 0.15 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#fff', marginBottom: '4px' }}>{p.label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{p.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding" style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 'clamp(100px, 15vw, 160px)', position: 'relative' }}>

      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '400px', background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Left card — reviews gained metric with mini sparkline */}
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

      {/* Right card — negative feedback intercepted */}
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

        <AnimatedGraph />

      </div>
    </section>
  );
};

export default Hero;

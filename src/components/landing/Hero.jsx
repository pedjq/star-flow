import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Play } from 'lucide-react';

const FloatingGadget = ({ children, style, delay = 0, duration = 4, yOffset = -20 }) => (
  <motion.div
    className="hero-float"
    initial={{ y: 0 }}
    animate={{ y: [0, yOffset, 0] }}
    transition={{ repeat: Infinity, duration, delay, ease: 'easeInOut' }}
    style={{ ...style, position: 'absolute', zIndex: 15, pointerEvents: 'none' }}
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
    <section className="section-padding" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 'clamp(100px, 15vw, 160px)', position: 'relative' }}>

      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '400px', background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <FloatingGadget style={{ top: '15%', left: '10%', transform: 'rotate(-5deg)' }} delay={0} duration={5} yOffset={-15}>
        <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#fff" color="#fff" />)}
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>+42</span>
        </div>
      </FloatingGadget>

      <FloatingGadget style={{ top: '35%', right: '12%', transform: 'rotate(5deg)' }} delay={1.5} duration={6} yOffset={-20}>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #9b2df2, #2b58ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={16} color="#fff" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Feedback intercepted</div>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>1-Star Saved</div>
          </div>
        </div>
      </FloatingGadget>

      <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', marginBottom: '32px' }}
        >
          <span className="pill-badge gradient" style={{ padding: '6px 20px', letterSpacing: '0.05em' }}>Reputation on Autopilot</span>
        </motion.div>

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

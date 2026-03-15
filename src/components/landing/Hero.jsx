import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare } from 'lucide-react';

const FloatingGadget = ({ children, style, delay = 0, duration = 4, yOffset = -20 }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [0, yOffset, 0] }}
    transition={{ repeat: Infinity, duration, delay, ease: 'easeInOut' }}
    style={{
      ...style,
      position: 'absolute',
      zIndex: 15,
      pointerEvents: 'none'
    }}
  >
    {children}
  </motion.div>
);

const AnimatedGraph = () => {
  const points = [
    { x: 10, y: 80, label: "Scan & Verify", desc: "Customers easily scan your beautifully branded QR code." },
    { x: 35, y: 75, label: "Intercept", desc: "We intercept negative feedback privately before it hurts you." },
    { x: 65, y: 55, label: "Amplify", desc: "4 & 5-star experiences are instantly routed to Google." },
    { x: 90, y: 20, label: "Content", desc: "AI turns your top reviews into ready social media posts." }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '350px', marginTop: '80px' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        
        {/* Glow behind the path */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2b58ff" />
            <stop offset="50%" stopColor="#9b2df2" />
            <stop offset="100%" stopColor="#ff2d55" />
          </linearGradient>
        </defs>

        {/* Main Curved Line */}
        <motion.path 
          d={`M ${points[0].x} ${points[0].y} 
              C 20 80, 25 76, ${points[1].x} ${points[1].y} 
              C 45 74, 55 65, ${points[2].x} ${points[2].y} 
              C 75 45, 80 20, ${points[3].x} ${points[3].y}`}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="0.8"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Vertical Dotted Lines & Points */}
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
              style={{ zIndex: 10 }}
            />
          </g>
        ))}
      </svg>

      {/* HTML Labels positioned absolute matching the SVG coordinates */}
      {points.map((p, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2 + (i * 0.2) }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '100%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: '200px',
            marginTop: '24px'
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '8px', color: '#fff' }}>{p.label}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {p.desc}
          </div>
        </motion.div>
      ))}
    </div>
  );
};


const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '160px', position: 'relative' }}>
      
      {/* Implied ambient lighting from top */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '400px', background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      
      {/* Decorative Floating Gadgets */}
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

      <FloatingGadget style={{ bottom: '30%', left: '5%', transform: 'scale(0.8) rotate(-10deg)' }} delay={0.5} duration={4.5} yOffset={15}>
        <div className="glass-panel" style={{ padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
           <div style={{ width: '40px', height: '40px', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '8px' }} />
        </div>
      </FloatingGadget>

      <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', marginBottom: '32px' }}
        >
          <span className="pill-badge gradient" style={{ padding: '6px 20px', letterSpacing: '0.05em' }}>Reputation Experts</span>
        </motion.div>

        <motion.h1 
          className="text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ maxWidth: '900px', margin: '0 auto', marginBottom: '24px' }}
        >
          Optimize Your Reputation, <br />
          Maximize Success
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '48px', fontSize: '1.125rem' }}
        >
          Turn Happy Customers into 5-Star Reviews with Tailored QR Solutions That Deliver Real Growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <form className="email-input-wrapper" onSubmit={(e) => { e.preventDefault(); navigate('/register'); }}>
            <input type="email" placeholder="Work Email Address" className="email-input" required />
            <button type="submit" className="gradient-btn">
              Get early access
            </button>
          </form>
        </motion.div>

        <AnimatedGraph />

      </div>
    </section>
  );
};

export default Hero;

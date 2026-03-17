import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Sparkles, Send, QrCode } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    label: 'SCAN & FILTER',
    title: 'Intercept feedback at the source.',
    desc: 'A sleek QR entry point directs customers to a beautiful feedback interface. We automatically route 5-star fans to Google while keeping negative experiences private and actionable for you.',
    icon: QrCode,
    numColor: '#c084fc',
    bg: 'linear-gradient(145deg, #0f0a1e 0%, #0a0714 100%)',
    borderColor: 'rgba(155, 45, 242, 0.25)',
  },
  {
    number: '02',
    label: 'SMART AUTOMATION',
    title: 'Draft professional responses in seconds.',
    desc: 'Star.Flow automatically syncs your newest Google reviews and generates personalised, brand-aligned replies. No more staring at a blank box — just high-quality drafts waiting for your approval.',
    icon: Sparkles,
    numColor: '#ffffff',
    bg: '#111218',
    borderColor: 'rgba(255,255,255,0.06)',
  },
  {
    number: '03',
    label: 'SEAMLESS PUBLISHING',
    title: 'One click, and your rating climbs.',
    desc: 'Finalize the draft with a single click and push it live on Google. Every response signals to Google\'s algorithm that your business is active, helping you outrank competitors.',
    icon: Send,
    numColor: '#ffffff',
    bg: '#111218',
    borderColor: 'rgba(255,255,255,0.06)',
  },
];

const GridPattern = ({ id, color, opacity }) => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, zIndex: 0 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

const StepCard = ({ step, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = step.icon;
  const isFirst = index === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        background: step.bg,
        border: `1px solid ${step.borderColor}`,
        borderRadius: '24px',
        padding: 'clamp(20px, 3.5vw, 32px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '280px',
        boxShadow: isFirst ? '0 20px 60px rgba(155, 45, 242, 0.15)' : '0 20px 40px rgba(0,0,0,0.2)',
        cursor: 'default',
      }}
    >
      <GridPattern
        id={`step-grid-${index}`}
        color={isFirst ? '#9b2df2' : '#ffffff'}
        opacity={isFirst ? 0.12 : 0.04}
      />

      {isFirst && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '-30px',
            right: '-30px',
            width: '160px',
            height: '160px',
            background: 'rgba(155, 45, 242, 0.2)',
            filter: 'blur(50px)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Icon size={24} color={step.numColor} strokeWidth={1.5} style={{ marginBottom: '16px' }} />

        <div
          style={{
            fontSize: 'clamp(3rem, 4.5vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            color: step.numColor,
            marginBottom: '16px',
            fontFeatureSettings: '"tnum"',
            opacity: isFirst ? 1 : 0.85,
          }}
        >
          {step.number}
        </div>

        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '6px' }}>
          {step.label}
        </div>
        <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#fff', marginBottom: '8px', lineHeight: 1.3 }}>
          {step.title}
        </div>
        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'auto' }}>
          {step.desc}
        </div>
      </div>
    </motion.div>
  );
};

const AI_RESPONSE = `Thank you so much, Sarah! We're thrilled you loved your visit. Your kind words truly make our day — we look forward to welcoming you back very soon! ☕`;

const TIMELINE = [
  { phase: 0, delay: 0 },
  { phase: 1, delay: 1000 },
  { phase: 2, delay: 2200 },
  { phase: 3, delay: 3600 },
  { phase: 4, delay: 7000 },
  { phase: 5, delay: 8200 },
];
const LOOP_DELAY = 12000;

const ReviewAnimation = () => {
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    const timers = TIMELINE.map(({ phase: p, delay }) =>
      setTimeout(() => setPhase(p), delay)
    );
    const resetTimer = setTimeout(() => {
      setPhase(0);
      setTypedText('');
      setLoopKey(k => k + 1);
    }, LOOP_DELAY);
    return () => { timers.forEach(clearTimeout); clearTimeout(resetTimer); };
  }, [loopKey]);

  useEffect(() => {
    if (phase !== 3) return;
    setTypedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < AI_RESPONSE.length) { setTypedText(AI_RESPONSE.slice(0, i + 1)); i++; }
      else clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [phase]);

  const showDraft = phase >= 3;
  const isSent = phase === 5;
  const isGenerating = phase === 2;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '420px', margin: '0 auto' }}>
      <div style={{ position: 'absolute', width: '260px', height: '260px', background: 'rgba(155,45,242,0.1)', filter: 'blur(70px)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
      {isSent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ position: 'absolute', width: '240px', height: '240px', background: 'rgba(91,231,139,0.07)', filter: 'blur(60px)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
        />
      )}

      <div style={{
        background: '#111218',
        border: isSent ? '1px solid rgba(91,231,139,0.22)' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '18px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        transition: 'border 0.5s',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {['rgba(255,45,85,0.5)', 'rgba(255,160,0,0.5)', 'rgba(91,231,139,0.5)'].map((bg, i) => (
            <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: bg }} />
          ))}
          <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', marginLeft: '8px', fontWeight: 500 }}>
            Star.Flow · Review Responses
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '4px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#fff' }}>Sarah M.</span>
              <span style={{ color: '#f4a017', fontSize: '11px', letterSpacing: '1px' }}>★★★★★</span>
              <AnimatePresence>
                {isSent && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                    style={{
                      fontSize: '0.6rem', padding: '2px 7px', borderRadius: '100px',
                      background: 'linear-gradient(135deg, rgba(91,231,139,0.2), rgba(52,211,153,0.15))',
                      border: '1px solid rgba(91,231,139,0.4)', color: '#5be78b', fontWeight: 700,
                      boxShadow: '0 0 14px rgba(91,231,139,0.25)',
                    }}
                  >✦ Reply sent</motion.span>
                )}
              </AnimatePresence>
            </div>
            <p style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.58)', margin: 0, lineHeight: 1.55 }}>
              "Absolutely loved the atmosphere. Will definitely be back!"
            </p>
          </div>

          {!isSent && (
            <motion.button
              animate={phase === 1 ? {
                scale: [1, 0.92, 1.04, 1],
                boxShadow: ['0 0 0px rgba(155,45,242,0)', '0 0 0px rgba(155,45,242,0)', '0 0 16px rgba(155,45,242,0.6)', '0 0 6px rgba(155,45,242,0.2)'],
              } : {}}
              transition={{ duration: 0.5 }}
              style={{ flexShrink: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '5px 11px', borderRadius: '100px', fontSize: '0.675rem', fontWeight: 500, cursor: 'default', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
            >
              <Sparkles size={10} style={{ animation: isGenerating ? 'spin 1s linear infinite' : 'none' }} />
              {isGenerating ? 'Generating...' : 'Generate Reply'}
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {showDraft && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', overflow: 'hidden' }}
            >
              <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>AI Draft Reply</div>
              <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, minHeight: '60px' }}>
                {typedText}
                {phase === 3 && typedText.length < AI_RESPONSE.length && (
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}
                    style={{ display: 'inline-block', width: '1.5px', height: '10px', background: '#9b2df2', verticalAlign: 'text-bottom', marginLeft: '1px' }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '9px', gap: '7px' }}>
                <div style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.63rem', fontFamily: 'inherit' }}>Copy</div>
                {!isSent && (
                  <motion.button
                    animate={phase === 4 ? {
                      scale: [1, 0.9, 1.05, 1],
                      boxShadow: ['0 0 0px rgba(43,88,255,0)', '0 0 0px rgba(43,88,255,0)', '0 0 18px rgba(43,88,255,0.7)', '0 0 6px rgba(43,88,255,0.2)'],
                    } : {}}
                    transition={{ duration: 0.5 }}
                    style={{ background: 'linear-gradient(135deg, #2b58ff, #9b2df2)', border: 'none', color: '#fff', padding: '5px 12px', borderRadius: '100px', fontSize: '0.675rem', fontWeight: 600, cursor: 'default', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}
                  >
                    <Send size={10} /> Mark as Sent
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section id="works" style={{ padding: 'clamp(64px, 10vw, 120px) 0', position: 'relative' }}>
      <div className="container">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="pill-badge gradient" style={{ marginBottom: '24px', display: 'inline-flex' }}>How it works</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 600, marginBottom: '20px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            From scan to 5 stars —<br />
            <span className="text-accent">three simple steps</span>
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Star Flow handles everything between a customer scan and a published Google reply — automatically.
          </p>
        </div>

        {/* Horizontal step cards */}
        <div className="step-cards-grid" style={{ marginBottom: '48px' }}>
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>

        {/* Animation panel below */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: 'clamp(24px, 4vw, 40px) clamp(16px, 3vw, 28px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '220px', height: '220px', background: 'rgba(43,88,255,0.06)', filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none' }} />
          <ReviewAnimation />
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

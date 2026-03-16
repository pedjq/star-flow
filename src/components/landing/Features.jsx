import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    label: 'SCAN & RATE',
    title: 'Customers rate privately at checkout',
    desc: 'A sleek QR code sends customers to a beautiful rating screen. Happy ones go straight to Google — the rest stay private.',
  },
  {
    number: '02',
    label: 'AI DRAFTS',
    title: 'AI writes the perfect reply instantly',
    desc: 'Star Flow pulls your 5-star reviews and drafts personalised, on-brand responses in seconds. One click, ready to publish.',
  },
  {
    number: '03',
    label: 'YOU PUBLISH',
    title: 'One click — your rating climbs',
    desc: 'Review the draft, hit Mark as Sent, and paste it into Google. Watch your score inch toward the next milestone.',
  },
];

const AI_RESPONSE = `Thank you so much, Sarah! We're thrilled you loved your visit. Your kind words truly make our day — we look forward to welcoming you back very soon! ☕`;

// Phases:
// 0 = card idle
// 1 = cursor hovering Generate Reply
// 2 = click Generate Reply (ripple)
// 3 = generating spinner
// 4 = text typing
// 5 = cursor hovering Mark as Sent
// 6 = click Mark as Sent (ripple)
// 7 = sent badge
const TIMELINE = [
  { phase: 0, delay: 0 },
  { phase: 1, delay: 1000 },
  { phase: 2, delay: 2000 },
  { phase: 3, delay: 2300 },
  { phase: 4, delay: 3800 },
  { phase: 5, delay: 7000 },
  { phase: 6, delay: 8000 },
  { phase: 7, delay: 8400 },
];
const LOOP_DELAY = 12500;

// SVG cursor arrow
const CursorSVG = () => (
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))' }}>
    <path d="M2 2L2 17L6 13L8.5 19L11 18L8.5 12L14 12L2 2Z" fill="white" stroke="#222" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

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
    if (phase !== 4) return;
    setTypedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < AI_RESPONSE.length) { setTypedText(AI_RESPONSE.slice(0, i + 1)); i++; }
      else clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [phase]);

  const showDraft = phase >= 4;
  const isSent = phase === 7;
  const isGenerating = phase === 3;

  // Cursor positions (relative to card container, bottom-right area)
  const cursorPos = phase === 1 || phase === 2
    ? { top: '76px', right: '18px' }   // near Generate Reply button
    : { bottom: '52px', right: '18px' }; // near Mark as Sent button

  const showCursor = phase >= 1 && phase <= 2 || phase >= 5 && phase <= 6;
  const isClicking = phase === 2 || phase === 6;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', width: '260px', height: '260px', background: 'rgba(155,45,242,0.1)', filter: 'blur(70px)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
      {isSent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ position: 'absolute', width: '240px', height: '240px', background: 'rgba(91,231,139,0.07)', filter: 'blur(60px)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
        />
      )}

      {/* Card */}
      <div style={{
        background: '#111218',
        border: isSent ? '1px solid rgba(91,231,139,0.22)' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '18px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        transition: 'border 0.5s',
        position: 'relative', zIndex: 1,
      }}>
        {/* Window chrome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {['rgba(255,45,85,0.5)', 'rgba(255,160,0,0.5)', 'rgba(91,231,139,0.5)'].map((bg, i) => (
            <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: bg }} />
          ))}
          <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', marginLeft: '8px', fontWeight: 500 }}>
            Star.Flow · Review Responses
          </span>
        </div>

        {/* Review row */}
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
              animate={phase === 1 ? { boxShadow: ['0 0 0px rgba(155,45,242,0)', '0 0 12px rgba(155,45,242,0.45)', '0 0 0px rgba(155,45,242,0)'], scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 0.6, repeat: phase === 1 ? 1 : 0 }}
              style={{ flexShrink: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '5px 11px', borderRadius: '100px', fontSize: '0.675rem', fontWeight: 500, cursor: 'default', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
            >
              <Sparkles size={10} style={{ animation: isGenerating ? 'spin 1s linear infinite' : 'none' }} />
              {isGenerating ? 'Generating...' : 'Generate Reply'}
            </motion.button>
          )}
        </div>

        {/* AI Draft */}
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
                {phase === 4 && typedText.length < AI_RESPONSE.length && (
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}
                    style={{ display: 'inline-block', width: '1.5px', height: '10px', background: '#9b2df2', verticalAlign: 'text-bottom', marginLeft: '1px' }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '9px', gap: '7px' }}>
                <div style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.63rem', fontFamily: 'inherit' }}>Copy</div>
                {!isSent && (
                  <motion.button
                    animate={phase === 5 ? { boxShadow: ['0 0 0px rgba(43,88,255,0)', '0 0 14px rgba(43,88,255,0.5)', '0 0 0px rgba(43,88,255,0)'], scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.6, repeat: phase === 5 ? 1 : 0 }}
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

      {/* Cursor + click ripple */}
      <AnimatePresence>
        {showCursor && (
          <motion.div
            key={`cursor-${phase >= 5 ? 'sent' : 'gen'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{ position: 'absolute', ...cursorPos, pointerEvents: 'none', zIndex: 20 }}
          >
            <motion.div
              animate={isClicking ? { scale: [1, 0.72, 1], y: [0, 2, 0] } : {}}
              transition={{ duration: 0.18 }}
            >
              <CursorSVG />
            </motion.div>
            <AnimatePresence>
              {isClicking && (
                <motion.div
                  key={`ripple-${phase}`}
                  initial={{ scale: 0, opacity: 0.7 }}
                  animate={{ scale: 2.8, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{ position: 'absolute', top: 0, left: 0, width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Features = () => {
  return (
    <section id="works" style={{ padding: '120px 0', position: 'relative' }}>
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

        {/* Main layout: step cards left, animation right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'center' }} className="how-it-works-grid">

          {/* Left: 3 horizontal step cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'start' }} className="step-cards-grid">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  padding: '24px 20px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                  height: '100%',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(155,45,242,0.12)', border: '1px solid rgba(155,45,242,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 700, color: '#c084fc',
                  marginBottom: '14px',
                }}>
                  {step.number}
                </div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {step.label}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fff', marginBottom: '8px', lineHeight: 1.35 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {step.desc}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Animated preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              padding: '36px 28px',
              minHeight: '340px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '220px', height: '220px', background: 'rgba(43,88,255,0.06)', filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none' }} />
            <ReviewAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;

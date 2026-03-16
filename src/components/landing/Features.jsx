import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    label: 'SCAN & RATE',
    title: 'Customers rate privately at checkout',
    desc: 'A sleek QR code sends customers to a beautiful feedback screen. Happy ones go to Google — the rest stay private in your dashboard.',
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
    desc: 'Review the draft, hit Mark as Sent, paste it into Google. Watch your rating inch toward that next 0.1 milestone.',
  },
];

const AI_RESPONSE = `Thank you so much, Sarah! We're thrilled to hear you loved your visit. Your kind words truly make our day — we look forward to welcoming you back very soon! ☕`;

// Phases:
// 0 = show card idle
// 1 = cursor near Generate Reply (hover pulse)
// 2 = generating spinner
// 3 = typing text
// 4 = cursor near Mark as Sent
// 5 = sent badge appears
const PHASE_DELAYS = [0, 1200, 2600, 4000, 7200, 8800, 12000];

const ReviewAnimation = () => {
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    const timers = [];
    PHASE_DELAYS.forEach((delay, i) => {
      timers.push(
        setTimeout(() => {
          if (i < PHASE_DELAYS.length - 1) {
            setPhase(i);
          } else {
            // reset loop
            setPhase(0);
            setTypedText('');
            setLoopKey(k => k + 1);
          }
        }, delay)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [loopKey]);

  useEffect(() => {
    if (phase !== 3) return;
    setTypedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < AI_RESPONSE.length) {
        setTypedText(AI_RESPONSE.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [phase]);

  const showDraft = phase >= 3;
  const isSent = phase === 5;
  const isGenerating = phase === 2;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '360px' }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', width: '280px', height: '280px', background: 'rgba(155, 45, 242, 0.1)', filter: 'blur(80px)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
      {isSent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ position: 'absolute', width: '260px', height: '260px', background: 'rgba(91, 231, 139, 0.07)', filter: 'blur(70px)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
        />
      )}

      {/* Mock card */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: '#111218',
        border: isSent ? '1px solid rgba(91,231,139,0.2)' : '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '18px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        transition: 'border 0.5s',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Window chrome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(255,45,85,0.5)' }} />
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(255,160,0,0.5)' }} />
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(91,231,139,0.5)' }} />
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginLeft: '8px', fontWeight: 500 }}>
            Star.Flow · Review Responses
          </span>
        </div>

        {/* Review row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '4px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#fff' }}>Sarah M.</span>
              <span style={{ color: '#f4a017', fontSize: '11px', letterSpacing: '1px' }}>★★★★★</span>
              <AnimatePresence>
                {isSent && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    style={{
                      fontSize: '0.6rem', padding: '2px 7px', borderRadius: '100px',
                      background: 'linear-gradient(135deg, rgba(91,231,139,0.2), rgba(52,211,153,0.15))',
                      border: '1px solid rgba(91,231,139,0.4)',
                      color: '#5be78b', fontWeight: 700,
                      boxShadow: '0 0 12px rgba(91,231,139,0.2)',
                    }}
                  >
                    ✦ Reply sent
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <p style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.55 }}>
              "Absolutely loved the atmosphere. Will definitely be back!"
            </p>
          </div>

          {!isSent && (
            <motion.button
              animate={phase === 1 ? {
                boxShadow: ['0 0 0px rgba(155,45,242,0)', '0 0 14px rgba(155,45,242,0.45)', '0 0 0px rgba(155,45,242,0)'],
                scale: [1, 1.04, 1],
              } : {}}
              transition={{ duration: 0.7, repeat: phase === 1 ? 1 : 0 }}
              style={{
                flexShrink: 0,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', padding: '5px 11px', borderRadius: '100px',
                fontSize: '0.675rem', fontWeight: 500, cursor: 'default',
                display: 'flex', alignItems: 'center', gap: '4px',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
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
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', overflow: 'hidden' }}
            >
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '7px' }}>
                AI Draft Reply
              </div>
              <div style={{
                padding: '11px 13px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                fontSize: '0.74rem', color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.6, minHeight: '64px',
              }}>
                {typedText}
                {phase === 3 && typedText.length < AI_RESPONSE.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.55 }}
                    style={{ display: 'inline-block', width: '1.5px', height: '11px', background: '#9b2df2', verticalAlign: 'text-bottom', marginLeft: '1px' }}
                  />
                )}
              </div>

              {/* Buttons row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '9px', gap: '7px' }}>
                <div style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)', borderRadius: '6px', padding: '5px 10px', fontSize: '0.65rem', cursor: 'default', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Copy
                </div>
                {!isSent && (
                  <motion.button
                    animate={phase === 4 ? {
                      scale: [1, 0.93, 1.02, 1],
                      boxShadow: ['0 0 0px rgba(43,88,255,0)', '0 0 18px rgba(43,88,255,0.5)', '0 0 6px rgba(43,88,255,0.2)', '0 0 0px rgba(43,88,255,0)'],
                    } : {}}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{
                      background: 'linear-gradient(135deg, #2b58ff, #9b2df2)',
                      border: 'none', color: '#fff',
                      padding: '5px 12px', borderRadius: '100px',
                      fontSize: '0.675rem', fontWeight: 600, cursor: 'default',
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontFamily: 'inherit',
                    }}
                  >
                    <Send size={10} /> Mark as Sent
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cursor */}
      <AnimatePresence>
        {(phase === 1 || phase === 4) && (
          <motion.div
            key={`cursor-${phase}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              zIndex: 20,
              fontSize: '16px',
              lineHeight: 1,
              ...(phase === 1
                ? { top: 'calc(50% - 68px)', right: 'calc(50% - 170px)' }
                : { bottom: 'calc(50% - 100px)', right: 'calc(50% - 160px)' }),
            }}
          >
            <motion.span
              animate={{ scale: [1, 0.82, 1] }}
              transition={{ delay: 0.6, duration: 0.18 }}
              style={{ display: 'block' }}
            >
              ↖
            </motion.span>
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
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <span className="pill-badge gradient" style={{ marginBottom: '24px', display: 'inline-flex' }}>How it works</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 600, marginBottom: '20px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            From scan to 5 stars —<br />
            <span className="text-accent">three simple steps</span>
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto' }}>
            Star Flow handles everything between a customer scan and a published Google reply — automatically.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '48px',
          alignItems: 'center',
        }}
          className="how-it-works-grid"
        >
          {/* Left: Step cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                style={{
                  padding: '20px 22px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div style={{
                  minWidth: '38px', height: '38px', borderRadius: '10px',
                  background: 'rgba(155,45,242,0.12)',
                  border: '1px solid rgba(155,45,242,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: '#c084fc',
                  flexShrink: 0,
                }}>
                  {step.number}
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    {step.label}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#fff', marginBottom: '5px' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {step.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Animated preview */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              padding: '32px 24px',
              minHeight: '380px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '250px', height: '250px', background: 'rgba(43,88,255,0.07)', filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none' }} />
            <ReviewAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;

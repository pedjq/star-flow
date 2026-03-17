import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, ShieldCheck, Zap } from 'lucide-react';

// Direct DOM updates — no React re-renders per frame, silky smooth on mobile
const AnimatedNumber = ({ value, inView, startDelay = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const numeric = parseFloat(value);
    const suffix = value.replace(/[0-9.]/g, '');

    if (!inView) {
      el.textContent = '0' + suffix;
      return;
    }

    let raf;
    const duration = 800;

    const runAnimation = () => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * numeric) + suffix;
        if (t < 1) { raf = requestAnimationFrame(tick); }
        else { el.textContent = value; }
      };
      raf = requestAnimationFrame(tick);
    };

    const timer = setTimeout(runAnimation, startDelay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [inView, value, startDelay]);

  return <span ref={ref}>0</span>;
};

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

const StatCard = ({ delay, number, label, isLarge, icon: Icon, numColor, bg, borderColor, gridColor, gridOpacity, gridId }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: '28px',
        padding: isLarge ? 'clamp(24px, 4vw, 48px)' : 'clamp(20px, 3.5vw, 40px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        minHeight: isLarge ? 'clamp(240px, 35vw, 420px)' : 'clamp(200px, 30vw, 380px)',
        boxShadow: isLarge
          ? '0 20px 80px rgba(155, 45, 242, 0.2)'
          : '0 20px 40px rgba(0,0,0,0.25)',
        cursor: 'default',
      }}
    >
      <GridPattern id={gridId} color={gridColor} opacity={gridOpacity} />

      {/* Ambient glow for large card */}
      {isLarge && (
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '-40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            background: 'rgba(155, 45, 242, 0.25)',
            filter: 'blur(60px)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {Icon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.15 }}
          >
            <Icon size={28} color={numColor} strokeWidth={1.5} />
          </motion.div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', flexGrow: 1, marginTop: '24px' }}>
          <div
            style={{
              fontSize: isLarge ? 'clamp(5rem, 9vw, 8rem)' : 'clamp(3.5rem, 5.5vw, 5.5rem)',
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              color: numColor,
              marginBottom: '20px',
              fontFeatureSettings: '"tnum"',
            }}
          >
            <AnimatedNumber value={number} inView={inView} startDelay={Math.round((delay + 0.7) * 1000)} />
          </div>
          <div
            style={{
              color: isLarge ? 'rgba(210, 170, 255, 0.75)' : 'var(--text-secondary)',
              fontSize: isLarge ? '1.15rem' : '1.05rem',
              lineHeight: 1.5,
              fontWeight: 500,
              maxWidth: '88%',
            }}
          >
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Stats = () => {
  return (
    <section id="proof" style={{ padding: 'clamp(72px, 12vw, 160px) 0', position: 'relative' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 80px)' }}
        >
          <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>
            Real results,<br />
            <span className="text-accent">unbelievably fast.</span>
          </h2>
        </motion.div>

        <div className="stats-screenshot-grid">
          <StatCard
            isLarge
            delay={0.1}
            number="10x"
            label="More 5-star Google reviews within your first month of use."
            icon={TrendingUp}
            numColor="#c084fc"
            bg="linear-gradient(145deg, #0f0a1e 0%, #0a0714 100%)"
            borderColor="rgba(155, 45, 242, 0.25)"
            gridColor="#9b2df2"
            gridOpacity={0.15}
            gridId="grid-purple"
          />
          <StatCard
            delay={0.2}
            number="95%"
            label="Of negative reviews intercepted privately, before they hit Google."
            icon={ShieldCheck}
            numColor="#ffffff"
            bg="#111218"
            borderColor="rgba(255,255,255,0.06)"
            gridColor="#ffffff"
            gridOpacity={0.04}
            gridId="grid-white-1"
          />
          <StatCard
            delay={0.3}
            number="3x"
            label="Average increase in monthly review volume after going live."
            icon={Zap}
            numColor="#ffffff"
            bg="#111218"
            borderColor="rgba(255,255,255,0.06)"
            gridColor="#ffffff"
            gridOpacity={0.04}
            gridId="grid-white-2"
          />
        </div>
      </div>
    </section>
  );
};

export default Stats;

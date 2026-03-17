import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// CSS illustration of a minimalist QR display stand on a counter
const StandIllustration = () => (
  <div style={{ position: 'relative', width: '220px', height: '240px', margin: '0 auto' }}>
    {/* Ambient glow behind stand */}
    <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: 'rgba(155,45,242,0.15)', filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none' }} />

    {/* Counter surface */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: '-40px',
      right: '-40px',
      height: '3px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      borderRadius: '2px',
    }} />
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: '-40px',
      right: '-40px',
      height: '40px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
      borderRadius: '0 0 12px 12px',
    }} />

    {/* Stand base */}
    <div style={{
      position: 'absolute',
      bottom: '38px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80px',
      height: '6px',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.12), rgba(255,255,255,0.05))',
      borderRadius: '3px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    }} />

    {/* Stand neck */}
    <div style={{
      position: 'absolute',
      bottom: '44px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '3px',
      height: '50px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.06))',
      borderRadius: '2px',
    }} />

    {/* Card body */}
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '140px',
      height: '180px',
      background: 'linear-gradient(145deg, #1a1a2e 0%, #12121f 100%)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '18px',
    }}>
      {/* Logo area */}
      <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.02em' }}>
        ★ <span style={{ background: 'linear-gradient(90deg, #2b58ff, #9b2df2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>StarFlow</span>
      </div>

      {/* QR code (simplified dots grid) */}
      <div style={{
        width: '72px',
        height: '72px',
        background: '#fff',
        borderRadius: '8px',
        padding: '7px',
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '1.5px',
      }}>
        {[
          1,1,1,0,1,1,1,
          1,0,1,0,1,0,1,
          1,1,1,0,1,1,1,
          0,1,0,1,0,1,0,
          1,1,1,0,1,0,1,
          1,0,0,0,0,1,1,
          1,1,1,0,1,1,1,
        ].map((c, i) => (
          <div key={i} style={{ background: c ? '#111' : '#fff', borderRadius: '1px' }} />
        ))}
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.52rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em' }}>Rate your experience</div>
        <div style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>Scan with your camera</div>
      </div>
    </div>
  </div>
);

const Hardware = () => {
  const navigate = useNavigate();

  return (
    <section style={{ padding: '80px 0 120px', position: 'relative' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: 'linear-gradient(145deg, #0d0d12 0%, #111218 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '32px',
            padding: '80px 40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background grid glow */}
          <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(155,45,242,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="pill-badge" style={{ marginBottom: '40px', display: 'inline-flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
              Coming Soon
            </span>

            <StandIllustration />

            <div style={{ marginTop: '48px', maxWidth: '520px', margin: '48px auto 0' }}>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: 1.2 }}>
                Premium hardware,<br />
                <span className="text-accent">professional results.</span>
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '36px' }}>
                We're perfecting our line of premium physical QR displays — elegant, minimalist stands built for coffee shops, restaurants, and boutiques. Sign up now to be first in line when our hardware drops.
              </p>
              <button
                onClick={() => navigate('/register')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  padding: '14px 28px',
                  borderRadius: '100px',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                Join the hardware waitlist →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hardware;

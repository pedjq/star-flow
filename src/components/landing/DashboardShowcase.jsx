import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, BarChart3, QrCode, Image as ImageIcon,
  Sparkles, LayoutDashboard, Settings, Send,
  TrendingUp, Shield, Star, RefreshCw,
} from 'lucide-react';

// Sidebar nav items (matches real dashboard)
const NAV = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Content Studio', icon: ImageIcon },
  { label: 'Responses', icon: MessageSquare },
  { label: 'QR Management', icon: QrCode },
  { label: 'Settings', icon: Settings },
];

const TABS = [
  { icon: MessageSquare, label: 'AI Responses', desc: 'Reply to every review in seconds', color: '#9b2df2', navIndex: 2 },
  { icon: BarChart3, label: 'Feedback Insights', desc: 'Track your reputation live', color: '#2b58ff', navIndex: 0 },
  { icon: QrCode, label: 'QR Management', desc: 'Deploy and track scan activity', color: '#5be78b', navIndex: 3 },
  { icon: ImageIcon, label: 'Content Studio', desc: 'Sync reviews and manage content', color: '#f4a017', navIndex: 1 },
];

// ─── Panel: AI Responses ────────────────────────────────────────────────────
const ResponsesPanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Review Responses</span>
      <span style={{ fontSize: '0.58rem', padding: '2px 8px', borderRadius: '100px', background: 'rgba(155,45,242,0.12)', border: '1px solid rgba(155,45,242,0.28)', color: '#c084fc' }}>2 pending</span>
    </div>

    {/* Card 1 – replied */}
    <div style={{ background: '#0f1015', border: '1px solid rgba(91,231,139,0.14)', borderRadius: '10px', padding: '10px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>Sarah M.</span>
        <span style={{ color: '#f4a017', fontSize: '9px', letterSpacing: '1px' }}>★★★★★</span>
        <span style={{ fontSize: '0.55rem', padding: '1px 6px', borderRadius: '100px', background: 'rgba(91,231,139,0.12)', border: '1px solid rgba(91,231,139,0.3)', color: '#5be78b', fontWeight: 700 }}>✦ Replied</span>
      </div>
      <p style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>"Absolutely loved the atmosphere. Will definitely be back!"</p>
    </div>

    {/* Card 2 – AI draft showing */}
    <div style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>James T.</span>
            <span style={{ color: '#f4a017', fontSize: '9px', letterSpacing: '1px' }}>★★★★★</span>
          </div>
          <p style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>"Best coffee in town, hands down. The baristas are true artists."</p>
        </div>
      </div>
      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.54rem', fontWeight: 700, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>AI Draft Reply</div>
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '7px 9px', fontSize: '0.62rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.55 }}>
          Thank you, James! We're so glad you enjoyed the experience. Our team puts their heart into every cup — your kind words mean the world to us! ☕
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '7px', gap: '5px' }}>
          <div style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', borderRadius: '5px', padding: '3px 8px', fontSize: '0.58rem', cursor: 'default' }}>Copy</div>
          <div style={{ background: 'linear-gradient(135deg, #2b58ff, #9b2df2)', color: '#fff', borderRadius: '100px', padding: '3px 10px', fontSize: '0.6rem', fontWeight: 600, cursor: 'default', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Send size={8} /> Mark as Sent
          </div>
        </div>
      </div>
    </div>

    {/* Card 3 – idle */}
    <div style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>Maria K.</span>
          <span style={{ color: '#f4a017', fontSize: '9px', letterSpacing: '1px' }}>★★★★★</span>
        </div>
        <p style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>"Staff was incredibly helpful and the food was delicious."</p>
      </div>
      <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)', padding: '3px 9px', borderRadius: '100px', fontSize: '0.6rem', cursor: 'default', display: 'flex', alignItems: 'center', gap: '3px' }}>
        <Sparkles size={8} /> Generate
      </div>
    </div>
  </div>
);

// ─── Panel: Feedback Insights ───────────────────────────────────────────────
const InsightsPanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Overview</span>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
      {[
        { label: 'Total Scans', value: '247', Icon: QrCode, color: '#9b2df2' },
        { label: 'Reviews Gained', value: '89', Icon: TrendingUp, color: '#5be78b' },
        { label: 'Intercepted', value: '23', Icon: Shield, color: '#2b58ff' },
        { label: 'Avg. Rating', value: '4.7 ★', Icon: Star, color: '#f4a017' },
      ].map(({ label, value, Icon, color }, i) => (
        <div key={i} style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '11px 13px' }}>
          <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Icon size={9} color={color} /> {label}
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>{value}</div>
        </div>
      ))}
    </div>
    <div>
      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '7px' }}>Recent Private Feedback</div>
      {[
        { stars: 2, text: 'Wait time was a bit long during peak hours', time: '2 days ago' },
        { stars: 3, text: 'Good food but the music was too loud for conversation', time: '4 days ago' },
      ].map((fb, i) => (
        <div key={i} style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px 10px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div>
            <span style={{ color: '#f4a017', fontSize: '9px' }}>{'★'.repeat(fb.stars)}{'☆'.repeat(5 - fb.stars)}</span>
            <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0', lineHeight: 1.45 }}>{fb.text}</p>
          </div>
          <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.22)', flexShrink: 0 }}>{fb.time}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Fake QR graphic ────────────────────────────────────────────────────────
const FakeQR = () => {
  const p = [
    1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,1,1,1,1,1,1,
    1,0,0,0,0,0,1,0,0,1,1,0,1,0,1,0,0,0,0,0,1,
    1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,0,0,1,1,0,0,1,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1,
    1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1,
    1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,
    0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,
    1,1,0,1,0,1,1,1,0,0,1,1,0,1,1,0,1,0,1,1,0,
    0,0,1,1,0,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,1,
    1,0,0,1,1,0,1,1,0,1,0,1,1,0,1,0,0,1,1,0,0,
    0,1,0,0,0,1,0,1,0,1,1,0,0,1,0,1,0,1,0,1,0,
    1,0,1,1,0,0,1,0,1,0,0,1,1,0,1,0,1,0,0,0,1,
    0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,
    1,1,1,1,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,0,1,
    1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,1,0,0,0,1,0,
    1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
    1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0,1,
    1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0,0,0,
    1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(21, 1fr)', gap: '1.5px', width: '96px', height: '96px', background: 'white', padding: '7px', borderRadius: '8px' }}>
      {p.map((cell, i) => <div key={i} style={{ background: cell ? '#000' : '#fff', borderRadius: '0.5px' }} />)}
    </div>
  );
};

// ─── Panel: QR Management ───────────────────────────────────────────────────
const QRPanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>QR Management</span>
    <div style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      <FakeQR />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.28)', marginBottom: '3px' }}>Scan URL</div>
        <div style={{ fontSize: '0.65rem', color: '#9b2df2', fontFamily: 'monospace' }}>starflow.app/rate/a1b2c3</div>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Download PNG', 'Download SVG', 'Copy Link'].map((label) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', padding: '4px 9px', borderRadius: '6px', fontSize: '0.58rem', cursor: 'default' }}>{label}</div>
        ))}
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
      {[{ label: 'Total Scans', value: '247' }, { label: 'This Week', value: '38' }].map(({ label, value }) => (
        <div key={label} style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>{value}</div>
          <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.32)', marginTop: '3px' }}>{label}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Panel: Content Studio ──────────────────────────────────────────────────
const ContentPanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Content Studio</span>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', padding: '3px 9px', borderRadius: '100px', fontSize: '0.6rem', cursor: 'default', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <RefreshCw size={8} /> Sync Reviews
      </div>
    </div>
    {[
      { name: 'Sarah M.', text: '"Absolutely loved the atmosphere. Will definitely be back!"', date: 'Mar 12' },
      { name: 'James T.', text: '"Best coffee in town, hands down. The baristas are true artists."', date: 'Mar 10' },
      { name: 'Maria K.', text: '"Staff was incredibly helpful and the food was delicious."', date: 'Mar 8' },
    ].map((r) => (
      <div key={r.name} style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>{r.name}</span>
            <span style={{ color: '#f4a017', fontSize: '9px', letterSpacing: '1px' }}>★★★★★</span>
            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.22)' }}>{r.date}</span>
          </div>
          <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.48)', margin: 0, lineHeight: 1.5 }}>{r.text}</p>
        </div>
        <div style={{ flexShrink: 0, background: 'linear-gradient(135deg, rgba(43,88,255,0.14), rgba(155,45,242,0.14))', border: '1px solid rgba(155,45,242,0.22)', color: '#c084fc', padding: '4px 9px', borderRadius: '7px', fontSize: '0.58rem', fontWeight: 500, cursor: 'default', whiteSpace: 'nowrap' }}>
          Create Post →
        </div>
      </div>
    ))}
  </div>
);

const PANELS = [<ResponsesPanel />, <InsightsPanel />, <QRPanel />, <ContentPanel />];

// ─── Main Component ─────────────────────────────────────────────────────────
const DashboardShowcase = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="dashboard" style={{ padding: '120px 0', position: 'relative' }}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <span className="pill-badge gradient" style={{ marginBottom: '20px', display: 'inline-flex' }}>Central Hub</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Your entire reputation<br />
            <span className="text-accent">in one central hub.</span>
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
            Manage Google reviews, private feedback, QR codes, and content — all from a single, beautiful dashboard.
          </p>
        </motion.div>

        {/* Tab selector */}
        <div className="showcase-tabs" style={{ marginBottom: '20px' }}>
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  background: isActive ? `rgba(${tab.color === '#9b2df2' ? '155,45,242' : tab.color === '#2b58ff' ? '43,88,255' : tab.color === '#5be78b' ? '91,231,139' : '244,160,23'}, 0.07)` : 'rgba(255,255,255,0.02)',
                  border: isActive ? `1px solid ${tab.color}44` : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
                  background: isActive ? `${tab.color}22` : 'rgba(255,255,255,0.05)',
                  border: isActive ? `1px solid ${tab.color}44` : '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <Icon size={15} color={isActive ? tab.color : 'rgba(255,255,255,0.35)'} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: isActive ? '#fff' : 'rgba(255,255,255,0.55)', marginBottom: '2px', transition: 'color 0.2s' }}>
                    {tab.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>
                    {tab.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dashboard frame */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#0b0c10',
            boxShadow: '0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {/* Browser chrome */}
          <div style={{ background: '#13141a', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['rgba(255,45,85,0.5)', 'rgba(255,160,0,0.5)', 'rgba(91,231,139,0.5)'].map((bg, i) => (
                <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: bg }} />
              ))}
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center', maxWidth: '240px', margin: '0 auto' }}>
              app.starflow.io/dashboard
            </div>
          </div>

          {/* Dashboard body */}
          <div style={{ display: 'flex', height: '420px' }}>

            {/* Sidebar */}
            <div style={{ width: '148px', flexShrink: 0, background: '#13141a', borderRight: '1px solid rgba(255,255,255,0.04)', padding: '16px 12px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.875rem', marginBottom: '24px', paddingLeft: '4px', letterSpacing: '-0.02em' }}>
                <div style={{ background: 'linear-gradient(135deg, #9b2df2, #2b58ff)', color: '#fff', padding: '4px', borderRadius: '50%' }}>
                  <Sparkles size={11} fill="currentColor" />
                </div>
                <span>Star.<span style={{ background: 'linear-gradient(90deg, #2b58ff, #9b2df2, #ff2d55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Flow</span></span>
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {NAV.map((item, i) => {
                  const isActive = i === TABS[active].navIndex;
                  const Icon = item.icon;
                  return (
                    <div key={item.label} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '7px 8px', borderRadius: '8px',
                      background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
                      fontSize: '0.7rem', fontWeight: isActive ? 600 : 400,
                      transition: 'all 0.2s',
                    }}>
                      <Icon size={13} color={isActive ? '#9b2df2' : 'inherit'} />
                      {item.label}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Content area */}
            <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '20px 22px', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {PANELS[active]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default DashboardShowcase;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  MessageSquare, BarChart3, QrCode,
  Sparkles, LayoutDashboard, Settings, Send,
  TrendingUp, Shield, Star, Zap,
} from 'lucide-react';

const NAV = [
  { label: 'Overview',      icon: LayoutDashboard },
  { label: 'Responses',     icon: MessageSquare },
  { label: 'QR Management', icon: QrCode },
  { label: 'Settings',      icon: Settings },
];

const TABS = [
  { icon: MessageSquare, label: 'AI Responses',     desc: 'Replies sent automatically — just approve', color: '#9b2df2', navIndex: 1 },
  { icon: BarChart3,    label: 'Feedback Insights', desc: 'Track your reputation live',                color: '#2b58ff', navIndex: 0 },
  { icon: QrCode,       label: 'QR Management',     desc: 'Design and customize your branded card',   color: '#5be78b', navIndex: 2 },
];

// ─── Panel: AI Responses ────────────────────────────────────────────────────
const ResponsesPanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Review Responses</span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.55rem', padding: '2px 7px', borderRadius: '100px', background: 'rgba(91,231,139,0.1)', border: '1px solid rgba(91,231,139,0.25)', color: '#5be78b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#5be78b', display: 'inline-block' }} /> Autopilot ON
        </span>
        <span style={{ fontSize: '0.58rem', padding: '2px 8px', borderRadius: '100px', background: 'rgba(155,45,242,0.12)', border: '1px solid rgba(155,45,242,0.28)', color: '#c084fc' }}>2 pending</span>
      </div>
    </div>

    {/* Card 1 – auto-replied */}
    <div style={{ background: '#0f1015', border: '1px solid rgba(91,231,139,0.14)', borderRadius: '10px', padding: '10px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>Sarah M.</span>
        <span style={{ color: '#f4a017', fontSize: '9px', letterSpacing: '1px' }}>★★★★★</span>
        <span style={{ fontSize: '0.55rem', padding: '1px 6px', borderRadius: '100px', background: 'rgba(91,231,139,0.12)', border: '1px solid rgba(91,231,139,0.3)', color: '#5be78b', fontWeight: 700 }}>✦ Auto-sent</span>
      </div>
      <p style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>"Absolutely loved the atmosphere. Will definitely be back!"</p>
    </div>

    {/* Card 2 – AI draft pending approval */}
    <div style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>James T.</span>
            <span style={{ color: '#f4a017', fontSize: '9px', letterSpacing: '1px' }}>★★★★★</span>
          </div>
          <p style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>"Best coffee in town, hands down."</p>
        </div>
      </div>
      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.54rem', fontWeight: 700, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>AI Draft — ready to send</div>
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '7px 9px', fontSize: '0.62rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.55 }}>
          Thank you, James! We're so glad you enjoyed the experience — your kind words mean the world to us! ☕
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '7px', gap: '5px' }}>
          <div style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', borderRadius: '5px', padding: '3px 8px', fontSize: '0.58rem', cursor: 'default' }}>Copy</div>
          <div style={{ background: 'linear-gradient(135deg, #2b58ff, #9b2df2)', color: '#fff', borderRadius: '100px', padding: '3px 10px', fontSize: '0.6rem', fontWeight: 600, cursor: 'default', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Send size={8} /> Approve &amp; Send
          </div>
        </div>
      </div>
    </div>

    {/* Card 3 */}
    <div style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>Maria K.</span>
          <span style={{ color: '#f4a017', fontSize: '9px', letterSpacing: '1px' }}>★★★★★</span>
        </div>
        <p style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>"Staff was incredibly helpful and the food was delicious."</p>
      </div>
      <div style={{ flexShrink: 0, background: 'rgba(155,45,242,0.08)', border: '1px solid rgba(155,45,242,0.2)', color: '#c084fc', padding: '3px 9px', borderRadius: '100px', fontSize: '0.6rem', cursor: 'default', display: 'flex', alignItems: 'center', gap: '3px' }}>
        <Sparkles size={8} /> Drafting...
      </div>
    </div>
  </div>
);

// ─── Panel: Feedback Insights ───────────────────────────────────────────────
const insightsMockData = [
  { date: 'Mar 11', positive: 3, negative: 1 },
  { date: 'Mar 12', positive: 5, negative: 2 },
  { date: 'Mar 13', positive: 4, negative: 1 },
  { date: 'Mar 14', positive: 7, negative: 0 },
  { date: 'Mar 15', positive: 6, negative: 2 },
  { date: 'Mar 16', positive: 9, negative: 1 },
  { date: 'Mar 17', positive: 8, negative: 0 },
];

const InsightsPanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>7-Day Engagement</span>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9b2df2', display: 'inline-block' }} /> 5-star
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff2d55', display: 'inline-block' }} /> intercepted
        </span>
      </div>
    </div>

    {/* Area Chart */}
    <div style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 8px 4px' }}>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={insightsMockData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="showcasePositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9b2df2" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#9b2df2" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="showcaseNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff2d55" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#ff2d55" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.28)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.28)' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.65rem', color: '#fff' }}
            labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
          />
          <Area type="monotone" dataKey="positive" name="5-star" stroke="#9b2df2" strokeWidth={1.5} fill="url(#showcasePositive)" dot={false} />
          <Area type="monotone" dataKey="negative" name="intercepted" stroke="#ff2d55" strokeWidth={1.5} fill="url(#showcaseNegative)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    {/* Stat row */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px' }}>
      {[
        { label: 'Total Scans', value: '247', color: '#9b2df2', Icon: QrCode },
        { label: 'Reviews +',  value: '89',  color: '#5be78b', Icon: TrendingUp },
        { label: 'Avg. Rating', value: '4.7★', color: '#f4a017', Icon: Star },
      ].map(({ label, value, color, Icon }, i) => (
        <div key={i} style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '9px', padding: '9px 10px' }}>
          <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.32)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Icon size={8} color={color} /> {label}
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>{value}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Fake QR ────────────────────────────────────────────────────────────────
const FakeQR = ({ size = 72 }) => {
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(21, 1fr)', gap: '1px', width: `${size}px`, height: `${size}px`, background: 'white', padding: '6px', borderRadius: '6px', flexShrink: 0 }}>
      {p.map((cell, i) => <div key={i} style={{ background: cell ? '#000' : '#fff', borderRadius: '0.5px' }} />)}
    </div>
  );
};

// ─── Panel: QR Management (with customization) ───────────────────────────────
const QRPanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>QR Card Designer</span>

    {/* Card preview */}
    <div style={{ background: 'linear-gradient(145deg, #1a0a2e, #0a0714)', border: '1px solid rgba(155,45,242,0.25)', borderRadius: '12px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
      <FakeQR size={68} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Triple S Barbers</div>
        <div style={{ fontSize: '0.56rem', color: 'rgba(255,255,255,0.38)', marginBottom: '7px' }}>Scan to rate your experience</div>
        <div style={{ fontSize: '0.54rem', color: '#9b2df2', fontFamily: 'monospace' }}>starscalehub.com/rate/a1b2</div>
      </div>
    </div>

    {/* Customization panel */}
    <div style={{ background: '#0f1015', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '11px 12px' }}>
      <div style={{ fontSize: '0.56rem', fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Customize</div>

      <div style={{ marginBottom: '9px' }}>
        <div style={{ fontSize: '0.59rem', color: 'rgba(255,255,255,0.38)', marginBottom: '5px' }}>Layout</div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['Portrait', 'Square', 'Landscape'].map((l, i) => (
            <div key={l} style={{ flex: 1, background: i === 0 ? 'rgba(155,45,242,0.14)' : 'rgba(255,255,255,0.03)', border: i === 0 ? '1px solid rgba(155,45,242,0.4)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '5px', padding: '4px', textAlign: 'center', fontSize: '0.54rem', color: i === 0 ? '#c084fc' : 'rgba(255,255,255,0.28)', cursor: 'default' }}>{l}</div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '9px' }}>
        <div style={{ fontSize: '0.59rem', color: 'rgba(255,255,255,0.38)', marginBottom: '5px' }}>Background</div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {['#0f0a1e', '#1a0a2e', '#fff', '#111827', '#fafaf9'].map((c, i) => (
            <div key={i} style={{ width: '18px', height: '18px', borderRadius: '4px', background: c, border: i === 0 ? '2px solid #9b2df2' : '1px solid rgba(255,255,255,0.1)', cursor: 'default', flexShrink: 0 }} />
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.59rem', color: 'rgba(255,255,255,0.38)', marginBottom: '5px' }}>Font Style</div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['Modern', 'Rounded', 'Elegant', 'Bold'].map((f, i) => (
            <div key={f} style={{ flex: 1, background: i === 0 ? 'rgba(155,45,242,0.1)' : 'rgba(255,255,255,0.02)', border: i === 0 ? '1px solid rgba(155,45,242,0.3)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', padding: '3px', textAlign: 'center', fontSize: '0.52rem', color: i === 0 ? '#c084fc' : 'rgba(255,255,255,0.22)', cursor: 'default' }}>{f}</div>
          ))}
        </div>
      </div>
    </div>

    <div style={{ background: 'linear-gradient(135deg, #9b2df2, #2b58ff)', color: '#fff', borderRadius: '8px', padding: '8px 14px', textAlign: 'center', fontSize: '0.63rem', fontWeight: 600, cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
      <Zap size={11} /> Download Print-Ready PNG
    </div>
  </div>
);

const PANELS = [<ResponsesPanel />, <InsightsPanel />, <QRPanel />];

// ─── Main Component ─────────────────────────────────────────────────────────
const DashboardShowcase = () => {
  const [active, setActive] = useState(0);

  const colorRgb = (color) => {
    if (color === '#9b2df2') return '155,45,242';
    if (color === '#2b58ff') return '43,88,255';
    if (color === '#5be78b') return '91,231,139';
    return '255,255,255';
  };

  return (
    <section id="dashboard" style={{ padding: '120px 0', position: 'relative' }}>
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Your entire reputation<br />
            <span className="text-accent">in one central hub.</span>
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
            Manage Google reviews, private feedback, and custom QR codes — all from a single beautiful dashboard.
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
                  background: isActive ? `rgba(${colorRgb(tab.color)}, 0.07)` : 'rgba(255,255,255,0.02)',
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
              app.starscalehub.com/dashboard
            </div>
          </div>

          {/* Dashboard body */}
          <div className="showcase-body" style={{ display: 'flex', height: '420px' }}>
            {/* Sidebar */}
            <div className="showcase-sidebar" style={{ width: '148px', flexShrink: 0, background: '#13141a', borderRight: '1px solid rgba(255,255,255,0.04)', padding: '16px 12px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.875rem', marginBottom: '24px', paddingLeft: '4px', letterSpacing: '-0.02em' }}>
                <div style={{ background: 'linear-gradient(135deg, #9b2df2, #2b58ff)', color: '#fff', padding: '4px', borderRadius: '50%' }}>
                  <Sparkles size={11} fill="currentColor" />
                </div>
                <span>StarScale<span style={{ background: 'linear-gradient(90deg, #2b58ff, #9b2df2, #ff2d55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hub</span></span>
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

import { useState, useRef, useEffect, forwardRef } from 'react';
import { QRCode } from 'react-qr-code';
import { Download, ShoppingBag, Upload, X, RotateCcw } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useShop } from '../../hooks/useShop';

// ─── Constants ───────────────────────────────────────────────────────────────
const LAYOUTS = {
  portrait:  { label: 'Portrait',  sub: 'Table Stand',    w: 264, h: 380, qr: 148 },
  square:    { label: 'Square',    sub: 'Sticker',        w: 280, h: 280, qr: 162 },
  landscape: { label: 'Landscape', sub: 'Business Card',  w: 420, h: 224, qr: 130 },
};

const FONTS = [
  { id: 'Space Grotesk',    label: 'Modern' },
  { id: 'Poppins',          label: 'Rounded' },
  { id: 'Playfair Display', label: 'Elegant' },
  { id: 'Bebas Neue',       label: 'Bold' },
  { id: 'Dancing Script',   label: 'Script' },
];

const DEFAULTS = {
  bgColor: '#141014', accentColor: '#d4b483',
  mainLabel: 'Leave us a review on Google',
  subLabel: 'Scan to share your experience',
  layout: 'portrait', font: 'Space Grotesk',
};

// ─── Print Card ──────────────────────────────────────────────────────────────
const PrintCard = forwardRef(({ layout, bgColor, accentColor, mainLabel, subLabel, logo, qrUrl, shopName, font }, ref) => {
  const { w, h, qr: qrSize } = LAYOUTS[layout];
  const isLandscape = layout === 'landscape';
  const isSquare = layout === 'square';

  const logoEl = logo
    ? <img src={logo} alt="logo" style={{ maxWidth: isLandscape ? '72px' : isSquare ? '64px' : '90px', maxHeight: isLandscape ? '38px' : isSquare ? '34px' : '48px', objectFit: 'contain' }} />
    : <div style={{ fontSize: isLandscape ? '0.75rem' : isSquare ? '0.7rem' : '0.85rem', fontWeight: 700, color: accentColor }}>{shopName || 'YOUR LOGO'}</div>;

  return (
    <div ref={ref} style={{
      width: `${w}px`, height: `${h}px`, background: bgColor,
      borderRadius: isSquare ? '24px' : '18px',
      display: 'flex', flexDirection: isLandscape ? 'row' : 'column',
      alignItems: 'center', justifyContent: isLandscape ? 'space-evenly' : 'center',
      padding: isLandscape ? '20px 28px' : isSquare ? '20px' : '28px 22px',
      gap: isLandscape ? '0' : isSquare ? '10px' : '14px',
      fontFamily: `'${font}', system-ui, sans-serif`,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
      flexShrink: 0,
    }}>
      {isLandscape ? (
        <>
          <QRCode value={qrUrl || 'https://starflow.app'} size={qrSize} fgColor={accentColor} bgColor={bgColor} style={{ display: 'block', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingLeft: '4px', maxWidth: '180px' }}>
            {logoEl}
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: accentColor, lineHeight: 1.3 }}>{mainLabel}</div>
            <div style={{ fontSize: '0.45rem', color: accentColor, opacity: 0.6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{subLabel}</div>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isSquare ? '32px' : '46px' }}>{logoEl}</div>
          {!isSquare && (
            <div style={{ fontSize: '1rem', fontWeight: 700, color: accentColor, textAlign: 'center', lineHeight: 1.3, maxWidth: '88%' }}>{mainLabel}</div>
          )}
          <QRCode value={qrUrl || 'https://starflow.app'} size={qrSize} fgColor={accentColor} bgColor={bgColor} style={{ display: 'block', flexShrink: 0 }} />
          <div style={{ fontSize: isSquare ? '0.44rem' : '0.5rem', color: accentColor, textAlign: 'center', opacity: 0.62, letterSpacing: '0.1em', textTransform: 'uppercase', maxWidth: '88%', lineHeight: 1.5 }}>{subLabel}</div>
        </>
      )}
    </div>
  );
});
PrintCard.displayName = 'PrintCard';

// ─── Sub-components ───────────────────────────────────────────────────────────
const ColorSwatch = ({ label, value, onChange }) => (
  <div>
    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '7px', fontWeight: 500 }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', border: 'none', padding: 0 }} />
        <div style={{ width: '36px', height: '36px', background: value, borderRadius: '9px', border: '1.5px solid rgba(255,255,255,0.14)', cursor: 'pointer' }} />
      </div>
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '7px', padding: '5px 10px' }}>
        {value.toUpperCase()}
      </div>
    </div>
  </div>
);

const FieldInput = ({ label, value, onChange, placeholder, maxLength }) => (
  <div>
    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '7px', fontWeight: 500 }}>{label}</div>
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
      style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '9px 13px', color: '#fff', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
      onFocus={e => e.target.style.borderColor = 'rgba(155,45,242,0.5)'}
      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
  </div>
);

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '12px' }}>
    {children}
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const QRManagement = () => {
  const cardRef = useRef(null);
  const logoInputRef = useRef(null);
  const { shop, loading } = useShop();
  const qrUrl = shop ? `${window.location.origin}/rate/${shop.id}` : '';

  const [layout, setLayout] = useState(DEFAULTS.layout);
  const [bgColor, setBgColor] = useState(DEFAULTS.bgColor);
  const [accentColor, setAccentColor] = useState(DEFAULTS.accentColor);
  const [mainLabel, setMainLabel] = useState(DEFAULTS.mainLabel);
  const [subLabel, setSubLabel] = useState(DEFAULTS.subLabel);
  const [font, setFont] = useState(DEFAULTS.font);
  const [logo, setLogo] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (font === 'Space Grotesk') return;
    const id = `gf-${font.replace(/\s/g, '-')}`;
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id; link.rel = 'stylesheet';
      const w = font === 'Bebas Neue' ? '' : ':wght@400;600;700';
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s/g, '+')}${w}&display=swap`;
      document.head.appendChild(link);
    }
  }, [font]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setLayout(DEFAULTS.layout); setBgColor(DEFAULTS.bgColor);
    setAccentColor(DEFAULTS.accentColor); setMainLabel(DEFAULTS.mainLabel);
    setSubLabel(DEFAULTS.subLabel); setFont(DEFAULTS.font); setLogo(null);
  };

  const handleDownloadQROnly = () => {
    const svgEl = cardRef.current?.querySelector('svg');
    if (!svgEl) return;
    let svgStr = new XMLSerializer().serializeToString(svgEl);
    // Force black-on-white for maximum scanner compatibility
    svgStr = svgStr.split(accentColor.toLowerCase()).join('#000000')
                   .split(accentColor.toUpperCase()).join('#000000')
                   .split(bgColor.toLowerCase()).join('#ffffff')
                   .split(bgColor.toUpperCase()).join('#ffffff');
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StarFlow-QR.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 6, cacheBust: true });
      const link = document.createElement('a');
      link.download = `StarFlow-QR-${shop?.name?.replace(/\s+/g, '-') || 'card'}.png`;
      link.href = dataUrl; link.click();
    } catch (err) { console.error(err); }
    finally { setDownloading(false); }
  };

  const contrastWarning = (() => {
    const hex = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const lum = ([r,g,b]) => { const s = [r,g,b].map(c => { const n=c/255; return n<=0.03928?n/12.92:((n+0.055)/1.055)**2.4; }); return 0.2126*s[0]+0.7152*s[1]+0.0722*s[2]; };
    const l1 = lum(hex(accentColor)), l2 = lum(hex(bgColor));
    return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05) < 3;
  })();

  if (loading) return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>QR Management</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Loading your QR code...</p>
    </div>
  );

  if (!shop) return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>QR Management</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Design and download your custom QR card.</p>
      <div className="stakent-card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        Please complete your <a href="/dashboard/settings" style={{ color: '#fff' }}>Shop Settings</a> first.
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>QR Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Design your custom QR card and download a print-ready file.</p>
        </div>
        <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', padding: '8px 14px', borderRadius: '10px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <div className="qr-designer-grid" style={{ marginBottom: '24px' }}>

        {/* Left — Preview */}
        <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.09em', alignSelf: 'flex-start' }}>Live Preview</div>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
            <PrintCard ref={cardRef} layout={layout} bgColor={bgColor} accentColor={accentColor} mainLabel={mainLabel} subLabel={subLabel} logo={logo} qrUrl={qrUrl} shopName={shop?.name} font={font} />
          </div>
          <button onClick={handleDownload} disabled={downloading} className="stakent-btn primary" style={{ width: '100%', padding: '14px', fontSize: '0.9375rem', opacity: downloading ? 0.7 : 1 }}>
            <Download size={16} /> {downloading ? 'Generating...' : 'Download Print-Ready PNG'}
          </button>
          <button onClick={handleDownloadQROnly} className="stakent-btn" style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}>
            <Download size={15} /> Download QR Only (SVG)
          </button>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.22)', textAlign: 'center', margin: 0 }}>
            Exports at 6× resolution — print-ready at 300 DPI
          </p>
        </div>

        {/* Right — Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Layout */}
          <div className="stakent-card">
            <SectionLabel>Layout Preset</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {Object.entries(LAYOUTS).map(([id, { label, sub }]) => (
                <button key={id} onClick={() => setLayout(id)} style={{ background: layout === id ? 'rgba(155,45,242,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${layout === id ? 'rgba(155,45,242,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '10px', padding: '10px 8px', cursor: 'pointer', color: layout === id ? '#c084fc' : 'rgba(255,255,255,0.5)', textAlign: 'center', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '2px' }}>{sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Logo + Labels */}
          <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SectionLabel>Logo & Text</SectionLabel>
            {logo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                <img src={logo} alt="logo" style={{ maxWidth: '56px', maxHeight: '32px', objectFit: 'contain' }} />
                <div style={{ flex: 1, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Logo uploaded</div>
                <button onClick={() => setLogo(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '2px', display: 'flex' }}><X size={14} /></button>
              </div>
            ) : (
              <>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                <button onClick={() => logoInputRef.current?.click()} style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px', padding: '13px', color: 'rgba(255,255,255,0.38)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', fontSize: '0.85rem', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(155,45,242,0.35)'; e.currentTarget.style.color='rgba(255,255,255,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(255,255,255,0.38)'; }}>
                  <Upload size={14} /> Upload Logo
                </button>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.22)', marginTop: '-8px' }}>PNG with transparent background works best</div>
              </>
            )}
            <FieldInput label="Main Label" value={mainLabel} onChange={setMainLabel} placeholder="Leave us a review on Google" maxLength={60} />
            <FieldInput label="Sub Label" value={subLabel} onChange={setSubLabel} placeholder="Scan to share your experience" maxLength={80} />
          </div>

          {/* Font */}
          <div className="stakent-card">
            <SectionLabel>Typography</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {FONTS.map(f => (
                <button key={f.id} onClick={() => setFont(f.id)} style={{ background: font === f.id ? 'rgba(155,45,242,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${font === f.id ? 'rgba(155,45,242,0.35)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', color: font === f.id ? '#c084fc' : 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  <span style={{ fontFamily: `'${f.id}', system-ui, sans-serif` }}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SectionLabel>Colors</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <ColorSwatch label="Background" value={bgColor} onChange={setBgColor} />
              <ColorSwatch label="Text & QR Color" value={accentColor} onChange={setAccentColor} />
            </div>
            {contrastWarning && (
              <div style={{ background: 'rgba(255,160,0,0.07)', border: '1px solid rgba(255,160,0,0.2)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.72rem', color: 'rgba(255,200,80,0.8)' }}>
                ⚠ Low contrast — QR code may not scan reliably
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Physical Displays — Coming Soon */}
      <div className="stakent-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1.125rem' }}>Order Physical Displays</h3>
          <span style={{ fontSize: '0.65rem', padding: '3px 9px', borderRadius: '100px', background: 'rgba(155,45,242,0.12)', border: '1px solid rgba(155,45,242,0.28)', color: '#c084fc', fontWeight: 700 }}>Coming Soon</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.875rem' }}>
          Premium acrylic stands and NFC-enabled stickers — launching soon.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.4, pointerEvents: 'none', marginBottom: '16px' }}>
          {[{ name: 'Acrylic Check-out Stand', sub: 'NFC + QR Combo', price: '$29.99' }, { name: 'Vinyl Window Stickers (x5)', sub: 'Weather-proof', price: '$14.99' }].map(item => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.sub}</div></div>
              <div style={{ fontWeight: 600 }}>{item.price}</div>
            </div>
          ))}
        </div>
        <button disabled className="stakent-btn" style={{ padding: '11px 18px', fontSize: '0.875rem', opacity: 0.35, cursor: 'not-allowed' }}>
          <ShoppingBag size={15} /> Notify Me When Available
        </button>
      </div>
    </div>
  );
};

export default QRManagement;

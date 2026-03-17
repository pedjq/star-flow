import { useState, useRef, useMemo, useEffect, forwardRef } from 'react';
import QRCodeLib from 'qrcode';
import { Download, ShoppingBag, Upload, X, RotateCcw } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useShop } from '../../hooks/useShop';

// ─── Google G logo as SVG data URL ──────────────────────────────────────────
const GOOGLE_G_XML = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7z"/></svg>`;
const GOOGLE_G_URL = `data:image/svg+xml,${encodeURIComponent(GOOGLE_G_XML)}`;

// ─── Constants ───────────────────────────────────────────────────────────────
const LAYOUTS = {
  portrait:  { label: 'Portrait',  sub: 'Table Stand',    w: 264, h: 380, qr: 148 },
  square:    { label: 'Square',    sub: 'Sticker',        w: 280, h: 280, qr: 162 },
  landscape: { label: 'Landscape', sub: 'Business Card',  w: 420, h: 224, qr: 130 },
};

const DOT_STYLES = [
  { id: 'square',  label: 'Classic' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'dots',    label: 'Dots' },
];

const FONTS = [
  { id: 'Space Grotesk',    label: 'Modern' },
  { id: 'Poppins',          label: 'Rounded' },
  { id: 'Playfair Display', label: 'Elegant' },
  { id: 'Bebas Neue',       label: 'Bold' },
  { id: 'Dancing Script',   label: 'Script' },
];

const GRADIENT_DIRS = [
  { id: '180deg', label: '↓' },
  { id: '135deg', label: '↘' },
  { id: '90deg',  label: '→' },
  { id: '45deg',  label: '↗' },
];

const DEFAULTS = {
  bgColor: '#141014', accentColor: '#d4b483',
  mainLabel: 'Leave us a review on Google',
  subLabel: 'Scan to share your experience',
  layout: 'portrait', dotStyle: 'square', font: 'Space Grotesk',
  showGoogleG: true, gradientEnabled: false,
  bgColor2: '#2d1a42', gradientDir: '135deg',
};

// ─── Custom SVG QR renderer ──────────────────────────────────────────────────
const CustomQR = ({ value, size, fgColor, bgColor, dotStyle, showGoogleG }) => {
  const matrix = useMemo(() => {
    if (!value) return null;
    try {
      const qr = QRCodeLib.create(value, { errorCorrectionLevel: 'H' });
      return { data: qr.modules.data, count: qr.modules.size };
    } catch { return null; }
  }, [value]);

  if (!matrix) return <div style={{ width: size, height: size, background: bgColor }} />;

  const { data, count } = matrix;
  const mod = size / count;
  const gSize = size * 0.21;
  const gPad = mod * 1.8;
  const gOff = (size - gSize) / 2;

  const dots = [];
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      // qrcode BitMatrix: bit 0 = module value
      if (!((data[row * count + col] & 1) === 1)) continue;

      const cx = col * mod + mod / 2;
      const cy = row * mod + mod / 2;

      // Skip center area for Google G
      if (showGoogleG && cx > gOff - gPad && cx < gOff + gSize + gPad && cy > gOff - gPad && cy < gOff + gSize + gPad) continue;

      if (dotStyle === 'dots') {
        dots.push(<circle key={`${col}-${row}`} cx={cx} cy={cy} r={mod * 0.43} fill={fgColor} />);
      } else if (dotStyle === 'rounded') {
        const pad = mod * 0.1;
        dots.push(<rect key={`${col}-${row}`} x={col * mod + pad} y={row * mod + pad} width={mod - pad * 2} height={mod - pad * 2} rx={mod * 0.3} fill={fgColor} />);
      } else {
        dots.push(<rect key={`${col}-${row}`} x={col * mod} y={row * mod} width={mod} height={mod} fill={fgColor} />);
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', flexShrink: 0 }}>
      <rect width={size} height={size} fill={bgColor} />
      {dots}
      {showGoogleG && (
        <>
          <rect x={gOff - gPad / 2} y={gOff - gPad / 2} width={gSize + gPad} height={gSize + gPad} rx={mod} fill={bgColor} />
          <image href={GOOGLE_G_URL} x={gOff} y={gOff} width={gSize} height={gSize} />
        </>
      )}
    </svg>
  );
};

// ─── Print Card ──────────────────────────────────────────────────────────────
const PrintCard = forwardRef(({ layout, bgColor, bgColor2, gradientEnabled, gradientDir, accentColor, mainLabel, subLabel, logo, qrUrl, shopName, font, dotStyle, showGoogleG }, ref) => {
  const { w, h, qr: qrSize } = LAYOUTS[layout];
  const bg = gradientEnabled ? `linear-gradient(${gradientDir}, ${bgColor}, ${bgColor2})` : bgColor;
  const isLandscape = layout === 'landscape';
  const isSquare = layout === 'square';

  const logoEl = logo
    ? <img src={logo} alt="logo" style={{ maxWidth: isLandscape ? '72px' : isSquare ? '64px' : '90px', maxHeight: isLandscape ? '38px' : isSquare ? '34px' : '48px', objectFit: 'contain' }} />
    : <div style={{ fontSize: isLandscape ? '0.75rem' : isSquare ? '0.7rem' : '0.85rem', fontWeight: 700, color: accentColor, letterSpacing: '-0.01em' }}>{shopName || 'YOUR LOGO'}</div>;

  return (
    <div ref={ref} style={{
      width: `${w}px`, height: `${h}px`, background: bg,
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
          <CustomQR value={qrUrl || 'https://starflow.app'} size={qrSize} fgColor={accentColor} bgColor={bgColor} dotStyle={dotStyle} showGoogleG={showGoogleG} />
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
          <CustomQR value={qrUrl || 'https://starflow.app'} size={qrSize} fgColor={accentColor} bgColor={bgColor} dotStyle={dotStyle} showGoogleG={showGoogleG} />
          <div style={{ fontSize: isSquare ? '0.44rem' : '0.5rem', color: accentColor, textAlign: 'center', opacity: 0.62, letterSpacing: '0.1em', textTransform: 'uppercase', maxWidth: '88%', lineHeight: 1.5 }}>{subLabel}</div>
        </>
      )}
    </div>
  );
});
PrintCard.displayName = 'PrintCard';

// ─── Small sub-components ────────────────────────────────────────────────────
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
  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '10px' }}>
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
  const [dotStyle, setDotStyle] = useState(DEFAULTS.dotStyle);
  const [showGoogleG, setShowGoogleG] = useState(DEFAULTS.showGoogleG);
  const [gradientEnabled, setGradientEnabled] = useState(DEFAULTS.gradientEnabled);
  const [bgColor2, setBgColor2] = useState(DEFAULTS.bgColor2);
  const [gradientDir, setGradientDir] = useState(DEFAULTS.gradientDir);
  const [logo, setLogo] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Load Google Font when selected
  useEffect(() => {
    if (font === 'Space Grotesk') return;
    const id = `gf-${font.replace(/\s/g, '-')}`;
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      const weights = font === 'Bebas Neue' ? '' : ':wght@400;600;700';
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s/g, '+')}${weights}&display=swap`;
      document.head.appendChild(link);
    }
  }, [font]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    Object.entries(DEFAULTS).forEach(([k, v]) => {
      ({ layout: setLayout, bgColor: setBgColor, accentColor: setAccentColor, mainLabel: setMainLabel, subLabel: setSubLabel, font: setFont, dotStyle: setDotStyle, showGoogleG: setShowGoogleG, gradientEnabled: setGradientEnabled, bgColor2: setBgColor2, gradientDir: setGradientDir })[k]?.(v);
    });
    setLogo(null);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 6, cacheBust: true });
      const link = document.createElement('a');
      link.download = `StarFlow-QR-${shop?.name?.replace(/\s+/g, '-') || 'card'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) { console.error('Download failed:', err); }
    finally { setDownloading(false); }
  };

  // Contrast check
  const contrastWarning = (() => {
    const hex = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const lum = ([r,g,b]) => { const s = [r,g,b].map(c => { const n = c/255; return n<=0.03928?n/12.92:((n+0.055)/1.055)**2.4; }); return 0.2126*s[0]+0.7152*s[1]+0.0722*s[2]; };
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
        Please complete your <a href="/dashboard/settings" style={{ color: '#fff' }}>Shop Settings</a> first to generate your QR code.
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>QR Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Design your custom QR card and download a print-ready file.</p>
        </div>
        <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', padding: '8px 14px', borderRadius: '10px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Designer grid */}
      <div className="qr-designer-grid" style={{ marginBottom: '24px' }}>

        {/* Left — Preview */}
        <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.09em', alignSelf: 'flex-start' }}>Live Preview</div>

          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
            <PrintCard
              ref={cardRef}
              layout={layout} bgColor={bgColor} bgColor2={bgColor2}
              gradientEnabled={gradientEnabled} gradientDir={gradientDir}
              accentColor={accentColor} mainLabel={mainLabel} subLabel={subLabel}
              logo={logo} qrUrl={qrUrl} shopName={shop?.name}
              font={font} dotStyle={dotStyle} showGoogleG={showGoogleG}
            />
          </div>

          <button onClick={handleDownload} disabled={downloading} className="stakent-btn primary" style={{ width: '100%', padding: '14px', fontSize: '0.9375rem', opacity: downloading ? 0.7 : 1 }}>
            <Download size={16} />
            {downloading ? 'Generating...' : 'Download Print-Ready PNG'}
          </button>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.22)', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
            Exports at 6× resolution (~300 DPI). PNG is the recommended format for print shops — universally accepted and embeds your logo perfectly.
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

            {/* Logo upload */}
            {logo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                <img src={logo} alt="logo" style={{ maxWidth: '56px', maxHeight: '32px', objectFit: 'contain' }} />
                <div style={{ flex: 1, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Logo uploaded</div>
                <button onClick={() => setLogo(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '2px', display: 'flex' }}>
                  <X size={14} />
                </button>
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
                <button key={f.id} onClick={() => setFont(f.id)} style={{ background: font === f.id ? 'rgba(155,45,242,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${font === f.id ? 'rgba(155,45,242,0.35)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: font === f.id ? '#c084fc' : 'rgba(255,255,255,0.5)', fontFamily: `'${f.id}', system-ui`, fontSize: '0.8rem', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                  <span style={{ fontFamily: `'${f.id}', system-ui, sans-serif` }}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* QR Code Style */}
          <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SectionLabel>QR Code Style</SectionLabel>
            <div style={{ display: 'flex', gap: '8px' }}>
              {DOT_STYLES.map(s => (
                <button key={s.id} onClick={() => setDotStyle(s.id)} style={{ flex: 1, background: dotStyle === s.id ? 'rgba(155,45,242,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${dotStyle === s.id ? 'rgba(155,45,242,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '9px', padding: '10px 6px', cursor: 'pointer', color: dotStyle === s.id ? '#c084fc' : 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.2s' }}>
                  {s.label}
                </button>
              ))}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div onClick={() => setShowGoogleG(v => !v)} style={{ width: '36px', height: '20px', borderRadius: '100px', background: showGoogleG ? 'rgba(155,45,242,0.6)' : 'rgba(255,255,255,0.08)', border: `1px solid ${showGoogleG ? 'rgba(155,45,242,0.8)' : 'rgba(255,255,255,0.12)'}`, position: 'relative', transition: 'all 0.2s', flexShrink: 0, cursor: 'pointer' }}>
                <div style={{ position: 'absolute', top: '2px', left: showGoogleG ? '17px' : '2px', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Google G in center</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)' }}>Makes it clear where the QR leads</div>
              </div>
            </label>
          </div>

          {/* Colors */}
          <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SectionLabel>Colors</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <ColorSwatch label="Background" value={bgColor} onChange={setBgColor} />
              <ColorSwatch label="Text & QR Color" value={accentColor} onChange={setAccentColor} />
            </div>

            {/* Gradient toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div onClick={() => setGradientEnabled(v => !v)} style={{ width: '36px', height: '20px', borderRadius: '100px', background: gradientEnabled ? 'rgba(155,45,242,0.6)' : 'rgba(255,255,255,0.08)', border: `1px solid ${gradientEnabled ? 'rgba(155,45,242,0.8)' : 'rgba(255,255,255,0.12)'}`, position: 'relative', transition: 'all 0.2s', flexShrink: 0, cursor: 'pointer' }}>
                <div style={{ position: 'absolute', top: '2px', left: gradientEnabled ? '17px' : '2px', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Gradient background</span>
            </label>

            {gradientEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <ColorSwatch label="Gradient End" value={bgColor2} onChange={setBgColor2} />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '7px', fontWeight: 500 }}>Direction</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {GRADIENT_DIRS.map(d => (
                        <button key={d.id} onClick={() => setGradientDir(d.id)} style={{ flex: 1, background: gradientDir === d.id ? 'rgba(155,45,242,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${gradientDir === d.id ? 'rgba(155,45,242,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '7px', padding: '7px 4px', cursor: 'pointer', color: gradientDir === d.id ? '#c084fc' : 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Gradient preview bar */}
                <div style={{ height: '8px', borderRadius: '100px', background: `linear-gradient(${gradientDir}, ${bgColor}, ${bgColor2})`, border: '1px solid rgba(255,255,255,0.06)' }} />
              </div>
            )}

            {contrastWarning && (
              <div style={{ background: 'rgba(255,160,0,0.07)', border: '1px solid rgba(255,160,0,0.2)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.72rem', color: 'rgba(255,200,80,0.8)' }}>
                ⚠ Low contrast — QR code may not scan reliably
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Physical Displays — Coming Soon */}
      <div className="stakent-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1.125rem' }}>Order Physical Displays</h3>
          <span style={{ fontSize: '0.65rem', padding: '3px 9px', borderRadius: '100px', background: 'rgba(155,45,242,0.12)', border: '1px solid rgba(155,45,242,0.28)', color: '#c084fc', fontWeight: 700 }}>Coming Soon</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.875rem' }}>
          Premium acrylic stands and NFC-enabled stickers for your checkout counter — launching soon.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.4, pointerEvents: 'none' }}>
          {[{ name: 'Acrylic Check-out Stand', sub: 'NFC + QR Combo', price: '$29.99' }, { name: 'Vinyl Window Stickers (x5)', sub: 'Weather-proof', price: '$14.99' }].map(item => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.sub}</div></div>
              <div style={{ fontWeight: 600 }}>{item.price}</div>
            </div>
          ))}
        </div>
        <button disabled className="stakent-btn" style={{ marginTop: '16px', padding: '11px 18px', fontSize: '0.875rem', opacity: 0.35, cursor: 'not-allowed' }}>
          <ShoppingBag size={15} /> Notify Me When Available
        </button>
      </div>
    </div>
  );
};

export default QRManagement;

import { useState, useRef, forwardRef } from 'react';
import { QRCode } from 'react-qr-code';
import { Download, ShoppingBag, Upload, X, RotateCcw } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useShop } from '../../hooks/useShop';

const DEFAULTS = {
  bgColor: '#141014',
  accentColor: '#d4b483',
  mainLabel: 'Leave us a review on Google',
  subLabel: 'Scan the QR code to share your experience',
};

// ─── Print Card (the downloadable card design) ──────────────────────────────
const PrintCard = forwardRef(({ bgColor, accentColor, mainLabel, subLabel, logo, qrUrl, shopName }, ref) => (
  <div
    ref={ref}
    style={{
      width: '264px',
      background: bgColor,
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 24px 28px',
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
    }}
  >
    {/* Logo area */}
    <div style={{ marginBottom: '18px', minHeight: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {logo ? (
        <img src={logo} alt="logo" style={{ maxWidth: '96px', maxHeight: '56px', objectFit: 'contain' }} />
      ) : (
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: accentColor, letterSpacing: '-0.01em', textAlign: 'center' }}>
          {shopName || 'YOUR LOGO'}
        </div>
      )}
    </div>

    {/* Main label */}
    <div style={{
      fontSize: '1.05rem',
      fontWeight: 700,
      color: accentColor,
      textAlign: 'center',
      lineHeight: 1.35,
      marginBottom: '20px',
      maxWidth: '190px',
    }}>
      {mainLabel}
    </div>

    {/* QR Code */}
    <div style={{ marginBottom: '18px' }}>
      <QRCode
        value={qrUrl || 'https://starflow.app'}
        size={148}
        fgColor={accentColor}
        bgColor={bgColor}
        style={{ display: 'block' }}
      />
    </div>

    {/* Sub label */}
    <div style={{
      fontSize: '0.5rem',
      color: accentColor,
      textAlign: 'center',
      opacity: 0.65,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      fontWeight: 500,
      maxWidth: '170px',
      lineHeight: 1.5,
    }}>
      {subLabel}
    </div>
  </div>
));
PrintCard.displayName = 'PrintCard';

// ─── Color picker swatch ────────────────────────────────────────────────────
const ColorSwatch = ({ label, value, onChange }) => (
  <div>
    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: '8px', fontWeight: 500 }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', border: 'none', padding: 0 }}
        />
        <div style={{ width: '38px', height: '38px', background: value, borderRadius: '10px', border: '1.5px solid rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'border-color 0.2s' }} />
      </div>
      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '7px', padding: '6px 12px' }}>
        {value.toUpperCase()}
      </div>
    </div>
  </div>
);

// ─── Text input field ────────────────────────────────────────────────────────
const FieldInput = ({ label, value, onChange, placeholder, maxLength }) => (
  <div>
    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: '8px', fontWeight: 500 }}>{label}</div>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        padding: '10px 14px',
        color: '#fff',
        fontSize: '0.875rem',
        outline: 'none',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
      }}
      onFocus={e => e.target.style.borderColor = 'rgba(155,45,242,0.5)'}
      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
    />
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const QRManagement = () => {
  const cardRef = useRef(null);
  const logoInputRef = useRef(null);
  const { shop, loading } = useShop();
  const qrUrl = shop ? `${window.location.origin}/rate/${shop.id}` : '';

  const [bgColor, setBgColor] = useState(DEFAULTS.bgColor);
  const [accentColor, setAccentColor] = useState(DEFAULTS.accentColor);
  const [mainLabel, setMainLabel] = useState(DEFAULTS.mainLabel);
  const [subLabel, setSubLabel] = useState(DEFAULTS.subLabel);
  const [logo, setLogo] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setBgColor(DEFAULTS.bgColor);
    setAccentColor(DEFAULTS.accentColor);
    setMainLabel(DEFAULTS.mainLabel);
    setSubLabel(DEFAULTS.subLabel);
    setLogo(null);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 4,
        cacheBust: true,
        backgroundColor: bgColor,
      });
      const link = document.createElement('a');
      link.download = `StarFlow-QR-${shop?.name?.replace(/\s+/g, '-') || 'card'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>QR Management</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Design and download your custom QR card.</p>
        <div style={{ color: 'var(--text-secondary)' }}>Loading your QR code...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>QR Management</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Design and download your custom QR card.</p>
        <div className="stakent-card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          Please complete your <a href="/dashboard/settings" style={{ color: '#fff' }}>Shop Settings</a> first to generate your QR code.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>QR Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Design your custom QR card and download a print-ready file.</p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', padding: '8px 14px', borderRadius: '10px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Designer */}
      <div className="qr-designer-grid" style={{ marginBottom: '24px' }}>

        {/* Left — Live preview */}
        <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'flex-start' }}>Live Preview</div>

          <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <PrintCard
              ref={cardRef}
              bgColor={bgColor}
              accentColor={accentColor}
              mainLabel={mainLabel}
              subLabel={subLabel}
              logo={logo}
              qrUrl={qrUrl}
              shopName={shop?.name}
            />
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="stakent-btn primary"
            style={{ width: '100%', padding: '14px', fontSize: '0.9375rem', opacity: downloading ? 0.7 : 1 }}
          >
            <Download size={16} />
            {downloading ? 'Generating...' : 'Download High-Res PNG'}
          </button>

          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', margin: 0 }}>
            Downloads at 4× resolution — print-ready at 300 DPI
          </p>
        </div>

        {/* Right — Controls */}
        <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Logo */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: '8px', fontWeight: 500 }}>Logo</div>
            {logo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px' }}>
                <img src={logo} alt="logo preview" style={{ maxWidth: '64px', maxHeight: '36px', objectFit: 'contain' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Logo uploaded</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Use PNG with transparent background for best results</div>
                </div>
                <button
                  onClick={() => setLogo(null)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)',
                    borderRadius: '10px', padding: '16px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontSize: '0.875rem', fontFamily: 'inherit', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(155,45,242,0.4)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                >
                  <Upload size={15} /> Upload Logo
                </button>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '6px' }}>PNG with transparent background works best</div>
              </div>
            )}
          </div>

          {/* Labels */}
          <FieldInput
            label="Main Label"
            value={mainLabel}
            onChange={setMainLabel}
            placeholder="Leave us a review on Google"
            maxLength={60}
          />
          <FieldInput
            label="Sub Label"
            value={subLabel}
            onChange={setSubLabel}
            placeholder="Scan to share your experience"
            maxLength={80}
          />

          {/* Colors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <ColorSwatch label="Background Color" value={bgColor} onChange={setBgColor} />
            <ColorSwatch label="Text & QR Color" value={accentColor} onChange={setAccentColor} />
          </div>

          {/* Contrast warning */}
          {(() => {
            const hexToRgb = hex => {
              const r = parseInt(hex.slice(1, 3), 16);
              const g = parseInt(hex.slice(3, 5), 16);
              const b = parseInt(hex.slice(5, 7), 16);
              return [r, g, b];
            };
            const luminance = ([r, g, b]) => {
              const [rs, gs, bs] = [r, g, b].map(c => {
                const s = c / 255;
                return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
              });
              return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
            };
            const l1 = luminance(hexToRgb(accentColor));
            const l2 = luminance(hexToRgb(bgColor));
            const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
            if (contrast < 3) {
              return (
                <div style={{ background: 'rgba(255,160,0,0.08)', border: '1px solid rgba(255,160,0,0.2)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.75rem', color: 'rgba(255,200,80,0.8)' }}>
                  ⚠ Low contrast — QR code may not scan reliably. Try a darker background or lighter accent color.
                </div>
              );
            }
            return null;
          })()}

        </div>
      </div>

      {/* Physical displays */}
      <div className="stakent-card">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Order Physical Displays</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.875rem' }}>
          Get premium acrylic stands or NFC-enabled stickers for your checkout counter.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {[
            { name: 'Acrylic Check-out Stand', sub: 'NFC + QR Combo', price: '$29.99' },
            { name: 'Vinyl Window Stickers (x5)', sub: 'Weather-proof', price: '$14.99' },
          ].map((item) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.sub}</div>
              </div>
              <div style={{ fontWeight: 600 }}>{item.price}</div>
            </div>
          ))}
        </div>
        <button className="stakent-btn" style={{ padding: '12px 20px', fontSize: '0.9rem' }}>
          <ShoppingBag size={16} /> Place Order
        </button>
      </div>

    </div>
  );
};

export default QRManagement;

import { useState, useRef } from 'react';
import { Download, RefreshCw, ImageIcon as LucideImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import { supabase } from '../../lib/supabaseClient';
import { useShop } from '../../hooks/useShop';

const templates = [
  { id: 'restaurant', name: 'Restaurant' },
  { id: 'warm-card', name: 'Warm Card' },
  { id: 'bold-fire', name: 'Bold Fire' },
  { id: 'nature', name: 'Nature' },
  { id: 'polaroid', name: 'Polaroid' },
];

const truncate = (text, max) => text && text.length > max ? text.slice(0, max - 3) + '...' : text;

const ContentStudio = () => {
  const { shop } = useShop();
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('restaurant');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const templateRef = useRef(null);

  const fetchGoogleReviews = async () => {
    if (!shop?.place_id) return;
    setIsSyncing(true);
    setSyncError('');
    const { data, error } = await supabase.functions.invoke('get-google-reviews', {
      body: { place_id: shop.place_id },
    });
    if (error || data?.error) {
      setSyncError(error?.message ?? data?.error ?? 'Failed to sync reviews.');
    } else {
      setReviews(data.reviews ?? []);
      if (data.reviews?.length > 0) setSelectedReview(data.reviews[0]);
    }
    setIsSyncing(false);
  };

  const handleDownload = async () => {
    if (!templateRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(templateRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `review-post-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const Stars = ({ size = 44, color = '#f4a017' }) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'block' }}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );

  const renderAvatar = (size, border = null) => {
    const style = {
      width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block',
      ...(border ? { border } : {}),
    };
    if (selectedReview?.photo) {
      return <img src={selectedReview.photo} crossOrigin="anonymous" alt={selectedReview.author} style={style} />;
    }
    return (
      <div style={{
        ...style,
        background: 'linear-gradient(135deg, #9b2df2, #2b58ff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
      }}>
        {selectedReview?.author?.charAt(0) ?? '?'}
      </div>
    );
  };

  const renderTemplate = () => {
    if (!selectedReview) return null;
    const businessName = shop?.name || 'Your Business';

    switch (selectedTemplate) {

      /* ─────────────────────────────────────────
         TEMPLATE 1 — Restaurant (dark red)
      ───────────────────────────────────────── */
      case 'restaurant':
        return (
          <div ref={templateRef} style={{
            width: '1080px', height: '1080px',
            background: '#8B1A0A',
            position: 'relative', overflow: 'hidden',
            fontFamily: 'Arial, Helvetica, sans-serif',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            {/* Scallop pattern */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="scallop" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="60" r="30" fill="none" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="0" cy="60" r="30" fill="none" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="60" cy="60" r="30" fill="none" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="30" cy="0" r="30" fill="none" stroke="#fff" strokeWidth="1.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#scallop)"/>
            </svg>

            {/* Radial light */}
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: '800px', height: '400px',
              background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.1) 0%, transparent 70%)',
            }} />

            {/* Business name */}
            <div style={{
              color: 'rgba(255,255,255,0.92)', fontSize: '30px', fontWeight: 400,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              marginTop: '60px', zIndex: 10,
            }}>
              {businessName}
            </div>

            {/* Avatar + info */}
            <div style={{ marginTop: '80px', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div style={{ borderRadius: '50%', border: '5px solid rgba(255,255,255,0.3)', overflow: 'hidden', width: '180px', height: '180px' }}>
                {renderAvatar(180)}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#fff', fontSize: '36px', fontWeight: 700, letterSpacing: '0.05em' }}>{selectedReview.author}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '22px', marginTop: '6px' }}>Google Review</div>
              </div>
              <Stars size={44} color="#f4a017" />
            </div>

            {/* Review card */}
            <div style={{
              zIndex: 10, width: '880px',
              background: '#fff', borderRadius: '28px',
              padding: '48px 60px', marginTop: '48px', textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#f4a017', fontSize: '36px', lineHeight: 1 }}>★</span>)}
              </div>
              <div style={{ borderTop: '2px dotted #f0c0a0', marginBottom: '28px' }} />
              <p style={{ fontSize: '32px', color: '#333', lineHeight: 1.55, fontStyle: 'italic', margin: 0, marginBottom: '28px' }}>
                "{truncate(selectedReview.text, 220)}"
              </p>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#222' }}>{selectedReview.author}</div>
            </div>
          </div>
        );

      /* ─────────────────────────────────────────
         TEMPLATE 2 — Warm Card (golden amber)
      ───────────────────────────────────────── */
      case 'warm-card':
        return (
          <div ref={templateRef} style={{
            width: '1080px', height: '1080px',
            background: '#C17F24',
            position: 'relative', overflow: 'hidden',
            fontFamily: 'Arial, Helvetica, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Dot texture */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="#fff"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)"/>
            </svg>

            {/* Business name */}
            <div style={{
              position: 'absolute', top: '48px', left: 0, right: 0, textAlign: 'center',
              color: 'rgba(255,255,255,0.95)', fontSize: '30px', letterSpacing: '0.12em', fontWeight: 500, zIndex: 10,
            }}>
              {businessName}
            </div>

            {/* Card */}
            <div style={{
              width: '860px', background: '#fff', borderRadius: '40px',
              overflow: 'hidden', position: 'relative', zIndex: 10,
              boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
            }}>
              {/* Photo header */}
              <div style={{
                width: '100%', height: '360px',
                background: 'linear-gradient(145deg, #d4a053, #7a4e10)',
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {selectedReview.photo && (
                  <img src={selectedReview.photo} crossOrigin="anonymous" alt="" style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover', filter: 'blur(12px)', transform: 'scale(1.15)', opacity: 0.55,
                  }} />
                )}
                <div style={{ position: 'relative', zIndex: 2, borderRadius: '50%', border: '5px solid rgba(255,255,255,0.95)', overflow: 'hidden', width: '130px', height: '130px' }}>
                  {renderAvatar(130)}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '44px 64px 56px', position: 'relative' }}>
                {/* Quote watermark */}
                <div style={{
                  position: 'absolute', right: '40px', bottom: '10px',
                  fontSize: '220px', color: 'rgba(0,0,0,0.04)',
                  fontFamily: 'Georgia, serif', lineHeight: 1, userSelect: 'none',
                }}>
                  "
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '30px', fontWeight: 700, color: '#222' }}>{selectedReview.author}</div>
                  <div style={{ fontSize: '20px', color: '#999', marginTop: '4px' }}>Google Review</div>
                </div>

                <p style={{ fontSize: '28px', color: '#444', lineHeight: 1.65, marginBottom: '28px' }}>
                  {truncate(selectedReview.text, 200)}
                </p>

                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'rgba(0,0,0,0.05)', padding: '10px 20px', borderRadius: '100px',
                }}>
                  <Stars size={30} color="#333" />
                </div>
              </div>
            </div>
          </div>
        );

      /* ─────────────────────────────────────────
         TEMPLATE 3 — Bold Fire (red)
      ───────────────────────────────────────── */
      case 'bold-fire':
        return (
          <div ref={templateRef} style={{
            width: '1080px', height: '1080px',
            background: 'linear-gradient(170deg, #c0392b 0%, #8b1a1a 55%, #5c0000 100%)',
            position: 'relative', overflow: 'hidden',
            fontFamily: 'Arial, Helvetica, sans-serif',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '80px',
          }}>
            {/* Corner triangles */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, borderTop: '130px solid #f4c430', borderRight: '130px solid transparent' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderTop: '130px solid #f4c430', borderLeft: '130px solid transparent' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 0, height: 0, borderBottom: '90px solid rgba(244,196,48,0.25)', borderRight: '90px solid transparent' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 0, height: 0, borderBottom: '90px solid rgba(244,196,48,0.25)', borderLeft: '90px solid transparent' }} />

            {/* Business name */}
            <div style={{ position: 'absolute', top: '44px', color: 'rgba(255,255,255,0.9)', fontSize: '26px', letterSpacing: '0.15em', fontWeight: 500, zIndex: 10 }}>
              {businessName}
            </div>

            {/* Heading */}
            <div style={{
              color: '#fff', fontSize: '84px', fontWeight: 900,
              textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.05,
              letterSpacing: '-0.02em', marginBottom: '56px', zIndex: 10,
            }}>
              Customer<br/>Reviews
            </div>

            {/* Reviewer row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '48px', zIndex: 10 }}>
              <div style={{ borderRadius: '50%', border: '4px solid #f4c430', overflow: 'hidden', width: '140px', height: '140px', flexShrink: 0 }}>
                {renderAvatar(140)}
              </div>
              <div>
                <Stars size={36} color="#f4c430" />
                <div style={{ color: '#fff', fontSize: '32px', fontWeight: 700, marginTop: '10px' }}>{selectedReview.author}</div>
                <div style={{ color: '#f4c430', fontSize: '22px', fontStyle: 'italic' }}>Google Review</div>
              </div>
            </div>

            {/* Review card */}
            <div style={{
              background: '#fff', borderRadius: '24px', padding: '40px 56px',
              textAlign: 'center', zIndex: 10, width: '100%', border: '3px solid #f4c430',
            }}>
              <p style={{ fontSize: '30px', color: '#333', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                "{truncate(selectedReview.text, 180)}"
              </p>
            </div>
          </div>
        );

      /* ─────────────────────────────────────────
         TEMPLATE 4 — Nature (dark green)
      ───────────────────────────────────────── */
      case 'nature':
        return (
          <div ref={templateRef} style={{
            width: '1080px', height: '1080px',
            background: '#1a2e20',
            position: 'relative', overflow: 'hidden',
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}>
            {/* Left photo panel */}
            <div style={{
              position: 'absolute', top: '60px', left: '60px',
              width: '580px', height: '700px', borderRadius: '24px',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #2d5016, #1a3a0f)',
            }}>
              {selectedReview.photo && (
                <img src={selectedReview.photo} crossOrigin="anonymous" alt="" style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'blur(20px)', transform: 'scale(1.2)', opacity: 0.45,
                }} />
              )}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(145deg, rgba(45,80,22,0.7), rgba(20,50,10,0.85))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.35 }}>
                  <path d="M50 10 C80 10, 95 30, 90 60 C85 85, 65 95, 50 90 C35 95, 15 85, 10 60 C5 30, 20 10, 50 10Z" fill="#5be78b"/>
                  <path d="M50 10 L50 90" stroke="#3a9a5c" strokeWidth="2"/>
                  <path d="M50 30 C60 35, 70 35, 75 45" stroke="#3a9a5c" strokeWidth="1.5"/>
                  <path d="M50 50 C40 55, 30 55, 25 65" stroke="#3a9a5c" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>

            {/* Business name top right */}
            <div style={{
              position: 'absolute', top: '56px', right: '64px',
              color: 'rgba(255,255,255,0.9)', fontSize: '26px',
              letterSpacing: '0.08em', fontWeight: 600, textAlign: 'right', zIndex: 10,
            }}>
              {businessName}
            </div>

            {/* "USER REVIEW" label bottom left */}
            <div style={{
              position: 'absolute', bottom: '60px', left: '80px',
              color: 'rgba(255,255,255,0.4)', fontSize: '22px',
              letterSpacing: '0.2em', textTransform: 'uppercase', zIndex: 10,
            }}>
              User Review
            </div>

            {/* Review card */}
            <div style={{
              position: 'absolute', bottom: '80px', right: '60px',
              width: '540px',
              background: '#fff', borderRadius: '32px', padding: '48px',
              boxShadow: '0 40px 80px rgba(0,0,0,0.45)', zIndex: 10,
            }}>
              <div style={{ borderRadius: '50%', overflow: 'hidden', width: '90px', height: '90px', border: '3px solid #f4a017', marginBottom: '20px' }}>
                {renderAvatar(90)}
              </div>
              <Stars size={30} color="#f4a017" />
              <p style={{ fontSize: '26px', color: '#333', lineHeight: 1.65, margin: '20px 0 28px', fontStyle: 'italic' }}>
                "{truncate(selectedReview.text, 200)}"
              </p>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#111', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                {selectedReview.author}
              </div>
            </div>
          </div>
        );

      /* ─────────────────────────────────────────
         TEMPLATE 5 — Polaroid (brown / coffee)
      ───────────────────────────────────────── */
      case 'polaroid':
        return (
          <div ref={templateRef} style={{
            width: '1080px', height: '1080px',
            background: '#4a2c20',
            position: 'relative', overflow: 'hidden',
            fontFamily: 'Arial, Helvetica, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Coffee bean watermark */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="beans" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <ellipse cx="30" cy="30" rx="16" ry="10" fill="none" stroke="#fff" strokeWidth="2" transform="rotate(-30 30 30)"/>
                  <path d="M22 22 Q30 30 38 38" stroke="#fff" strokeWidth="1.5" fill="none"/>
                  <ellipse cx="75" cy="70" rx="16" ry="10" fill="none" stroke="#fff" strokeWidth="2" transform="rotate(20 75 70)"/>
                  <path d="M67 63 Q75 70 83 77" stroke="#fff" strokeWidth="1.5" fill="none"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#beans)"/>
            </svg>

            {/* Business name */}
            <div style={{
              position: 'absolute', top: '48px', left: 0, right: 0, textAlign: 'center',
              color: 'rgba(255,255,255,0.8)', fontSize: '28px', letterSpacing: '0.1em', zIndex: 10,
            }}>
              {businessName}
            </div>

            {/* Clip decoration */}
            <div style={{
              position: 'absolute', top: '140px', right: '218px',
              width: '14px', height: '90px',
              background: 'linear-gradient(to right, #c8b090, #e8d0b0, #c8b090)',
              borderRadius: '7px', transform: 'rotate(10deg)', zIndex: 30,
            }} />

            {/* Polaroid frame */}
            <div style={{
              background: '#fff', padding: '28px 28px 72px',
              width: '760px',
              boxShadow: '0 40px 80px rgba(0,0,0,0.55)',
              transform: 'rotate(-1.5deg)',
              position: 'relative', zIndex: 20,
            }}>
              {/* Photo area */}
              <div style={{
                width: '100%', height: '380px',
                background: 'linear-gradient(135deg, #8b5a2b, #5c3416)',
                marginBottom: '28px', overflow: 'hidden', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {selectedReview.photo && (
                  <img src={selectedReview.photo} crossOrigin="anonymous" alt="" style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover', filter: 'blur(16px)', transform: 'scale(1.2)', opacity: 0.55,
                  }} />
                )}
                <div style={{ position: 'relative', zIndex: 2, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.95)', overflow: 'hidden', width: '130px', height: '130px' }}>
                  {renderAvatar(130)}
                </div>
              </div>

              {/* Stars + label */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
                  <Stars size={34} color="#8b4513" />
                </div>
                <div style={{ fontSize: '30px', color: '#8b4513', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Customer Reviews
                </div>
              </div>

              {/* Review text */}
              <p style={{ fontSize: '24px', color: '#555', lineHeight: 1.65, textAlign: 'center', margin: '0 0 24px' }}>
                {truncate(selectedReview.text, 200)}
              </p>

              {/* Author + heart */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '22px', color: '#888' }}>— {selectedReview.author}</div>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: '#8b4513', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '22px',
                }}>
                  ♥
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (shop && !shop.place_id) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Content Studio</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Generate beautiful social media posts automatically.</p>
        <div className="stakent-card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          Add your <a href="/dashboard/settings" style={{ color: '#fff' }}>Google Place ID in Settings</a> to sync your 5-star reviews.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '2rem' }}>Content Studio</h1>
        <button
          onClick={fetchGoogleReviews}
          disabled={isSyncing || !shop?.place_id}
          className="stakent-btn"
          style={{ opacity: isSyncing ? 0.6 : 1 }}
        >
          <RefreshCw size={16} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
          {isSyncing ? 'Syncing...' : 'Sync Reviews'}
        </button>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Generate beautiful social media posts automatically.</p>

      {syncError && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)',
          borderRadius: '8px', color: '#ff6b8a', fontSize: '0.875rem', marginBottom: '24px',
        }}>
          {syncError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>

        {/* Left: Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="stakent-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Select 5-Star Review</h3>
            {reviews.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '24px 0' }}>
                Click "Sync Reviews" to load your Google reviews.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                {reviews.map(review => (
                  <div
                    key={review.id}
                    onClick={() => setSelectedReview(review)}
                    style={{
                      padding: '16px', borderRadius: '8px', cursor: 'pointer',
                      background: selectedReview?.id === review.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${selectedReview?.id === review.id ? '#fff' : 'var(--glass-border)'}`,
                    }}
                  >
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      {review.author}
                      {review.photo && <LucideImageIcon size={14} color="var(--text-secondary)" />}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{review.text}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="stakent-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Select Template</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {templates.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  style={{
                    padding: '12px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer',
                    background: selectedTemplate === tmpl.id ? 'var(--text-primary)' : 'transparent',
                    color: selectedTemplate === tmpl.id ? '#000' : 'var(--text-primary)',
                    border: '1px solid var(--glass-border)',
                    fontWeight: selectedTemplate === tmpl.id ? 600 : 500,
                  }}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isGenerating || !selectedReview}
            className="stakent-btn primary"
            style={{ width: '100%', padding: '16px', fontSize: '1rem', opacity: (isGenerating || !selectedReview) ? 0.7 : 1 }}
          >
            <Download size={18} /> {isGenerating ? 'Generating...' : 'Download HQ'}
          </button>
        </div>

        {/* Right: Preview */}
        <div className="stakent-card" style={{
          padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#090a0c', overflow: 'hidden', minHeight: '600px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {selectedReview ? (
            <div style={{ width: `${1080 * 0.44}px`, height: `${1080 * 0.44}px`, overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ transform: 'scale(0.44)', transformOrigin: 'top left', width: '1080px', height: '1080px' }}>
                {renderTemplate()}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
              Sync reviews to see a preview.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContentStudio;

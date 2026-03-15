import { useState, useRef } from 'react';
import { Download, RefreshCw, Star, ImageIcon as LucideImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import { supabase } from '../../lib/supabaseClient';
import { useShop } from '../../hooks/useShop';

const templates = [
  { id: 'modern', name: 'Modern Glass' },
  { id: 'bold', name: 'Bold Typography' },
  { id: 'elegant', name: 'Elegant Minimal' }
];

const ContentStudio = () => {
  const { shop } = useShop();
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
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

  const renderTemplate = () => {
    if (!selectedReview) return null;

    switch (selectedTemplate) {
      case 'modern':
        return (
          <div
            ref={templateRef}
            style={{
              width: '1080px', height: '1080px',
              background: '#0a0a0c',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: '80px',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '800px', height: '800px', background: 'rgba(91, 231, 139, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', background: 'rgba(43, 88, 255, 0.1)', filter: 'blur(100px)', borderRadius: '50%' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'auto' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>Star.Flow</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={48} fill="#5be78b" color="#5be78b" />)}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '40px',
              padding: '64px',
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '64px',
              zIndex: 10
            }}>
              <p style={{ fontSize: '3rem', fontWeight: 600, lineHeight: 1.4, marginBottom: '48px', color: '#fff' }}>
                "{selectedReview.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ffeedd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '2rem', fontWeight: 700 }}>
                  {selectedReview.author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedReview.author}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem' }}>via Google Reviews</div>
                </div>
              </div>
            </div>

            {selectedReview.photo && (
              <div style={{ width: '100%', height: '300px', borderRadius: '32px', overflow: 'hidden', zIndex: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={selectedReview.photo} alt="User submission" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        );

      case 'bold':
        return (
          <div
            ref={templateRef}
            style={{
              width: '1080px', height: '1080px',
              background: '#5be78b',
              color: '#000000',
              padding: '100px',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <h1 style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', marginBottom: 'auto' }}>
              "{selectedReview.text}"
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '4px solid #000', paddingTop: '40px' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{selectedReview.author}</div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={40} fill="#000" color="#000" />)}
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>Google Reviews</div>
            </div>
          </div>
        );

      case 'elegant':
        return (
          <div
            ref={templateRef}
            style={{
              width: '1080px', height: '1080px',
              background: '#ffffff',
              color: '#000000',
              padding: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontFamily: 'Georgia, serif'
            }}
          >
            <div style={{ display: 'flex', gap: '8px', marginBottom: '64px' }}>
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={32} fill="#ffc107" color="#ffc107" />)}
            </div>
            <p style={{ fontSize: '3.5rem', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '80px', color: '#111' }}>
              "{selectedReview.text}"
            </p>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              — {selectedReview.author}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // No place_id configured
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
          background: 'rgba(255,45,85,0.1)',
          border: '1px solid rgba(255,45,85,0.3)',
          borderRadius: '8px',
          color: '#ff6b8a',
          fontSize: '0.875rem',
          marginBottom: '24px'
        }}>
          {syncError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>

        {/* Left Side: Controls */}
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
                      padding: '16px',
                      borderRadius: '8px',
                      background: selectedReview?.id === review.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid',
                      borderColor: selectedReview?.id === review.id ? '#fff' : 'var(--glass-border)',
                      cursor: 'pointer'
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
                    padding: '12px',
                    borderRadius: '8px',
                    background: selectedTemplate === tmpl.id ? 'var(--text-primary)' : 'transparent',
                    color: selectedTemplate === tmpl.id ? '#000' : 'var(--text-primary)',
                    border: '1px solid var(--glass-border)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: selectedTemplate === tmpl.id ? 600 : 500
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
            <Download size={18} /> {isGenerating ? 'Generating...' : 'Download Template HQ'}
          </button>
        </div>

        {/* Right Side: Preview */}
        <div className="stakent-card" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090a0c', overflow: 'hidden', minHeight: '600px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {selectedReview ? (
            <div style={{ transform: 'scale(0.4)', transformOrigin: 'top center', width: '1080px', height: '450px' }}>
              {renderTemplate()}
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

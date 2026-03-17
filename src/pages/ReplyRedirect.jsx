import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ReplyRedirect = () => {
  const { reviewId } = useParams();
  const [step, setStep] = useState('loading'); // loading | copied | error
  const [reply, setReply] = useState('');

  useEffect(() => {
    const run = async () => {
      const { data, error } = await supabase
        .from('google_reviews')
        .select('ai_reply, shops(place_id)')
        .eq('id', reviewId)
        .single();

      if (error || !data) {
        setStep('error');
        return;
      }

      setReply(data.ai_reply || '');

      try {
        await navigator.clipboard.writeText(data.ai_reply || '');
      } catch (_) {
        // clipboard blocked — reply still shown so they can copy manually
      }

      setStep('copied');

      const placeId = data.shops?.place_id;
      const googleUrl = placeId
        ? `https://search.google.com/local/reviews?placeid=${placeId}`
        : 'https://business.google.com/reviews';

      setTimeout(() => {
        window.location.href = googleUrl;
      }, 1800);
    };

    run();
  }, [reviewId]);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0d0d0f',
    color: '#fff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '24px',
  };

  if (step === 'error') return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
        <div style={{ fontSize: '1rem', color: '#888' }}>Review link not found or already used.</div>
      </div>
    </div>
  );

  if (step === 'loading') return (
    <div style={containerStyle}>
      <div style={{ color: '#555', fontSize: '0.9rem' }}>Loading...</div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #9b2df2, #2b58ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: '1.75rem',
        }}>✓</div>

        <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
          Reply copied to clipboard
        </div>
        <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '28px' }}>
          Taking you to Google Reviews in a moment...
        </div>

        <div style={{
          background: '#18181b',
          border: '1px solid rgba(155,45,242,0.35)',
          borderRadius: '14px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '20px',
        }}>
          <div style={{ color: '#9b2df2', fontSize: '11px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Your reply
          </div>
          <div style={{ color: '#e0e0e8', fontSize: '14px', lineHeight: 1.65 }}>
            {reply}
          </div>
        </div>

        <div style={{ color: '#444', fontSize: '12px' }}>
          Just paste and hit Post when you land on Google.
        </div>
      </div>
    </div>
  );
};

export default ReplyRedirect;

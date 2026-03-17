import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Send, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ScanExperience = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [step, setStep] = useState('loading');
  const [feedback, setFeedback] = useState('');
  const [reviewDraft, setReviewDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchShop = async () => {
      const { data, error } = await supabase
        .from('shops')
        .select('id, name, google_maps_url, place_id')
        .eq('id', shopId)
        .single();

      if (error || !data) {
        setStep('not_found');
      } else {
        setShop(data);
        setStep('rating');
      }
    };
    fetchShop();
  }, [shopId]);

  const handleRate = (value) => {
    setRating(value);
    setTimeout(() => {
      if (value >= 4) {
        setStep('redirect');
      } else {
        setStep('feedback');
      }
    }, 400);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    const { error } = await supabase
      .from('feedback')
      .insert({ shop_id: shopId, rating, message: feedback });

    if (error) {
      setSubmitError('Something went wrong. Please try again.');
    } else {
      setStep('thank_you');
    }
    setSubmitting(false);
  };

  if (step === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Star size={32} color="var(--text-primary)" />
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Orbs for mobile elegance */}
      <div className="bg-glow purple" style={{ top: '-10%', left: '-20%', width: '300px', height: '300px' }} />
      
      <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header/Branding */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{shop?.logo}</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>{shop?.name}</h1>
        </motion.div>

        {/* Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1: RATING */}
            {step === 'rating' && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                className="glass-panel"
                style={{ padding: '32px 24px', textAlign: 'center' }}
              >
                <h2 style={{ fontSize: '1.25rem', marginBottom: '32px', fontWeight: 500 }}>
                  How was your experience with us today?
                </h2>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRate(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        outline: 'none'
                      }}
                    >
                      <Star 
                        size={40} 
                        fill={(hoveredRating || rating) >= star ? '#fff' : 'transparent'}
                        color={(hoveredRating || rating) >= star ? '#fff' : 'rgba(255,255,255,0.2)'}
                        style={{ transition: 'all 0.2s' }}
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2A: GOOGLE REDIRECT (4-5 Stars) */}
            {step === 'redirect' && (
              <motion.div
                key="redirect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: '32px 24px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Star size={32} fill="#fff" color="#fff" />
                  </div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', fontWeight: 600 }}>We're thrilled!</h2>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                    Write a few words below, then we'll copy it and take you straight to Google.
                  </p>
                </div>

                <textarea
                  value={reviewDraft}
                  onChange={(e) => setReviewDraft(e.target.value)}
                  placeholder="What did you love about your visit?"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    color: 'white',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    resize: 'vertical',
                    outline: 'none',
                    marginBottom: '16px',
                    boxSizing: 'border-box',
                  }}
                />

                {copied && (
                  <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#5be78b', marginBottom: '12px' }}>
                    Copied! Just paste it into the review box on Google.
                  </p>
                )}

                {shop?.google_maps_url ? (
                  <a
                    href={shop.place_id ? `https://search.google.com/local/writereview?placeid=${shop.place_id}` : shop.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={() => {
                      if (reviewDraft.trim()) {
                        navigator.clipboard.writeText(reviewDraft);
                        setCopied(true);
                      }
                      setTimeout(() => setStep('thank_you'), 500);
                    }}
                  >
                    {copied ? <Check size={20} /> : <MapPin size={20} />} Finish on Google Maps
                  </a>
                ) : (
                  <button
                    className="btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '1.125rem' }}
                    onClick={() => setStep('thank_you')}
                  >
                    <MapPin size={20} /> Continue
                  </button>
                )}
              </motion.div>
            )}

            {/* STEP 2B: PRIVATE FEEDBACK (1-3 Stars) */}
            {step === 'feedback' && (
              <motion.form
                key="feedback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleFeedbackSubmit}
                className="glass-panel"
                style={{ padding: '32px 24px' }}
              >
                <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: 600 }}>We're sorry to hear that.</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Please let us know how we can improve. Your feedback goes directly to our management team.
                </p>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us about your experience..."
                  required
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    color: 'white',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    resize: 'vertical',
                    marginBottom: '24px',
                    outline: 'none'
                  }}
                />
                {submitError && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(255,45,85,0.1)',
                    border: '1px solid rgba(255,45,85,0.3)',
                    borderRadius: '8px',
                    color: '#ff6b8a',
                    fontSize: '0.875rem',
                    marginBottom: '16px'
                  }}>
                    {submitError}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '16px', opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                  disabled={submitting}
                >
                  <Send size={18} /> {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>

                {(shop?.google_maps_url || shop?.place_id) && (
                  <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
                    You can also{' '}
                    <a
                      href={shop.place_id ? `https://search.google.com/local/writereview?placeid=${shop.place_id}` : shop.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}
                    >
                      leave a review on Google
                    </a>
                  </p>
                )}
              </motion.form>
            )}

            {/* NOT FOUND */}
            {step === 'not_found' && (
              <motion.div
                key="not_found"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ padding: '48px 24px', textAlign: 'center' }}
              >
                <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 600 }}>Shop Not Found</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  This QR code is no longer active. Please contact the business directly.
                </p>
              </motion.div>
            )}

            {/* STEP 3: THANK YOU */}
            {step === 'thank_you' && (
              <motion.div
                key="thank_you"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ padding: '48px 24px', textAlign: 'center' }}
              >
                 <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 600 }}>Thank You!</h2>
                 <p style={{ color: 'var(--text-secondary)' }}>
                   We appreciate you taking the time to help us grow.
                 </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Powered By Footer */}
        <div style={{ textAlign: 'center', marginTop: 'auto', padding: '24px', opacity: 0.5, fontSize: '0.75rem' }}>
          Powered by <strong>StarScaleHub</strong>
        </div>
      </div>
    </div>
  );
};

export default ScanExperience;

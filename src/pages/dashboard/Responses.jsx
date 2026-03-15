import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useShop } from '../../hooks/useShop';

const Responses = () => {
  const { shop } = useShop();
  const [reviews, setReviews] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [responseMap, setResponseMap] = useState({}); // { reviewId: string }
  const [editMap, setEditMap] = useState({});          // { reviewId: string } edited text
  const [generatingId, setGeneratingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Load previously saved responses from DB
  useEffect(() => {
    if (shop?.id) fetchSavedResponses();
  }, [shop?.id]);

  const fetchSavedResponses = async () => {
    const { data } = await supabase
      .from('review_responses')
      .select('*')
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false });

    if (data) {
      const map = {};
      data.forEach(r => { map[r.review_author] = r.ai_response; });
      setResponseMap(map);
    }
  };

  const syncReviews = async () => {
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
    }
    setIsSyncing(false);
  };

  const generateReply = async (review) => {
    setGeneratingId(review.id);
    const { data, error } = await supabase.functions.invoke('generate-review-response', {
      body: {
        review_text: review.text,
        review_author: review.author,
        shop_name: shop.name,
        persona: shop.persona || '',
      },
    });

    if (!error && data?.response) {
      setResponseMap(prev => ({ ...prev, [review.author]: data.response }));
      setEditMap(prev => ({ ...prev, [review.author]: data.response }));

      // Save to DB
      await supabase.from('review_responses').upsert(
        {
          shop_id: shop.id,
          review_author: review.author,
          review_text: review.text,
          ai_response: data.response,
        },
        { onConflict: 'shop_id,review_author' }
      );
    }
    setGeneratingId(null);
  };

  const copyReply = (reviewAuthor) => {
    const text = editMap[reviewAuthor] ?? responseMap[reviewAuthor];
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(reviewAuthor);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (shop && !shop.place_id) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Review Responses</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Generate AI-powered replies to your 5-star Google reviews.</p>
        <div className="stakent-card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          Add your <a href="/dashboard/settings" style={{ color: '#fff' }}>Google Place ID in Settings</a> to sync your reviews.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '2rem' }}>Review Responses</h1>
        <button
          onClick={syncReviews}
          disabled={isSyncing || !shop?.place_id}
          className="stakent-btn"
          style={{ opacity: isSyncing ? 0.6 : 1 }}
        >
          <RefreshCw size={16} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
          {isSyncing ? 'Syncing...' : 'Sync Reviews'}
        </button>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        Generate AI replies using your business persona. Edit and copy to paste into Google Maps.
      </p>

      {syncError && (
        <div style={{
          padding: '12px 16px', marginBottom: '24px',
          background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)',
          borderRadius: '8px', color: '#ff6b8a', fontSize: '0.875rem',
        }}>
          {syncError}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="stakent-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>No reviews loaded yet.</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Click "Sync Reviews" to fetch your 5-star Google reviews.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map(review => {
            const savedResponse = responseMap[review.author];
            const editedText = editMap[review.author] ?? savedResponse;
            const isGenerating = generatingId === review.id;
            const isCopied = copiedId === review.author;
            const hasResponse = !!savedResponse;

            return (
              <div key={review.id} className="stakent-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Review */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{review.author}</div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#f4a017', fontSize: '14px' }}>★</span>)}
                      </div>
                      {hasResponse && (
                        <span style={{
                          fontSize: '0.75rem', padding: '2px 10px', borderRadius: '100px',
                          background: 'rgba(91,231,139,0.1)', color: '#5be78b', fontWeight: 500,
                        }}>
                          Reply drafted
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
                      "{review.text}"
                    </p>
                  </div>

                  <button
                    onClick={() => generateReply(review)}
                    disabled={isGenerating}
                    className="stakent-btn"
                    style={{ flexShrink: 0, opacity: isGenerating ? 0.6 : 1, whiteSpace: 'nowrap' }}
                  >
                    <Sparkles size={15} style={{ animation: isGenerating ? 'spin 1s linear infinite' : 'none' }} />
                    {isGenerating ? 'Generating...' : hasResponse ? 'Regenerate' : 'Generate Reply'}
                  </button>
                </div>

                {/* AI Response */}
                {hasResponse && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        AI Draft Reply
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => generateReply(review)}
                          disabled={isGenerating}
                          style={{
                            background: 'transparent', border: '1px solid var(--glass-border)',
                            color: 'var(--text-secondary)', borderRadius: '6px',
                            padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            opacity: isGenerating ? 0.5 : 1,
                          }}
                        >
                          <RotateCcw size={12} /> Regenerate
                        </button>
                        <button
                          onClick={() => copyReply(review.author)}
                          className="stakent-btn primary"
                          style={{ padding: '6px 16px', fontSize: '0.875rem' }}
                        >
                          {isCopied ? <Check size={14} /> : <Copy size={14} />}
                          {isCopied ? 'Copied!' : 'Copy Reply'}
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={editedText}
                      onChange={(e) => setEditMap(prev => ({ ...prev, [review.author]: e.target.value }))}
                      rows={4}
                      style={{
                        width: '100%', padding: '16px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)', fontFamily: 'inherit',
                        fontSize: '0.9375rem', lineHeight: 1.65,
                        resize: 'vertical', outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                      Edit the reply above if needed, then copy and paste it directly into Google Maps.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Responses;

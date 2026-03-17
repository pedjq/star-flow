import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Copy, Check, RotateCcw, Send, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { supabase } from '../../lib/supabaseClient';
import { useShop } from '../../hooks/useShop';

const PLATFORMS = [
  { id: 'google', label: 'Google', idField: 'place_id', Icon: FaGoogle, color: '#4285F4' },
];

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const Responses = () => {
  const { shop } = useShop();
  const [activePlatform, setActivePlatform] = useState('google');
  const [reviewsByPlatform, setReviewsByPlatform] = useState({});
  const [loadingPlatform, setLoadingPlatform] = useState(null);
  const [syncError, setSyncError] = useState('');
  const [responseMap, setResponseMap] = useState({});  // key: `platform:author`
  const [sentMap, setSentMap] = useState({});           // key: `platform:author`
  const [editMap, setEditMap] = useState({});
  const [generatingId, setGeneratingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [generateError, setGenerateError] = useState('');
  const [expandedSentMap, setExpandedSentMap] = useState({});

  useEffect(() => {
    if (shop?.id) fetchSavedResponses();
  }, [shop?.id]);

  // Auto-fetch reviews when switching to a configured platform with no data yet
  useEffect(() => {
    if (!shop) return;
    if (reviewsByPlatform[activePlatform] !== undefined) return;
    const platform = PLATFORMS.find(p => p.id === activePlatform);
    const identifier = shop[platform.idField];
    if (!identifier) return;
    fetchReviews(activePlatform, identifier);
  }, [activePlatform, shop]);

  const fetchSavedResponses = async () => {
    const { data } = await supabase
      .from('review_responses')
      .select('*')
      .eq('shop_id', shop.id);

    if (data) {
      const rMap = {};
      const sMap = {};
      data.forEach(r => {
        const key = `${r.platform || 'google'}:${r.review_author}`;
        rMap[key] = r.ai_response;
        sMap[key] = r.sent || false;
      });
      setResponseMap(rMap);
      setSentMap(sMap);
    }
  };

  const fetchReviews = async (platform, identifier, forceRefresh = false) => {
    setLoadingPlatform(platform);
    setSyncError('');

    // Check DB cache first (unless forced)
    if (!forceRefresh) {
      const { data: cached } = await supabase
        .from('cached_reviews')
        .select('reviews, fetched_at, overall_rating, total_ratings')
        .eq('shop_id', shop.id)
        .eq('platform', platform)
        .single();

      const fresh = cached && (Date.now() - new Date(cached.fetched_at).getTime()) < CACHE_TTL_MS;
      if (fresh) {
        setReviewsByPlatform(prev => ({ ...prev, [platform]: cached.reviews }));
        setLoadingPlatform(null);
        return;
      }
    }

    // Fetch fresh from edge function
    const { data, error } = await supabase.functions.invoke('get-reviews', {
      body: { platform, identifier },
    });

    if (error || data?.error) {
      setSyncError(error?.message ?? data?.error ?? 'Failed to fetch reviews.');
      setReviewsByPlatform(prev => ({ ...prev, [platform]: [] }));
    } else {
      const reviews = data.reviews ?? [];
      setReviewsByPlatform(prev => ({ ...prev, [platform]: reviews }));
      // Save to cache (include Google's overall rating if available)
      const cachePayload = {
        shop_id: shop.id,
        platform,
        reviews,
        fetched_at: new Date().toISOString(),
        ...(platform === 'google' && { overall_rating: data.overallRating ?? null, total_ratings: data.totalRatings ?? null }),
      };
      const { error: upsertErr } = await supabase.from('cached_reviews').upsert(cachePayload, { onConflict: 'shop_id,platform' });
      if (upsertErr) setSyncError('Cache save failed: ' + upsertErr.message);
    }

    setLoadingPlatform(null);
  };

  const generateReply = async (review) => {
    const key = `${activePlatform}:${review.author}`;
    setGeneratingId(key);
    setGenerateError('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-review-response', {
        body: {
          review_text: review.text,
          review_author: review.author,
          shop_name: shop.name,
          persona: shop.persona || '',
        },
      });

      if (error || data?.error) {
        setGenerateError(error?.message ?? data?.error ?? 'Failed to generate reply.');
      } else if (data?.response) {
        setResponseMap(prev => ({ ...prev, [key]: data.response }));
        setEditMap(prev => ({ ...prev, [key]: data.response }));
        await supabase.from('review_responses').upsert(
          {
            shop_id: shop.id,
            review_author: review.author,
            review_text: review.text,
            ai_response: data.response,
            platform: activePlatform,
            sent: false,
          },
          { onConflict: 'shop_id,review_author,platform' }
        );
      } else {
        setGenerateError('No response received.');
      }
    } catch (e) {
      setGenerateError('Exception: ' + e.message);
    }

    setGeneratingId(null);
  };

  const markAsSent = async (review) => {
    const key = `${activePlatform}:${review.author}`;
    setSentMap(prev => ({ ...prev, [key]: true }));
    setExpandedSentMap(prev => ({ ...prev, [key]: false }));
    await supabase
      .from('review_responses')
      .update({ sent: true })
      .eq('shop_id', shop.id)
      .eq('review_author', review.author)
      .eq('platform', activePlatform);
  };

  const copyReply = (key) => {
    const text = editMap[key] ?? responseMap[key];
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentPlatformConfig = PLATFORMS.find(p => p.id === activePlatform);
  const isConfigured = !!shop?.[currentPlatformConfig?.idField];
  const reviews = reviewsByPlatform[activePlatform];
  const isLoading = loadingPlatform === activePlatform;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '2rem' }}>Review Responses</h1>
        {isConfigured && (
          <button
            onClick={() => fetchReviews(activePlatform, shop[currentPlatformConfig.idField], true)}
            disabled={!!loadingPlatform}
            className="stakent-btn"
            style={{ opacity: loadingPlatform ? 0.6 : 1 }}
          >
            <RefreshCw size={16} style={{ animation: loadingPlatform ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        )}
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Generate AI replies for your reviews across all platforms. Edit, copy, and mark as sent.
      </p>

      {/* Platform Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {PLATFORMS.map(p => {
          const configured = !!shop?.[p.idField];
          const isActive = activePlatform === p.id;
          const iconColor = isActive ? p.color : configured ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)';
          return (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '100px',
                border: isActive
                  ? `1px solid ${p.color}55`
                  : '1px solid var(--glass-border)',
                background: isActive ? `${p.color}18` : 'transparent',
                color: isActive ? '#fff' : configured ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: '7px',
                transition: 'all 0.2s',
              }}
            >
              <p.Icon size={14} color={iconColor} />
              {p.label}
              {!configured && (
                <span style={{ fontSize: '0.65rem', opacity: 0.5, border: '1px solid currentColor', borderRadius: '3px', padding: '0 3px' }}>+</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Error banners */}
      {syncError && (
        <div style={{ padding: '12px 16px', marginBottom: '24px', background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)', borderRadius: '8px', color: '#ff6b8a', fontSize: '0.875rem' }}>
          {syncError}
        </div>
      )}
      {generateError && (
        <div style={{ padding: '12px 16px', marginBottom: '24px', background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)', borderRadius: '8px', color: '#ff6b8a', fontSize: '0.875rem' }}>
          {generateError}
        </div>
      )}

      {/* Not configured */}
      {!isConfigured && (
        <div className="stakent-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `${currentPlatformConfig?.color}18`, border: `1px solid ${currentPlatformConfig?.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            {currentPlatformConfig?.Icon && <currentPlatformConfig.Icon size={24} color={currentPlatformConfig.color} />}
          </div>
          <h3 style={{ marginBottom: '12px' }}>Connect {currentPlatformConfig?.label}</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '340px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Add your {currentPlatformConfig?.label} profile URL in Settings to start pulling and responding to reviews from this platform.
          </p>
          <a href="/dashboard/settings" className="stakent-btn primary" style={{ display: 'inline-flex' }}>
            <Settings size={15} /> Go to Settings
          </a>
        </div>
      )}

      {/* Loading */}
      {isConfigured && isLoading && (
        <div className="stakent-card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', opacity: 0.5 }} />
          <div>Loading {currentPlatformConfig?.label} reviews...</div>
        </div>
      )}

      {/* Reviews list */}
      {isConfigured && !isLoading && reviews !== undefined && (
        reviews.length === 0 ? (
          <div className="stakent-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>No reviews found for this platform.</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Click Refresh to fetch the latest.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[...reviews].sort((a, b) => {
              const aKey = `${activePlatform}:${a.author}`;
              const bKey = `${activePlatform}:${b.author}`;
              return (sentMap[aKey] ? 1 : 0) - (sentMap[bKey] ? 1 : 0);
            }).map(review => {
              const key = `${activePlatform}:${review.author}`;
              const savedResponse = responseMap[key];
              const editedText = editMap[key] ?? savedResponse;
              const isGenerating = generatingId === key;
              const isCopied = copiedId === key;
              const isSent = sentMap[key];
              const hasResponse = !!savedResponse;
              const draftVisible = hasResponse && (!isSent || expandedSentMap[key]);

              return (
                <div key={review.id} className="stakent-card" style={{
                  display: 'flex', flexDirection: 'column', gap: '20px',
                  border: isSent ? '1px solid rgba(91,231,139,0.2)' : undefined,
                  opacity: isSent ? 0.75 : 1,
                  transition: 'opacity 0.3s, border 0.3s',
                }}>

                  {/* Review header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{review.author}</div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ color: s <= (review.rating || 5) ? '#f4a017' : 'rgba(255,255,255,0.15)', fontSize: '13px' }}>★</span>
                          ))}
                        </div>
                        {isSent && (
                          <span style={{
                            fontSize: '0.75rem', padding: '3px 10px', borderRadius: '100px',
                            background: 'linear-gradient(135deg, rgba(91,231,139,0.2), rgba(52,211,153,0.15))',
                            border: '1px solid rgba(91,231,139,0.4)',
                            color: '#5be78b', fontWeight: 600,
                            boxShadow: '0 0 10px rgba(91,231,139,0.15)',
                          }}>
                            ✦ Reply sent
                          </span>
                        )}
                        {hasResponse && !isSent && (
                          <span style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: '100px', background: 'rgba(155,45,242,0.1)', color: '#c084fc', fontWeight: 500 }}>
                            Draft ready
                          </span>
                        )}
                        {review.date && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{review.date}</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
                        "{review.text}"
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                      {!isSent && (
                        <button
                          onClick={() => generateReply(review)}
                          disabled={isGenerating}
                          className="stakent-btn"
                          style={{ opacity: isGenerating ? 0.6 : 1, whiteSpace: 'nowrap' }}
                        >
                          <Sparkles size={15} style={{ animation: isGenerating ? 'spin 1s linear infinite' : 'none' }} />
                          {isGenerating ? 'Generating...' : hasResponse ? 'Regenerate' : 'Generate Reply'}
                        </button>
                      )}
                      {isSent && hasResponse && (
                        <button
                          onClick={() => setExpandedSentMap(prev => ({ ...prev, [key]: !prev[key] }))}
                          style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}
                        >
                          {expandedSentMap[key] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          {expandedSentMap[key] ? 'Hide reply' : 'View reply'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Draft */}
                  {draftVisible && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          AI Draft Reply
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {!isSent && (
                            <button
                              onClick={() => generateReply(review)}
                              disabled={isGenerating}
                              style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', opacity: isGenerating ? 0.5 : 1, fontFamily: 'inherit' }}
                            >
                              <RotateCcw size={12} /> Regenerate
                            </button>
                          )}
                          <button
                            onClick={() => copyReply(key)}
                            className="stakent-btn"
                            style={{ padding: '6px 14px', fontSize: '0.875rem' }}
                          >
                            {isCopied ? <Check size={14} /> : <Copy size={14} />}
                            {isCopied ? 'Copied!' : 'Copy'}
                          </button>
                          {!isSent && (
                            <button
                              onClick={() => markAsSent(review)}
                              className="stakent-btn primary"
                              style={{ padding: '6px 14px', fontSize: '0.875rem' }}
                            >
                              <Send size={14} /> Mark as Sent
                            </button>
                          )}
                        </div>
                      </div>

                      <textarea
                        value={editedText}
                        onChange={(e) => setEditMap(prev => ({ ...prev, [key]: e.target.value }))}
                        rows={4}
                        readOnly={isSent}
                        style={{ width: '100%', padding: '16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', fontFamily: 'inherit', fontSize: '0.9375rem', lineHeight: 1.65, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                      />
                      {!isSent && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                          Edit above if needed, copy it, paste into {currentPlatformConfig?.label}, then hit "Mark as Sent".
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

    </div>
  );
};

export default Responses;

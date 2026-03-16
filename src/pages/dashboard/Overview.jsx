import { useState, useEffect } from 'react';
import { Star, ShieldAlert, MessageSquare, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useShop } from '../../hooks/useShop';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="stakent-card" style={{ padding: '12px 16px', background: 'rgba(17, 18, 24, 0.9)', backdropFilter: 'blur(10px)' }}>
        <p style={{ margin: 0, marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>{label}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.875rem' }}>
          <div style={{ color: '#9b2df2', display: 'flex', justifyContent: 'space-between', width: '120px' }}>
            <span>Positive:</span> <span style={{ fontWeight: 'bold' }}>{payload[0].value}</span>
          </div>
          <div style={{ color: '#ff2d55', display: 'flex', justifyContent: 'space-between', width: '120px' }}>
            <span>Negative:</span> <span style={{ fontWeight: 'bold' }}>{payload[1]?.value || 0}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const MetricCard = ({ title, value, icon, trend }) => (
  <div className="stakent-card">
    <div className="card-title">
      {title}
      <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        {icon}
      </div>
    </div>
    <div className="card-value">
      {value}
      {trend && (
        <span style={{ fontSize: '0.875rem', color: trend > 0 ? '#5be78b' : '#ff2d55', fontWeight: 500, display: 'flex', alignItems: 'center', background: trend > 0 ? 'rgba(91,231,139,0.1)' : 'rgba(255,45,85,0.1)', padding: '4px 8px', borderRadius: '100px' }}>
          {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
);

const StarTargetCard = ({ starData, loading }) => {
  if (loading) {
    return (
      <div className="stakent-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Loading...</span>
      </div>
    );
  }

  const { avgRating, nextMilestone, prevMilestone, reviewsNeeded, progressPct, ratingCount, starSource } = starData;
  const reviewLabel = starSource === 'google' ? 'Google review' : 'scan';

  if (ratingCount === 0) {
    return (
      <div className="stakent-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontSize: '2.5rem' }}>⭐</div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>Star Rating Tracker</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Sync your Google reviews or collect your first QR scan to start tracking your rating milestone.
          </div>
        </div>
      </div>
    );
  }

  const atMax = avgRating >= 4.95;

  return (
    <div className="stakent-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="bg-glow" style={{ top: '-30%', right: '-10%', width: '200px', height: '200px', background: 'rgba(244, 160, 23, 0.08)', filter: 'blur(50px)', position: 'absolute', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>

        {/* Big Rating */}
        <div style={{ textAlign: 'center', minWidth: '100px' }}>
          <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1, color: '#f4a017', letterSpacing: '-0.03em' }}>
            {avgRating.toFixed(1)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '6px' }}>
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                size={13}
                fill={s <= Math.round(avgRating) ? '#f4a017' : 'transparent'}
                color={s <= Math.round(avgRating) ? '#f4a017' : 'rgba(255,255,255,0.15)'}
              />
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {ratingCount} {reviewLabel}{ratingCount !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Progress */}
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div className="card-title" style={{ marginBottom: '12px' }}>
            Rating Target
          </div>

          {atMax ? (
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f4a017' }}>
              You're at 5.0 ⭐ — perfect score!
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{prevMilestone.toFixed(1)}</span>
                <span style={{ color: '#f4a017', fontWeight: 600 }}>Next: {nextMilestone.toFixed(1)} ⭐</span>
              </div>

              {/* Progress bar */}
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #f4a017, #f97316)',
                  borderRadius: '100px',
                  transition: 'width 0.6s ease',
                }} />
              </div>

              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                <span style={{ color: '#f4a017', fontWeight: 700 }}>{reviewsNeeded}</span> more 5-star {reviewLabel}{reviewsNeeded !== 1 ? 's' : ''} to hit{' '}
                <span style={{ color: '#f4a017' }}>{nextMilestone.toFixed(1)} ★</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const TimeSavedCard = ({ minutesSaved, loading }) => {
  const hrs = Math.floor(minutesSaved / 60);
  const mins = minutesSaved % 60;
  const display = hrs > 0 ? `${hrs}h ${mins > 0 ? `${mins}m` : ''}`.trim() : `${mins}m`;

  return (
    <div className="stakent-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(155, 45, 242, 0.1)', filter: 'blur(30px)', borderRadius: '50%' }} />
      <div className="card-title" style={{ position: 'relative', zIndex: 1 }}>
        Time Saved by AI
        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Clock size={20} color="#c084fc" />
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="card-value" style={{ fontSize: minutesSaved >= 60 ? '2rem' : '2rem', color: '#c084fc' }}>
          {loading ? '—' : display}
        </div>
      </div>
    </div>
  );
};

const Overview = () => {
  const { shop, loading: shopLoading } = useShop();
  const [metrics, setMetrics] = useState({ totalScans: 0, reviewsGained: 0, negativeFeedback: 0, pendingReplies: 0 });
  const [starData, setStarData] = useState({ avgRating: 0, nextMilestone: 0.1, prevMilestone: 0, reviewsNeeded: 0, progressPct: 0, ratingCount: 0 });
  const [minutesSaved, setMinutesSaved] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    if (!shop) return;

    const fetchMetrics = async () => {
      setMetricsLoading(true);

      const today = startOfDay(new Date());
      const dates = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
      const chartMap = dates.reduce((acc, date) => {
        acc[format(date, 'MMM dd')] = { date: format(date, 'MMM dd'), positive: 0, negative: 0 };
        return acc;
      }, {});

      const [totalRes, positiveRes, negativeRes, recentRes, feedbackRes, pendingRepliesRes, allRatingsRes, totalRepliesRes, googleCacheRes] = await Promise.all([
        supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('shop_id', shop.id),
        supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('shop_id', shop.id).gte('rating', 4),
        supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('shop_id', shop.id).lte('rating', 3),
        supabase.from('feedback').select('id, rating, message, customer_name, created_at').eq('shop_id', shop.id).lte('rating', 3).order('created_at', { ascending: false }).limit(5),
        supabase.from('feedback').select('rating, created_at').eq('shop_id', shop.id).gte('created_at', dates[0].toISOString()),
        supabase.from('review_responses').select('*', { count: 'exact', head: true }).eq('shop_id', shop.id).eq('sent', false),
        supabase.from('feedback').select('rating').eq('shop_id', shop.id),
        supabase.from('review_responses').select('*', { count: 'exact', head: true }).eq('shop_id', shop.id),
        supabase.from('cached_reviews').select('overall_rating, total_ratings').eq('shop_id', shop.id).eq('platform', 'google').maybeSingle(),
      ]);

      if (feedbackRes.data) {
        feedbackRes.data.forEach(item => {
          const dateStr = format(new Date(item.created_at), 'MMM dd');
          if (chartMap[dateStr]) {
            if (item.rating >= 4) chartMap[dateStr].positive += 1;
            else chartMap[dateStr].negative += 1;
          }
        });
      }

      // Star target calculation — prefer Google's real rating if cached, else fall back to feedback table
      const googleCache = googleCacheRes.data;
      let ratingCount, ratingSum, avgRating, starSource;
      if (googleCache?.overall_rating && googleCache?.total_ratings) {
        avgRating = googleCache.overall_rating;
        ratingCount = googleCache.total_ratings;
        ratingSum = avgRating * ratingCount;
        starSource = 'google';
      } else {
        const allRatings = allRatingsRes.data ?? [];
        ratingCount = allRatings.length;
        ratingSum = allRatings.reduce((s, r) => s + r.rating, 0);
        avgRating = ratingCount > 0 ? ratingSum / ratingCount : 0;
        starSource = 'feedback';
      }
      const nextMilestone = Math.min(parseFloat((Math.floor(avgRating * 10 + 1) / 10).toFixed(1)), 5.0);
      const prevMilestone = parseFloat((nextMilestone - 0.1).toFixed(1));
      const reviewsNeeded = avgRating < 4.95
        ? Math.max(1, Math.ceil((nextMilestone * ratingCount - ratingSum) / (5 - nextMilestone)))
        : 0;
      const progressPct = ratingCount > 0
        ? Math.min(100, Math.max(0, ((avgRating - prevMilestone) / 0.1) * 100))
        : 0;

      setMetrics({
        totalScans: totalRes.count ?? 0,
        reviewsGained: positiveRes.count ?? 0,
        negativeFeedback: negativeRes.count ?? 0,
        pendingReplies: pendingRepliesRes.count ?? 0,
      });
      setStarData({ avgRating, nextMilestone, prevMilestone, reviewsNeeded, progressPct, ratingCount, starSource });
      setMinutesSaved((totalRepliesRes.count ?? 0) * 3);
      setChartData(Object.values(chartMap));
      setRecentFeedback(recentRes.data ?? []);
      setMetricsLoading(false);
    };

    fetchMetrics();
  }, [shop, fetchTrigger]);

  const loading = shopLoading || metricsLoading;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px', fontWeight: 700 }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Welcome back to your central reputation hub.</p>
        </div>
        <button className="stakent-btn primary" onClick={() => setFetchTrigger(t => t + 1)} disabled={metricsLoading}>
          <RefreshCw size={15} style={{ animation: metricsLoading ? 'spin 1s linear infinite' : 'none' }} />
          {metricsLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Top metrics */}
      <div className="dashboard-grid">
        <MetricCard
          title="Total Scans"
          value={loading ? '—' : metrics.totalScans}
          icon={<div style={{ fontWeight: 'bold', fontSize: '18px', color: '#fff' }}>QR</div>}
          trend={+12.5}
        />
        <MetricCard
          title="Google Reviews Gained"
          value={loading ? '—' : metrics.reviewsGained}
          icon={<Star size={20} color="#9b2df2" />}
          trend={+4.2}
        />
        <MetricCard
          title="Negative Feedback Blocked"
          value={loading ? '—' : metrics.negativeFeedback}
          icon={<ShieldAlert size={20} color="#ff2d55" />}
          trend={-1.8}
        />
        <MetricCard
          title="Replies Pending"
          value={loading ? '—' : metrics.pendingReplies}
          icon={<MessageSquare size={20} color="#c084fc" />}
        />
      </div>

      {/* Star Target + Time Saved */}
      <div className="dashboard-grid cols-2" style={{ marginTop: '24px' }}>
        <StarTargetCard starData={starData} loading={loading} />
        <TimeSavedCard minutesSaved={minutesSaved} loading={loading} />
      </div>

      {/* Chart + Recent Feedback */}
      <div className="dashboard-grid cols-2" style={{ marginTop: '24px' }}>

        <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          <div className="bg-glow purple" style={{ top: '-10%', right: '-10%', width: '300px', height: '300px', opacity: 0.3 }} />

          <div className="card-title" style={{ fontSize: '1.25rem', color: '#fff' }}>
            7-Day Engagement Trend
            <span className="pill-badge" style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>Weekly</span>
          </div>

          <div style={{ flex: 1, minHeight: 0, zIndex: 1, marginTop: '24px' }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading chart data...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b2df2" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#2b58ff" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff2d55" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ff2d55" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dx={-10} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="positive" stroke="#9b2df2" fillOpacity={1} fill="url(#colorPositive)" strokeWidth={3} activeDot={{ r: 6, fill: '#111218', stroke: '#9b2df2', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="negative" stroke="#ff2d55" fillOpacity={1} fill="url(#colorNegative)" strokeWidth={3} activeDot={{ r: 6, fill: '#111218', stroke: '#ff2d55', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Feedback Panel */}
        <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}>
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Recent Private Feedback</h3>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '24px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Loading feedback...
              </div>
            ) : recentFeedback.length === 0 ? (
              <div style={{ padding: '24px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                <p>No negative feedback yet. Great job!</p>
              </div>
            ) : (
              recentFeedback.map((item) => (
                <div key={item.id} style={{
                  padding: '24px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14}
                          fill={s <= item.rating ? '#ff2d55' : 'transparent'}
                          color={s <= item.rating ? '#ff2d55' : 'rgba(255,255,255,0.1)'}
                        />
                      ))}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '6px', fontWeight: 500 }}>
                        {item.customer_name || 'Anonymous'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.5 }}>"{item.message}"</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {format(new Date(item.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

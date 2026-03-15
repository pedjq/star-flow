import { useState, useEffect } from 'react';
import { Star, ShieldAlert, Sparkles } from 'lucide-react';
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

const Overview = () => {
  const { shop, loading: shopLoading } = useShop();
  const [metrics, setMetrics] = useState({ totalScans: 0, reviewsGained: 0, negativeFeedback: 0, aiReplies: 0 });
  const [chartData, setChartData] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(true);

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

      const [totalRes, positiveRes, negativeRes, recentRes, feedbackRes, aiRepliesRes] = await Promise.all([
        supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('shop_id', shop.id),
        supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('shop_id', shop.id).gte('rating', 4),
        supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('shop_id', shop.id).lte('rating', 3),
        supabase.from('feedback').select('id, rating, message, customer_name, created_at').eq('shop_id', shop.id).lte('rating', 3).order('created_at', { ascending: false }).limit(5),
        supabase.from('feedback').select('rating, created_at').eq('shop_id', shop.id).gte('created_at', dates[0].toISOString()),
        supabase.from('review_responses').select('*', { count: 'exact', head: true }).eq('shop_id', shop.id),
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

      setMetrics({
        totalScans: totalRes.count ?? 0,
        reviewsGained: positiveRes.count ?? 0,
        negativeFeedback: negativeRes.count ?? 0,
        aiReplies: aiRepliesRes.count ?? 0,
      });
      setChartData(Object.values(chartMap));
      setRecentFeedback(recentRes.data ?? []);
      setMetricsLoading(false);
    };

    fetchMetrics();
  }, [shop]);

  const loading = shopLoading || metricsLoading;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px', fontWeight: 700 }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Welcome back to your central reputation hub.</p>
        </div>
        <button className="stakent-btn primary">
          Refresh Data
        </button>
      </div>

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
          title="AI Replies Drafted"
          value={loading ? '—' : metrics.aiReplies}
          icon={<Sparkles size={20} color="#f4a017" />}
        />
      </div>

      <div className="dashboard-grid cols-2" style={{ marginTop: '24px' }}>
        
        {/* Real Data Chart matching landing page glow aesthetic */}
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
                    {format(new Date(item.created_at), 'MMM dd')}
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

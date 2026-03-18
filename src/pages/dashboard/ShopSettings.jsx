import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../hooks/useShop';

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--glass-border)',
  color: 'white',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  fontSize: '0.9375rem',
};

const Label = ({ children }) => (
  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
    {children}
  </label>
);

const FieldHint = ({ children }) => (
  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
    {children}
  </p>
);

const SectionTitle = ({ children }) => (
  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '16px' }}>
    {children}
  </div>
);

const ShopSettings = () => {
  const { user } = useAuth();
  const { shop, loading: shopLoading, refetch } = useShop();

  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    googleMapsUrl: '',
    placeId: '',
    persona: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (shop) {
      setFormData({
        shopName: shop.name ?? '',
        address: shop.address ?? '',
        googleMapsUrl: shop.google_maps_url ?? '',
        placeId: shop.place_id ?? '',
        persona: shop.persona ?? '',
      });
    }
  }, [shop]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    const { error } = await supabase.from('shops').upsert(
      {
        user_id: user.id,
        name: formData.shopName,
        address: formData.address,
        google_maps_url: formData.googleMapsUrl,
        place_id: formData.placeId,
        persona: formData.persona,
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      setSaveError(error.message);
    } else {
      await refetch();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: '720px' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Settings</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.9375rem' }}>Configure your QR routing and AI response voice.</p>

      {shopLoading ? (
        <div style={{ color: 'var(--text-secondary)', padding: '40px 0' }}>Loading...</div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Business Info */}
          <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SectionTitle>Business Info</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <Label>Shop Name</Label>
                <input name="shopName" value={formData.shopName} onChange={handleChange} style={inputStyle} placeholder="e.g. The Coffee Corner" />
              </div>
              <div>
                <Label>Address</Label>
                <input name="address" value={formData.address} onChange={handleChange} style={inputStyle} placeholder="123 Main St, City" />
              </div>
            </div>
          </div>

          {/* Google Links */}
          <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SectionTitle>Google Links</SectionTitle>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <Label>Review Link</Label>
                <a href="https://business.google.com/locations" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  Find it →
                </a>
              </div>
              <input name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} style={inputStyle} placeholder="https://g.page/r/..." />
              <FieldHint>In Google Business Profile → "Ask for reviews" → copy the link. Happy customers are sent here automatically.</FieldHint>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <Label>Place ID</Label>
                <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  Find it →
                </a>
              </div>
              <input name="placeId" value={formData.placeId} onChange={handleChange} style={inputStyle} placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4" />
              <FieldHint>Used to fetch your Google reviews for AI response drafting.</FieldHint>
            </div>
          </div>

          {/* AI Persona */}
          <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SectionTitle>AI Voice</SectionTitle>
            <div>
              <Label>Business Personality</Label>
              <textarea
                name="persona"
                value={formData.persona}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Warm, family-owned coffee shop in the city centre. Casual and friendly tone, we know our regulars by name."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              />
              <FieldHint>The AI uses this to write replies that sound like your brand, not a robot.</FieldHint>
            </div>
          </div>

          {/* Save bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
            {saveSuccess && <span style={{ color: 'var(--accent-green)', fontSize: '0.875rem' }}>Saved</span>}
            {saveError && <span style={{ color: '#ff6b8a', fontSize: '0.875rem' }}>{saveError}</span>}
            <button
              type="submit"
              className="stakent-btn primary"
              style={{ padding: '12px 28px', fontSize: '0.9375rem', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
              disabled={saving}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      )}
    </div>
  );
};

export default ShopSettings;

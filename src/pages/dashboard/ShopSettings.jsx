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
};

const ShopSettings = () => {
  const { user } = useAuth();
  const { shop, loading: shopLoading } = useShop();

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

  // Pre-fill form once shop data loads
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
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Store Settings</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Manage the destination of your smart QR code and data sources.</p>

      {shopLoading ? (
        <div style={{ color: 'var(--text-secondary)', padding: '40px 0' }}>Loading your settings...</div>
      ) : (
        <form onSubmit={handleSave} className="stakent-card" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>Public Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Shop Name</label>
                <input name="shopName" value={formData.shopName} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Store Address</label>
                <input name="address" value={formData.address} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>Routing & External Data</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Google Maps Share URL (For 4/5 Star Routing)</label>
                  <a href="https://business.google.com/locations" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    Find your link →
                  </a>
                </div>
                <input name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} style={inputStyle} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  In Google Business Profile, click "Ask for reviews" and copy the link.
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Google Place ID (For syncing reviews to Content Studio)</label>
                  <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    Find your Place ID →
                  </a>
                </div>
                <input name="placeId" value={formData.placeId} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>AI Response Persona</h3>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Business Voice</label>
              <textarea
                name="persona"
                value={formData.persona}
                onChange={handleChange}
                rows={4}
                placeholder="e.g. Warm, family-owned coffee shop in the city centre. Casual and friendly tone, we know our regulars by name."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Describe your business personality. The AI uses this to write replies that sound like you.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            {saveSuccess && (
              <span style={{ color: 'var(--accent-green)', fontSize: '0.875rem' }}>Saved successfully</span>
            )}
            {saveError && (
              <span style={{ color: '#ff6b8a', fontSize: '0.875rem' }}>{saveError}</span>
            )}
            <button
              type="submit"
              className="stakent-btn primary"
              style={{ padding: '12px 32px', fontSize: '1rem', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
              disabled={saving}
            >
              <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      )}
    </div>
  );
};

export default ShopSettings;

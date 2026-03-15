import { useRef } from 'react';
import { QRCode } from 'react-qr-code';
import { Download, ShoppingBag } from 'lucide-react';
import { useShop } from '../../hooks/useShop';

const QRManagement = () => {
  const qrRef = useRef(null);
  const { shop, loading } = useShop();
  const qrUrl = shop ? `${window.location.origin}/rate/${shop.id}` : '';

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StarFlow-QR-${shop?.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>QR Management</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Download your digital QR code or order physical displays.</p>
        <div style={{ color: 'var(--text-secondary)' }}>Loading your QR code...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>QR Management</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Download your digital QR code or order physical displays.</p>
        <div className="stakent-card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          Please complete your <a href="/dashboard/settings" style={{ color: '#fff' }}>Shop Settings</a> first to generate your QR code.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>QR Management</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Download your digital QR code or order physical displays.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '32px', '@media(min-width: 768px)': { gridTemplateColumns: '1fr 1fr' } }}>

        {/* Digital download section */}
        <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            ref={qrRef}
            style={{ 
              background: 'white', 
              padding: '24px', 
              borderRadius: '24px', 
              marginBottom: '32px',
              border: '4px solid #fff'
            }}
          >
            <QRCode value={qrUrl} size={200} fgColor="#000000" bgColor="#ffffff" />
          </div>
          
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Digital QR Code</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.875rem' }}>
            Download the high-resolution vector file (SVG) to print on your own marketing materials.
          </p>

          <button onClick={handleDownloadQR} className="stakent-btn primary" style={{ width: '100%', padding: '16px', fontSize: '1rem' }}>
            <Download size={18} /> Download Code
          </button>
        </div>

        {/* Physical shop section */}
        <div className="stakent-card" style={{ display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Order Physical Displays</h3>
           <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.875rem' }}>
            Get premium acrylic stands or NFC-enabled stickers for your checkout counter.
           </p>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: 'auto' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
               <div>
                 <div style={{ fontWeight: 600 }}>Acrylic Check-out Stand</div>
                 <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>NFC + QR Combo</div>
               </div>
               <div style={{ fontWeight: 600 }}>$29.99</div>
             </div>
             
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
               <div>
                 <div style={{ fontWeight: 600 }}>Vinyl Window Stickers (x5)</div>
                 <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Weather-proof</div>
               </div>
               <div style={{ fontWeight: 600 }}>$14.99</div>
             </div>
           </div>

           <button className="stakent-btn" style={{ marginTop: '32px', padding: '16px', width: '100%', fontSize: '1rem' }}>
            <ShoppingBag size={18} /> Place Order
           </button>
        </div>

      </div>
    </div>
  );
};

export default QRManagement;

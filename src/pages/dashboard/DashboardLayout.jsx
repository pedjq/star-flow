import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, QrCode, Settings, LogOut, Sparkles } from 'lucide-react';
import Overview from './Overview';
import ContentStudio from './ContentStudio';
import QRManagement from './QRManagement';
import ShopSettings from './ShopSettings';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Content Studio', path: '/dashboard/content', icon: <ImageIcon size={20} /> },
    { name: 'QR Management', path: '/dashboard/qr', icon: <QrCode size={20} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0b0c10' }}>
      
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 20px',
        background: '#13141a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.25rem', marginBottom: '40px', letterSpacing: '-0.02em', paddingLeft: '8px' }}>
          <div style={{ background: 'linear-gradient(135deg, #9b2df2, #2b58ff)', color: '#fff', padding: '6px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(155, 45, 242, 0.4)' }}>
            <Sparkles size={16} fill="currentColor" />
          </div>
          <span>Star.<span className="text-accent">Flow</span></span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? '#fff' : '#8c8c9a',
                background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s',
              })}
            >
              {({ isActive }) => (
                <>
                  <div style={{ color: isActive ? '#9b2df2' : 'inherit' }}>{item.icon}</div>
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            background: 'transparent',
            color: '#8c8c9a',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '1rem',
            textAlign: 'left',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = '#8c8c9a'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', position: 'relative' }}>
        <div className="bg-glow blue" style={{ top: '-10%', right: '-10%', width: '400px', height: '400px', opacity: 0.1 }} />
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/content" element={<ContentStudio />} />
            <Route path="/qr" element={<QRManagement />} />
            <Route path="/settings" element={<ShopSettings />} />
          </Routes>
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;

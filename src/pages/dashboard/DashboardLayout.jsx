import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, QrCode, Settings, LogOut, Sparkles, MessageSquare } from 'lucide-react';
import Overview from './Overview';
import QRManagement from './QRManagement';
import ShopSettings from './ShopSettings';
import Responses from './Responses';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Overview',       path: '/dashboard',          icon: LayoutDashboard, exact: true },
  { name: 'Responses',      path: '/dashboard/responses',icon: MessageSquare },
  { name: 'QR',             path: '/dashboard/qr',       icon: QrCode },
  { name: 'Settings',       path: '/dashboard/settings', icon: Settings },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100svh', display: 'flex', background: '#0b0c10', overflow: 'hidden' }}>

      {/* ── Sidebar (desktop) ── */}
      <aside className="dash-sidebar" style={{
        width: '260px',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 20px',
        background: '#13141a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.25rem', marginBottom: '40px', letterSpacing: '-0.02em', paddingLeft: '8px' }}>
          <div style={{ background: 'linear-gradient(135deg, #9b2df2, #2b58ff)', color: '#fff', padding: '6px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(155,45,242,0.4)' }}>
            <Sparkles size={16} fill="currentColor" />
          </div>
          <span>Star.<span className="text-accent">Flow</span></span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
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
                    <div style={{ color: isActive ? '#9b2df2' : 'inherit' }}><Icon size={20} /></div>
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '12px', border: 'none',
            background: 'transparent', color: '#8c8c9a', cursor: 'pointer',
            fontWeight: 500, fontSize: '1rem', textAlign: 'left',
            transition: 'all 0.2s', fontFamily: 'inherit',
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = '#8c8c9a'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="dash-main" style={{ flex: 1, minWidth: 0, padding: '40px', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
        <div className="bg-glow blue" style={{ top: '-10%', right: '-10%', width: '400px', height: '400px', opacity: 0.1 }} />
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Routes>
            <Route path="/"          element={<Overview />} />
            <Route path="/responses" element={<Responses />} />
            <Route path="/qr"        element={<QRManagement />} />
            <Route path="/settings"  element={<ShopSettings />} />
          </Routes>
        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} color={isActive ? '#9b2df2' : '#8c8c9a'} />
                  <span style={{ color: isActive ? '#9b2df2' : '#8c8c9a' }}>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
        <button className="nav-logout" onClick={handleLogout}>
          <LogOut size={22} color="#8c8c9a" />
          <span>Logout</span>
        </button>
      </nav>

    </div>
  );
};

export default DashboardLayout;

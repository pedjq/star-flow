import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ScanExperience from './pages/ScanExperience';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

const NoiseOverlay = () => (
  <svg 
    className="noise-overlay" 
    style={{ 
      position: 'fixed', inset: 0, width: '100vw', height: '100vh', 
      pointerEvents: 'none', zIndex: 9999, opacity: 0.15,
      mixBlendMode: 'overlay'
    }}
  >
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

function App() {
  return (
    <BrowserRouter>
      <NoiseOverlay />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rate/:shopId" element={<ScanExperience />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

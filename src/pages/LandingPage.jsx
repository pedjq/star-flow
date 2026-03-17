import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import DashboardShowcase from '../components/landing/DashboardShowcase';
import Features from '../components/landing/Features';
import Campaigns from '../components/landing/Campaigns';
import Comparison from '../components/landing/Comparison';
import Pricing from '../components/landing/Pricing';
import Hardware from '../components/landing/Hardware';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Background Orbs */}
      <div className="bg-glow purple" style={{ top: '-10%', left: '-5%', width: '500px', height: '500px' }} />
      <div className="bg-glow blue" style={{ top: '20%', right: '-10%', width: '600px', height: '600px' }} />
      <div className="bg-glow pink" style={{ bottom: '10%', left: '20%', width: '400px', height: '400px', opacity: 0.5 }} />

      <Header />
      
      <main>
        <Hero />
        <Stats />
        <DashboardShowcase />
        <Features />
        <Campaigns />
        <Comparison />
        <Pricing />
        <Hardware />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;

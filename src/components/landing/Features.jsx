import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const QRGraphic = () => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {/* Ambient Glow */}
    <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'rgba(155, 45, 242, 0.2)', filter: 'blur(50px)', borderRadius: '50%' }} />
    
    <motion.div 
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      style={{
        width: '180px', height: '200px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}
    >
      <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '50%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>☕</div>
      <div style={{ width: '60%', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '4px', marginBottom: '24px' }} />
      
      <div style={{ width: '90px', height: '90px', background: '#fff', borderRadius: '12px', position: 'relative', padding: '8px' }}>
        <div style={{ width: '100%', height: '100%', border: '4px dashed #000', borderRadius: '8px' }} />
        {/* Laser scanner animation */}
        <motion.div
           animate={{ top: ['0%', '100%', '0%'] }}
           transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
           style={{ position: 'absolute', left: 4, right: 4, height: '2px', background: '#fff', boxShadow: '0 0 12px 2px #fff', zIndex: 10 }}
        />
      </div>
    </motion.div>
  </div>
);

const RatingGraphic = () => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'rgba(43, 88, 255, 0.15)', filter: 'blur(60px)', borderRadius: '50%' }} />
     
     <motion.div 
       animate={{ y: [0, -5, 0] }}
       transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
       style={{
         background: 'rgba(10, 10, 11, 0.9)',
         border: '1px solid rgba(255,255,255,0.1)',
         borderRadius: '24px',
         padding: '24px',
         width: '240px',
         boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
         position: 'relative',
         display: 'flex', flexDirection: 'column', alignItems: 'center'
       }}
     >
       <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <Star size={24} fill="#fff" color="#fff" />
       </div>
       
       <div style={{ width: '80%', height: '6px', background: 'rgba(255,255,255,0.6)', borderRadius: '3px', marginBottom: '8px' }} />
       <div style={{ width: '60%', height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px', marginBottom: '24px' }} />
       
       <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
         {[1,2,3,4,5].map(i => (
           <motion.div
             key={i}
             animate={i === 5 ? { scale: [1, 1.2, 1] } : {}}
             transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
           >
             <Star size={24} fill="#fff" color={i === 5 ? '#fff' : 'transparent'} style={{ opacity: i === 5 ? 1 : 0.2 }} />
           </motion.div>
         ))}
       </div>
       
       <motion.div 
         initial={{ opacity: 0, scale: 0.8 }}
         animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], y: [10, 0, 0, -10] }}
         transition={{ repeat: Infinity, duration: 4 }}
         style={{ 
           background: '#fff', color: '#000', padding: '10px 16px', width: '100%',
           borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, 
           display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
           boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
         }}
       >
         To Google Reviews &rarr;
       </motion.div>
     </motion.div>
  </div>
);

const ContentGraphic = () => (
   <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
       <div style={{ position: 'absolute', width: '220px', height: '220px', background: 'rgba(255, 105, 180, 0.15)', filter: 'blur(50px)', borderRadius: '50%' }} />

       <motion.div 
         animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
         transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
         style={{
           width: '200px', height: '220px',
           background: '#0a0a0c',
           border: '1px solid rgba(255,255,255,0.1)',
           borderRadius: '16px',
           padding: '16px',
           display: 'flex', flexDirection: 'column',
           boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
           position: 'relative',
           overflow: 'hidden'
         }}
       >
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(155, 45, 242, 0.2)', filter: 'blur(20px)', borderRadius: '50%' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', zIndex: 1 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>Star.Flow</div>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="#fff" color="#fff" />)}
            </div>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1, marginBottom: 'auto' }}>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.8)', borderRadius: '3px', marginBottom: '8px' }} />
            <div style={{ width: '80%', height: '6px', background: 'rgba(255,255,255,0.6)', borderRadius: '3px', marginBottom: '8px' }} />
            <div style={{ width: '60%', height: '6px', background: 'rgba(255,255,255,0.4)', borderRadius: '3px', marginBottom: '16px' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ffeedd' }} />
               <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.5)', borderRadius: '2px' }} />
            </div>
          </div>

          <motion.div 
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ repeat: Infinity, duration: 2 }}
             style={{ 
               background: 'linear-gradient(90deg, #9b2df2, #2b58ff)', 
               color: '#fff', padding: '8px 16px', width: '100%',
               borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
               boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
               textAlign: 'center',
               zIndex: 1
             }}
          >
             Download PNG
          </motion.div>
       </motion.div>
   </div>
);

const FeatureCard = ({ number, title, description, graphic, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="glass-panel"
    style={{
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      height: '480px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 600, width: '80%', lineHeight: 1.3 }}>{title}</h3>
      <span style={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(255,255,255,0.1)' }}>{number}</span>
    </div>
    <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '40px', zIndex: 1, position: 'relative' }}>
      {description}
    </p>
    
    <div style={{ flex: 1, position: 'relative', width: '100%' }}>
      {graphic}
    </div>
  </motion.div>
);

const Features = () => {
  return (
    <section id="works" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '800px', margin: '0 auto' }}>
          <span className="pill-badge gradient" style={{ marginBottom: '24px' }}>How it works</span>
          <h2 style={{ fontSize: '3rem', marginBottom: '24px', lineHeight: 1.2 }}>
            3 Easy steps to clone your <br />
            <span className="text-accent">Google Reviews</span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
            Scan, Filter, Amplify: Automatically capture feedback and instantly convert your happiest customers into your best marketers.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <FeatureCard 
            number="1"
            title="Scan & Rate at Checkout"
            description="Customers scan your sleek QR code and are instantly met with a beautiful, zero-friction rating screen."
            delay={0.1}
            graphic={<QRGraphic />}
          />
          <FeatureCard 
            number="2"
            title="The Smart 5-Star Filter"
            description="4 and 5-star ratings route instantly to Google Maps. 1 to 3-star reviews are kept private in your dashboard."
            delay={0.2}
            graphic={<RatingGraphic />}
          />
          <FeatureCard 
            number="3"
            title="AI Content Generation"
            description="We seamlessly pull your new 5-star Google reviews into premium, ready-to-post social media templates."
            delay={0.3}
            graphic={<ContentGraphic />}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;

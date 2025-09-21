import React, { useState, useEffect, useRef } from 'react';

const Header = () => {
  const [distance, setDistance] = useState(7);
  const [isVisible, setIsVisible] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState({
    position: 'fixed',
    top: '80px'
  });
  const sidebarRef = useRef(null);

  // Distance simulation effect
  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setDistance(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newDistance = prev + change;
        return Math.max(3, Math.min(15, newDistance));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Improved sidebar positioning logic
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('footer');
      const sidebar = sidebarRef.current;
      
      if (!footer || !sidebar) return;

      const navbarHeight = 80;
      const sidebarHeight = sidebar.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Get footer position
      const footerRect = footer.getBoundingClientRect();
      const footerTop = footerRect.top + scrollTop;
      
      // Calculate if we need to switch to absolute positioning
      const footerDistanceFromTop = footerTop - scrollTop;
      const sidebarBottom = navbarHeight + sidebarHeight;
      
      if (footerDistanceFromTop <= sidebarBottom) {
        // Footer is approaching - use absolute positioning
        setSidebarStyle({
          position: 'absolute',
          top: `${Math.max(footerTop - sidebarHeight, navbarHeight)}px`
        });
      } else {
        // Normal fixed positioning
        setSidebarStyle({
          position: 'fixed',
          top: `${navbarHeight}px`
        });
      }
    };

    // Throttled scroll handler for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
 <>
  {/* Inline styles for animations */}
  <style dangerouslySetInnerHTML={{
    __html: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes glow {
        0% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
        100% { box-shadow: 0 0 25px rgba(16, 185, 129, 0.4), 0 0 35px rgba(16, 185, 129, 0.2); }
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
      }
      
      @keyframes shimmer-button {
        0% { transform: translateX(-100%) skewX(-12deg); }
        100% { transform: translateX(200%) skewX(-12deg); }
      }
      
      @keyframes pulse-ring {
        0% { transform: scale(0.8); opacity: 1; }
        100% { transform: scale(2.4); opacity: 0; }
      }
      
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-glow { animation: glow 2s infinite alternate; }
      .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
      .animate-shimmer-button { animation: shimmer-button 2s infinite; }
      .animate-pulse-ring { animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
    `
  }} />
  
  <aside 
    ref={sidebarRef}
    className={`w-80 mt-0 left-0 z-40 transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
    }`}
    style={{
      position: sidebarStyle.position,
      top: sidebarStyle.top,
      height: sidebarStyle.position === 'fixed' ? `calc(100vh - ${sidebarStyle.top})` : 'auto',
      background: 'linear-gradient(145deg, rgba(224, 183, 190, 0.95) 0%, rgba(246, 177, 154, 0.95) 50%, rgba(223, 174, 183, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    }}
  >
    <div className="h-full flex flex-col p-4 overflow-y-auto">
    
      {/* Title */}
      <h1 
        className="text-2xl font-bold text-black mb-3 text-center flex-shrink-0"
        style={{ 
          textShadow: '2px 2px 8px rgba(255,255,255,0.4)'
        }}
      >
        Lost & Found
      </h1>
      
      {/* Description */}
      <p 
        className="text-black/90 text-center mb-4 leading-relaxed text-sm flex-shrink-0"
        style={{ textShadow: '1px 1px 3px rgba(255,255,255,0.2)' }}
      >
        Never lose track of your loved ones. Our RFID tracking system helps you stay connected.
      </p>
      
      {/* Contact Information - Scrollable content */}
      <div className="bg-white/15 backdrop-blur-xl rounded-xl p-4 mb-4 border border-white/20 flex-1 overflow-y-auto min-h-[200px]"
           style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 5px 15px rgba(0, 0, 0, 0.1)' }}>
        
        <h3 className="text-black font-bold text-base mb-3 flex items-center sticky top-0 bg-white/5 -mx-4 -mt-4 px-4 pt-4 pb-2 backdrop-blur-sm rounded-t-xl">
          Administration Contact
        </h3>
        
        <div className="space-y-2">
          {/* Toll Free Number */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <span className="text-black/80 text-sm">Toll Free:</span>
            <span className="text-black font-bold text-sm group-hover:text-yellow-600 transition-colors duration-300">
              1800-00-123
            </span>
          </div>
          
          {/* Emergency Contact */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <span className="text-black/80 text-sm">Emergency:</span>
            <span className="text-black font-bold text-sm group-hover:text-red-600 transition-colors duration-300">
              +91-9999-888-777
            </span>
          </div>
          
          {/* Live Distance to Admin Booth */}
          <div className="flex items-center justify-between bg-emerald-500/25 rounded-lg p-3 border border-emerald-400/40 relative overflow-hidden animate-glow">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 animate-shimmer"></div>
            <span className="text-black flex items-center relative z-10 text-sm">
              <div className="relative mr-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full block animate-pulse shadow-lg shadow-emerald-400/50"></span>
                <span className="absolute inset-0 w-2 h-2 bg-emerald-400/30 rounded-full animate-pulse-ring"></span>
              </div>
              Admin Booth:
            </span>
            <span className="text-emerald-700 font-bold text-sm relative z-10 animate-pulse">
              {distance}m away
            </span>
          </div>
          
          {/* Additional Contact Info */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <span className="text-black/80 text-sm">Email:</span>
            <span className="text-black font-bold text-sm group-hover:text-blue-600 transition-colors duration-300">
              help@lostandfound.com
            </span>
          </div>
          
        </div>
      </div>
      
      {/* Emergency Button */}
      <button className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden group flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:animate-shimmer-button transition-transform duration-700"></div>
        <span className="relative flex items-center justify-center text-sm">
          Emergency Help
        </span>
      </button>
    </div>
  </aside>
</>

  );
};

export default Header;



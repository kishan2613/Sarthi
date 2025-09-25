import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Popup Component with API Integration
const Popup = ({ ghat, isVisible, position, onClose }) => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fixed image paths - Remove leading slash if using public folder
  const ghatImageFiles = {
    "Ghat 1": "testing1.png",
    "Ghat 2": "testing2.jpg", 
    "Ghat 3": "testing3.jpg",
    "Ghat 4": "testing6.jpg",
  };

  const ghatDisplayImages = {
    'Gate 1': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
    'Gate 2': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=200&fit=crop',
    'Gate 3': 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=400&h=200&fit=crop',
    'Gate 4': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop'
  };

  // Fixed API call function
  const fetchCrowdData = async (ghatName) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔍 Fetching data for: ${ghatName}`);
      
      // Get the image filename
      const imageFileName = ghatImageFiles[ghatName];
      if (!imageFileName) {
        throw new Error(`No image file defined for gate: ${ghatName}`);
      }

      console.log(`📸 Loading image: ${imageFileName}`);

      // Fetch the image file from public folder
      const imageResponse = await fetch(`/${imageFileName}`);
      if (!imageResponse.ok) {
        throw new Error(`Failed to load image: ${imageFileName} (${imageResponse.status})`);
      }

      const imageBlob = await imageResponse.blob();
      console.log(`✅ Image loaded: ${imageBlob.size} bytes, type: ${imageBlob.type}`);

      // Create proper file object
      const imageFile = new File([imageBlob], imageFileName, { 
        type: imageBlob.type || 'image/jpeg' 
      });

      // Create FormData
      const formData = new FormData();
      formData.append('image', imageFile);

      console.log(`🚀 Calling API: http://localhost:3000/predict`);

      // Call your API with proper error handling
      const response = await fetch('http://localhost:3000/predict', {
        method: 'POST',
        body: formData,
        // Remove Content-Type header - let browser set it for FormData
      });

      console.log(`📡 API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error Response:`, errorText);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ API Success:`, data);
      
      if (!data.success) {
        throw new Error(data.error || 'API returned success: false');
      }

      setApiData(data);
      
    } catch (err) {
      console.error('❌ Error in fetchCrowdData:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Test function to check if image exists
  const testImageAccess = async (ghatName) => {
    const imageFileName = ghatImageFiles[ghatName];
    try {
      const response = await fetch(`/${imageFileName}`);
      console.log(`🧪 Image test for ${imageFileName}:`, response.status, response.ok);
      return response.ok;
    } catch (err) {
      console.log(`🧪 Image test failed for ${imageFileName}:`, err);
      return false;
    }
  };

  // Fetch data when ghat changes
  useEffect(() => {
    if (ghat && isVisible) {
      // Test image access first
      testImageAccess(ghat.name).then(accessible => {
        if (accessible) {
          fetchCrowdData(ghat.name);
        } else {
          setError(`Image file not found: ${ghatImageFiles[ghat.name]}`);
        }
      });
    }
  }, [ghat, isVisible]);

  const getDensityInfo = (congestionData) => {
    if (!congestionData) return { 
      label: 'Loading...', 
      color: 'text-gray-600', 
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
      icon: '⏳',
      border: 'border-gray-200'
    };

    const highPercent = congestionData.high_congestion_percent || 0;
    
    if (highPercent >= 20) return { 
      label: 'Very High', 
      color: 'text-red-600', 
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      icon: '🔴',
      border: 'border-red-200'
    };
    if (highPercent >= 10) return { 
      label: 'High', 
      color: 'text-yellow-600', 
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      icon: '🟡',
      border: 'border-yellow-200'
    };
    if (highPercent >= 5) return { 
      label: 'Medium', 
      color: 'text-orange-600', 
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      icon: '🟠',
      border: 'border-orange-200'
    };
    return { 
      label: 'Low', 
      color: 'text-green-600', 
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      icon: '🟢',
      border: 'border-green-200'
    };
  };

  // Determine popup position based on ghat location
const getPopupPosition = () => ({
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)', // perfect centering
  position: 'absolute',
  zIndex: 1000, // ensure on top, optional
});

const densityInfo = getDensityInfo(apiData?.congestion_analysis);

  return (
    <AnimatePresence>
      {ghat && isVisible && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed z-50 p-4"
            style={{
              top: '10%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 w-full max-w-sm border border-gray-100 shadow-2xl relative">
              {/* --- Header --- */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {ghat.name}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <span className="font-bold">✕</span>
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4 pr-8">
                Live AI-powered crowd analysis for {ghat.name}.
              </p>
              
              {/* --- Content --- */}
              <div className="space-y-4">
                {/* Loading State */}
                {loading && (
                  <div className="text-center py-10">
                    <div className="animate-pulse rounded-full h-16 w-16 bg-gray-200 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Analyzing live crowd data...</p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <p className="text-red-700 font-semibold mb-2">❌ Analysis Failed</p>
                    <p className="text-red-600 text-sm mb-4">{error}</p>
                    <button
                      onClick={() => fetchCrowdData(ghat.name)}
                      className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      🔄 Retry
                    </button>
                  </div>
                )}

                {/* API Data Display */}
                {apiData && !loading && (
                  <>
                    <div className="bg-gray-100 rounded-xl overflow-hidden shadow-inner relative">
                      <img
                        src={`data:image/png;base64,${apiData.images.heatmap_overlay}`}
                        alt={`Heatmap of ${ghat.name}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        AI Heatmap
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Detected Count Card */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <div className="text-3xl font-extrabold text-blue-800">
                          {Math.round(apiData.predicted_count || 0)}
                        </div>
                        <div className="text-sm text-blue-600 font-medium mt-1">People Detected</div>
                      </div>

                      {/* Congestion Level Card */}
                      <div className={`${densityInfo.bgColor} border ${densityInfo.border} rounded-xl p-4 flex flex-col items-center justify-center text-center`}>
                        <div className="text-3xl font-extrabold">
                          {densityInfo.icon}
                        </div>
                        <div className={`text-sm ${densityInfo.color} font-bold mt-1`}>
                          {densityInfo.label}
                        </div>
                      </div>
                    </div>
                    
                    {/* Congestion Breakdown Card with Progress Bar */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className=" grid grid-cols-3 gap-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          <span>High: <b className="text-gray-800">{(apiData.congestion_analysis.high_congestion_percent || 0).toFixed(1)}%</b></span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          <span>Medium: <b className="text-gray-800">{(apiData.congestion_analysis.medium_congestion_percent || 0).toFixed(1)}%</b></span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>Low: <b className="text-gray-800">{(apiData.congestion_analysis.low_congestion_percent || 0).toFixed(1)}%</b></span>
                        </div>
                      </div>
                    </div>

                    {/* --- Footer --- */}
                    <button
                      onClick={() => fetchCrowdData(ghat.name)}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg mt-4"
                    >
                      <span className="inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.836 10H20v-5m-14.028-11.972l-1.884 1.884m18.152 18.152l-1.884-1.884M12 2v2m0 16v2m9-9h-2M3 12H1m15.536-6.464l-1.884 1.884m-10.688 10.688l-1.884-1.884M7 12a5 5 0 1110 0 5 5 0 01-10 0z" />
                        </svg>
                        Refresh Analysis
                      </span>
                    </button>
                  </>
                )}

                {!apiData && !loading && !error && (
                  <div
                    className="w-full h-48 rounded-xl bg-gray-100 overflow-hidden shadow-inner"
                    style={{ backgroundImage: `url(${ghatDisplayImages[ghat.name]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Updated Ghats Component - now triggers API calls
const Ghats = ({ onGhatClick }) => {
  const [ghatsData, setGhatsData] = useState([
    // Left side ghats
    { id: 1, name: "Gate 1", population: 45000, side: "left", position: { top: "60%", right: "80%" } },
    // Right side ghats
    { id: 2, name: "Gate 2", population: 95000, side: "right", position: { top: "60%", right: "12%" } }
  ]);

  const getDensityColor = (population) => {
    const maxPop = 100000;
    const percentage = (population / maxPop) * 100;

    if (percentage >= 80)
      return "from-red-200 via-red-300 to-red-400 border-red-400 shadow-red-300/60";
    if (percentage >= 60)
      return "from-yellow-200 via-yellow-300 to-yellow-400 border-yellow-400 shadow-yellow-300/60";
    if (percentage >= 40)
      return "from-orange-200 via-orange-300 to-orange-400 border-orange-400 shadow-orange-300/60";
    return "from-green-200 via-green-300 to-green-400 border-green-400 shadow-green-300/60";
  };

  const updatePopulation = () => {
    setGhatsData((prevGhats) =>
      prevGhats.map((ghat) => {
        const variation = Math.floor(Math.random() * 4000) - 2000;
        const newPop = Math.max(15000, Math.min(100000, ghat.population + variation));
        return { ...ghat, population: newPop };
      })
    );
  };

  useEffect(() => {
    const interval = setInterval(updatePopulation, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      {ghatsData.map((ghat, index) => (
      <motion.div
      key={ghat.id}
      className={`absolute w-40 h-18 rounded-full cursor-pointer flex items-center justify-center p-2 text-center shadow-lg transition-all duration-300 transform-gpu
        ${getDensityColor(ghat.population)}`}
      style={{
        ...ghat.position,
        border: '3px solid',
      }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.1 },
        scale: { type: 'spring', stiffness: 200, damping: 20, delay: index * 0.1 },
        y: { type: 'spring', stiffness: 200, damping: 20, delay: index * 0.1 },
      }}
      whileHover={{
        scale: 1.15,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        y: -10,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onGhatClick(ghat)}
    >
      <div className="flex flex-col items-center justify-center p-2">
        <div className="text-sm font-bold tracking-wide leading-tight" style={{color: "white", fontWeight: "700"}}>
          {ghat.name}
        </div>
        <div className="text-[10px] font-semibold opacity-85 px-2 py-0.5 rounded-full mt-1 bg-white/40" style={{color: "white", fontWeight: "700"}}>
          Crowd Status
        </div>
      </div>
    </motion.div>
      ))}
    </div>
  );
};

// Main Component
const KumbhMelaMonitor = () => {
  const [selectedGhat, setSelectedGhat] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleGhatClick = (ghat) => {
    setSelectedGhat(ghat);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setTimeout(() => setSelectedGhat(null), 300);
  };

  return (
    <div 
      className="min-h-screen font-sans pt-10"
    >
      <motion.h1 
      className="text-4xl font-bold text-white-800 text-center"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      Temple Monitoring
      <motion.div 
        className="text-2xl font-normal text-white-600 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Real-time Gate Monitoring
      </motion.div>
    </motion.h1>
    {/* User Statistics Section */}
      <motion.div
        className="flex justify-center space-x-6 my-8 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="backdrop-blur-md rounded-2xl p-6 text-center shadow-lg w-56 transform transition-transform duration-300 hover:scale-105" style={{border: "2px dotted white"}}>
          <h3 className="text-4xl font-extrabold text-white">1200</h3>
          <p className="text-sm font-semibold text-white mt-2">Users Registered Today</p>
        </div>
        <div className=" backdrop-blur-md rounded-2xl p-6 text-center shadow-lg w-56 transform transition-transform duration-300 hover:scale-105" style={{border: "2px dotted white"}}>
          <h3 className="text-4xl font-extrabold text-white">
            {Math.floor(Math.random() * (750 - 650 + 1)) + 650}
          </h3>
          <p className="text-sm font-semibold  text-white mt-2">Users seen on Temple Today</p>
        </div>
      </motion.div>
      <motion.div 
        className="w-full h-screen flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >

        
        
        {/* Right Content - Monitoring Area */}
        <div className="w-full relative p-6">
          <motion.div 
            className="w-full h-full bg-white/40 backdrop-blur-xl rounded-3xl border-2 border-orange-200 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              backgroundImage: 'url("/Temple.png")', // Path relative to public/
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Live Indicator */}
            <motion.div 
              className="absolute top-6 right-6 flex items-center text-orange-800 font-bold z-20 bg-white/90 px-4 py-2 rounded-full border border-orange-200 shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
            >
              <motion.div 
                className="w-3 h-3 bg-green-400 rounded-full mr-2"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm">LIVE</span>
            </motion.div>

            
            {/* Ghats */}
            <Ghats onGhatClick={handleGhatClick} />
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Popup */}
      <Popup 
        ghat={selectedGhat}
        isVisible={showPopup}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default KumbhMelaMonitor;

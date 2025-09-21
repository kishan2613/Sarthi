import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MedicalHelpPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    rfid: '',
    medicalHelp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loadingType, setLoadingType] = useState('');
  const [sendBtnState, setSendBtnState] = useState('Send Information');
  const [emergencyBtnState, setEmergencyBtnState] = useState('Emergency Help');

  // Sample nearest health booth distances (in meters)
  const nearestBooths = [5, 8, 12];

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingType('send');
    setIsSuccess(false);
    setSendBtnState('Loading...');
    
    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => {
        console.log('Form submitted:', formData);
        alert('Information sent successfully!');
        setFormData({ name: '', rfid: '', medicalHelp: '' });
        setIsLoading(false);
        setIsSuccess(false);
        setSendBtnState('Send Information');
        onClose();
      }, 2000); // Show success for 2 seconds
    }, 3000);
  };

  const handleEmergency = () => {
    setIsLoading(true);
    setLoadingType('emergency');
    setIsSuccess(false);
    setEmergencyBtnState('Loading...');
    
    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => {
        alert('Emergency help has been contacted!');
        setIsLoading(false);
        setIsSuccess(false);
        setEmergencyBtnState('Emergency Help');
        onClose();
      }, 2000); // Show success for 2 seconds
    }, 3000);
  };

  // Close loading popup
  const handleLoadingClose = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setSendBtnState('Send Information');
    setEmergencyBtnState('Emergency Help');
  };

  // Loading Component
  const LoadingScreen = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center shadow-2xl relative"
        style={{
          background: 'linear-gradient(to right, #F4A391, #E0B9C2, #EACDC6)',
        }}
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleLoadingClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 text-black hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-black hover:bg-opacity-20 transition-all duration-200 backdrop-blur-sm"
        >
          ×
        </motion.button>

        {/* Animated Logo/Medical Cross or Success Checkmark */}
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="loading"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1,
                opacity: 1,
                rotate: 360,
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
              }}
              className="w-20 h-20 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <div className="w-12 h-12 relative">
                <div className="absolute inset-x-1/2 inset-y-0 w-2 bg-red-500 transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute inset-y-1/2 inset-x-0 h-2 bg-red-500 transform -translate-y-1/2 rounded-full"></div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-20 h-20 mx-auto mb-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Text */}
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div key="loading-text">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-black mb-4"
              >
                Processing Request
              </motion.h3>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: 0.4 }}
                className="text-black text-lg leading-relaxed"
              >
                {loadingType === 'emergency' 
                  ? "Contacting emergency services immediately. Help is being dispatched to your location."
                  : "We're connecting you with the nearest medical assistance. Your request is being processed and help is on the way."
                }
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="success-text">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-2xl font-bold text-black mb-4"
              >
                {loadingType === 'emergency' ? 'Emergency Alert Sent!' : 'Request Sent Successfully!'}
              </motion.h3>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="text-black text-lg leading-relaxed"
              >
                {loadingType === 'emergency' 
                  ? "Emergency services have been notified and are on their way. Please stay calm and wait for assistance."
                  : "Your medical assistance request has been successfully sent to the nearest health booths. Help will arrive shortly."
                }
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Dots - Only show during loading */}
        {!isSuccess && (
          <div className="flex justify-center space-x-2 mt-8">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
                className="w-3 h-3 bg-black rounded-full"
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  return (
<AnimatePresence>
  {isLoading ? (
    <LoadingScreen />
  ) : (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[90vw] max-w-4xl h-[80vh] flex rounded-2xl shadow-2xl relative" // Added 'relative' and removed 'overflow-hidden'
        style={{
          background: 'linear-gradient(to right, #F4A391, #E0B9C2, #EACDC6)',
        }}
      >
        {/* Close Button - Now properly positioned */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }} // Reduced delay for faster appearance
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute -top-2 -right-2 z-20 bg-white text-black hover:bg-red-500 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-lg border-2 border-gray-200 transition-all duration-200"
          disabled={isLoading}
        >
          ×
        </motion.button>

        {/* Left Side - 30% */}
        <div className="w-[30%] bg-white bg-opacity-20 p-6 flex flex-col justify-center space-y-4 backdrop-blur-sm rounded-l-2xl">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-black leading-tight">
              Medical Assistance Required
            </h2>
            
            <p className="text-black text-sm leading-relaxed opacity-90">
              Please provide your information and describe the medical help you need. 
              Our nearest health booths will be notified immediately.
            </p>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="w-full h-48 rounded-lg overflow-hidden shadow-md"
            >
              <img 
                src="SOS.png" 
                alt="Medical Help" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - 70% */}
        <div className="w-[70%] p-4 flex flex-col bg-white bg-opacity-10 backdrop-blur-sm overflow-y-auto rounded-r-2xl">
          {/* Top Section - Nearest Health Booths */}
          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <h3 className="text-lg font-semibold text-black mb-3">Nearest Health Booths</h3>
            <div className="grid grid-cols-3 gap-3">
              {nearestBooths.map((distance, index) => (
                <motion.div 
                  key={index}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white bg-opacity-30 rounded-lg p-2 text-center border border-white border-opacity-40 backdrop-blur-sm"
                >
                  <div className="text-xs text-black font-medium">Booth {index + 1}</div>
                  <div className="text-sm font-bold text-black">{distance}m</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.form 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSend} 
            className="space-y-3 flex-1"
          >
            {/* Name and RFID in 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileFocus={{ scale: 1.02 }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-white border-opacity-30 rounded-lg text-black text-sm placeholder-black placeholder-opacity-60 bg-white bg-opacity-20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.02 }}>
                <input
                  type="text"
                  name="rfid"
                  placeholder="Enter your RFID"
                  value={formData.rfid}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-white border-opacity-30 rounded-lg text-black text-sm placeholder-black placeholder-opacity-60 bg-white bg-opacity-20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                />
              </motion.div>
            </div>

            {/* Medical Help Description - Full Width */}
            <motion.div whileFocus={{ scale: 1.02 }}>
              <textarea
                name="medicalHelp"
                placeholder="Describe the medical help you need"
                value={formData.medicalHelp}
                onChange={handleInputChange}
                required
                rows="3"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-white border-opacity-30 rounded-lg text-black text-sm placeholder-black placeholder-opacity-60 bg-white bg-opacity-20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent resize-none transition-all duration-200 disabled:opacity-50"
              />
            </motion.div>

            {/* Buttons with reduced spacing and OR text */}
            <div className="flex items-center gap-3 mt-4">
              <motion.button
                type="submit"
                whileHover={{ scale: !isLoading ? 1.02 : 1 }}
                whileTap={{ scale: !isLoading ? 0.98 : 1 }}
                disabled={isLoading}
                className="flex-1 bg-black bg-opacity-80 hover:bg-opacity-90 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendBtnState}
              </motion.button>

              <span className="text-black font-medium text-sm px-2">or</span>

              <motion.button
                type="button"
                onClick={handleEmergency}
                whileHover={{ scale: !isLoading ? 1.02 : 1 }}
                whileTap={{ scale: !isLoading ? 0.98 : 1 }}
                disabled={isLoading}
                className="flex-1 bg-red-600 bg-opacity-90 hover:bg-opacity-100 text-white font-bold py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {emergencyBtnState}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  );
};

export default MedicalHelpPopup;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLostAndFound = () => {
  const [activeTab, setActiveTab] = useState('lost');
  const [familyMembers, setFamilyMembers] = useState([
    { id: 'RFID001', name: 'Adarsh', distance: '2m' },
    { id: 'RFID002', name: 'kishan', distance: '5m' },
    { id: 'RFID003', name: 'manas', distance: '1m' }
  ]);
  const [newMemberRFID, setNewMemberRFID] = useState('');
  const [lostRFID, setLostRFID] = useState('');
  const [foundRFID, setFoundRFID] = useState('');
  const [foundDescription, setFoundDescription] = useState('');
  const [foundTime, setFoundTime] = useState('');
  const [lastSeenTime, setLastSeenTime] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Update family member distances dynamically
    const interval = setInterval(() => {
      setFamilyMembers(prevMembers => 
        prevMembers.map(member => ({
          ...member,
          distance: `${Math.floor(Math.random() * 10) + 1}m`
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addFamilyMember = () => {
    if (newMemberRFID.trim()) {
      const newMember = {
        id: newMemberRFID.trim(),
        name: `Member ${familyMembers.length + 1}`,
        distance: `${Math.floor(Math.random() * 10) + 1}m`
      };
      setFamilyMembers([...familyMembers, newMember]);
      setNewMemberRFID('');
    }
  };

  const removeFamilyMember = (idToRemove) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== idToRemove));
  };

  const tabVariants = {
    inactive: { 
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.7)',
      scale: 1,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    active: { 
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      color: '#8B5A6B',
      scale: 1.02,
      boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)'
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 30, y: 20 },
    visible: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: -30, y: -20 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
<div className="flex-1 h-screen overflow-hidden ml-80">
      <div 
        className={`h-full overflow-y-auto p-4 transition-all duration-1000 ease-out ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl font-bold mt-16 text-gray-800 mb-1 text-center" style={{ textShadow: '1px 1px 4px rgba(255,255,255,0.5)' }}>
            Lost & Found Management
          </h1>
          <p className="text-gray-700 text-center text-sm">Manage your lost and found items with our smart RFID system</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex mb-6 bg-white/25 backdrop-blur-xl rounded-2xl p-2 border border-white/30 shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-base transition-all duration-500 relative overflow-hidden"
            variants={tabVariants}
            animate={activeTab === 'lost' ? 'active' : 'inactive'}
            onClick={() => setActiveTab('lost')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <span className="relative flex items-center justify-center text-gray-800">
              Lost Items
            </span>
          </motion.button>
          
          <motion.button
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-base transition-all duration-500 relative overflow-hidden"
            variants={tabVariants}
            animate={activeTab === 'found' ? 'active' : 'inactive'}
            onClick={() => setActiveTab('found')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <span className="relative flex items-center justify-center text-gray-800">
              Found Items
            </span>
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'lost' && (
            <motion.div
              key="lost"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-4"
            >
              {/* Family Members Tracking Section */}
              <motion.div 
                className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center">
                  Track Family Members
                </h3>
                
                {/* Add Family Member Input */}
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={newMemberRFID}
                    onChange={(e) => setNewMemberRFID(e.target.value)}
                    placeholder="Enter RFID of family member"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/90 border border-white/40 focus:outline-none focus:ring-3 focus:ring-pink-400/50 text-gray-800 font-medium shadow-md transition-all duration-300 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && addFamilyMember()}
                  />
                  <motion.button
                    onClick={addFamilyMember}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-500 text-white font-semibold rounded-xl shadow-lg relative overflow-hidden text-sm"
                    whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative">Add</span>
                  </motion.button>
                </div>

                {/* Family Members List */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {familyMembers.map((member, index) => (
                      <motion.div
                        key={member.id}
                        className="flex items-center justify-between bg-white/30 rounded-xl p-4 border border-white/40 shadow-md"
                        initial={{ x: -50, opacity: 0, scale: 0.9 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: 50, opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        layout
                      >
                        <div className="flex items-center flex-1">
                          <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                            <span className="text-gray-600 text-xs font-bold">P</span>
                          </div>
                          <div>
                            <p className="text-gray-800 font-semibold text-sm">{member.id}</p>
                            <p className="text-gray-600 text-xs">{member.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="bg-emerald-500/30 px-4 py-2 rounded-lg border border-emerald-400/50 relative overflow-hidden"
                            animate={{ 
                              boxShadow: [
                                '0 0 0 0 rgba(16, 185, 129, 0.4)', 
                                '0 0 0 8px rgba(16, 185, 129, 0)', 
                                '0 0 0 0 rgba(16, 185, 129, 0.4)'
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <span className="text-emerald-700 font-semibold text-sm relative z-10">{member.distance}</span>
                          </motion.div>
                          
                          <motion.button
                            onClick={() => removeFamilyMember(member.id)}
                            className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all duration-300 text-xs"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            ×
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Report Lost Item Section */}
              <motion.div 
                className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center">
                  Report Lost Item
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={lostRFID}
                    onChange={(e) => setLostRFID(e.target.value)}
                    placeholder="Enter RFID of lost item"
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-white/40 focus:outline-none focus:ring-3 focus:ring-red-400/50 text-gray-800 font-medium shadow-md transition-all duration-300 text-sm"
                  />
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="lost-image"
                    />
                    <label
                      htmlFor="lost-image"
                      className="flex items-center justify-center w-full px-4 py-3 bg-white/90 border border-white/40 rounded-xl cursor-pointer hover:bg-white transition-all duration-300 text-gray-800 font-medium shadow-md group text-sm"
                    >
                      <span className="mr-2 group-hover:scale-110 transition-transform duration-300">📷</span>
                      Upload Image of Lost ones
                    </label>
                  </div>
                  
                  <input
                    type="datetime-local"
                    placeholder="Last Seen Time"
                    value={lastSeenTime}
                    onChange={(e) => setLastSeenTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-white/40 focus:outline-none focus:ring-3 focus:ring-orange-400/50 text-gray-800 font-medium shadow-md transition-all duration-300 text-sm"
                  />
                  
                  <motion.button
                    className="w-full py-4 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-semibold rounded-xl shadow-lg relative overflow-hidden text-base"
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: '0 20px 40px rgba(239, 68, 68, 0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative">Send Report</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'found' && (
            <motion.div
              key="found"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-4"
            >
              {/* Report Found Item Section */}
              <motion.div 
                className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center">
                  Report Found Item
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={foundRFID}
                    onChange={(e) => setFoundRFID(e.target.value)}
                    placeholder="Name Of Found items"
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-white/40 focus:outline-none focus:ring-3 focus:ring-green-400/50 text-gray-800 font-medium shadow-md transition-all duration-300 text-sm"
                  />
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="found-image"
                    />
                    <label
                      htmlFor="found-image"
                      className="flex items-center justify-center w-full px-4 py-3 bg-white/90 border border-white/40 rounded-xl cursor-pointer hover:bg-white transition-all duration-300 text-gray-800 font-medium shadow-md group text-sm"
                    >
                      <span className="mr-2 group-hover:scale-110 transition-transform duration-300">📸</span>
                      Upload Image of Found Item
                    </label>
                  </div>
                  
                  <textarea
                    value={foundDescription}
                    onChange={(e) => setFoundDescription(e.target.value)}
                    placeholder="Describe where you found this item..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-white/40 focus:outline-none focus:ring-3 focus:ring-blue-400/50 text-gray-800 font-medium resize-none shadow-md transition-all duration-300 text-sm"
                  />
                  
                  <input
                    type="datetime-local"
                    value={foundTime}
                    onChange={(e) => setFoundTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-white/40 focus:outline-none focus:ring-3 focus:ring-purple-400/50 text-gray-800 font-medium shadow-md transition-all duration-300 text-sm"
                  />
                  
                  <motion.button
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg relative overflow-hidden text-base"
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative">Submit Found Item</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Recent Found Items */}
              <motion.div 
                className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3, duration:0.6 }}
              >
                <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center">
                  Recent Found Items
                </h3>
                
                <div className="space-y-3">
                  {[
                    { id: 1, type: 'Bag', name: 'Backpack', time: '2 hours ago' },
                    { id: 2, type: 'Phone', name: 'Mobile Phone', time: '4 hours ago' },
                    { id: 3, type: 'Glasses', name: 'Eyeglasses', time: '6 hours ago' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center justify-between bg-white/30 rounded-xl p-4 border border-white/40 shadow-md"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-200 rounded-full mr-3 flex items-center justify-center">
                          <span className="text-blue-700 text-xs font-bold">{item.type.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-gray-800 font-semibold text-sm">RFID00{item.id}</p>
                          <p className="text-gray-600 text-xs">{item.name} • Found {item.time}</p>
                        </div>
                      </div>
                      <motion.button
                        className="px-6 py-2 bg-gradient-to-r from-emerald-400 to-cyan-500 text-white font-semibold rounded-lg shadow-md text-sm"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Claim
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLostAndFound;

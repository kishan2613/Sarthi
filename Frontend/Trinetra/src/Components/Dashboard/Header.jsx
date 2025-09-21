import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
return (
  <motion.div 
    className="relative flex items-center justify-center overflow-hidden"
    style={{ 
      height: '70vh',  // limit height to 50% of the viewport height
      background: 'linear-gradient(90deg, #E0B7BE 0%, #F6B19A 50%, #DFAEB7 100%)'  // horizontal gradient left-center-right
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    {/* Background Image */}
    <motion.div 
      className="absolute inset-0 z-0"
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.3 }}
      transition={{ duration: 1.5 }}
    >
    <div className="flex items-center justify-center h-full w-full">
  <img 
    src="dashboardlogo.png" 
    alt="Kumbh Mela Background"
    className="w-[750px] h-[750px] object-contain"
  />
</div>


      <div className="absolute inset-0 bg-gradient-to-r from-orange-200/80 via-transparent to-orange-200/80"></div>
    </motion.div>

    {/* Content */}
    <div className="relative z-10 mt-32  text-center px-8 max-w-4xl">
    <motion.div
  className="flex items-center mb-6"
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3, duration: 0.8 }}
>
  <img 
    src="dahboardlogo.png" 
    alt="Icon"
    className="h-[3.5rem] md:h-[4.5rem] mr-4 object-contain"  // Adjust height to match text size
  />
  <motion.h1 
    className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-orange-800 via-orange-600 to-yellow-600 bg-clip-text text-transparent"
  >
    Sacred Kumbh Mela
  </motion.h1>
</motion.div>

      
      <motion.p 
        className="text-xl md:text-2xl text-orange-800 leading-relaxed max-w-3xl mx-auto font-medium"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
       Millions gather at sacred Ganges ghats, while our real-time AI monitors pilgrim density for safety and spiritual fulfillment.
      </motion.p>

      {/* Decorative Elements */}
      <motion.div 
        className="mt-8 flex justify-center mb-24 space-x-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-orange-300 shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-orange-700 font-semibold">🌊 Real-time Monitoring</span>
        </motion.div>
        
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-orange-300 shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-orange-700 font-semibold">🤖 AI-Powered Analytics</span>
        </motion.div>
      </motion.div>
    </div>

    {/* Floating Decorative Elements */}
    <motion.div
      className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-r from-orange-300/30 to-yellow-300/30 rounded-full blur-xl"
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    
    <motion.div
      className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-r from-yellow-300/20 to-orange-300/20 rounded-full blur-2xl"
      animate={{
        y: [0, 25, 0],
        x: [0, -25, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </motion.div>
);

};

export default Header;
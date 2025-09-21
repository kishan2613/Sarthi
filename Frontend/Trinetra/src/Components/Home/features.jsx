import { Map, Search, ShieldAlert, MessageSquare, Navigation, Cross, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MedicalHelpPopup from '../MedicalHelpPopup'; // Import your popup component

const features = [
  {
    title: "Live Heatmap Dashboard",
    desc: "Real-time crowd density monitoring with interactive heatmaps.",
    icon: <Map className="w-10 h-10" />,
    color: "from-orange-400 to-orange-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    link: "/dashboard"
  },
  {
    title: "Lost & Found Service on Fingertips",
    desc: "Easily report or find lost belongings through the app.",
    icon: <Search className="w-10 h-10" />,
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    link: "/lost-found"
  },
  {
    title: "On-the-Spot Medical SOS",
    desc: "Instant access to emergency medical services nearby.",
    icon: <Cross className="w-10 h-10" />,
    color: "from-red-400 to-red-600",
    bgColor: "bg-gradient-to-br from-red-50 to-red-100",
    hasPopup: true,
    popupType: "medical"
  },
  {
    title: "Suspicious Activity Alerts",
    desc: "AI-powered detection for quick alerts of unusual behavior.",
    icon: <ShieldAlert className="w-10 h-10" />,
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
    link: "/alerts"
  },
  {
    title: "Virtual Kumbh Tour & Safety Training",
    desc: "Virtual Kumbh tour with facility locations and safety training videos.",
    icon: <Navigation className="w-10 h-10" />,
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    link: "/ar-navigation"
  },
  {
    title: "Multilingual Chat Bot",
    desc: "Talk to Trinetra in your preferred language instantly.",
    icon: <MessageSquare className="w-10 h-10" />,
    color: "from-pink-400 to-pink-600",
    bgColor: "bg-gradient-to-br from-pink-50 to-pink-100",
    link: "/chatbot"
  },
];

export default function Feature() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    if (item.hasPopup && item.popupType === "medical") {
      setActivePopup("medical");
    } else if (item.link) {
      navigate(item.link);
    }
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const iconVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  return (
    <section className="py-20 min-h-screen" style={{backgroundColor: '#FAE7E0'}} id="features">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 shadow-sm border border-gray-100"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Our Services</span>
          </motion.div>
          
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover cutting-edge solutions designed to keep you safe and connected
          </p>
        </motion.div>
        
        {/* Cards Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative cursor-pointer"
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => handleCardClick(item)}
              whileHover={{ y: -5 }}
              whileTap={{ y: 0, scale: 0.98 }}
            >
              {/* Card Background with Glass Effect */}
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-white/50" />
              
              {/* Gradient Background on Hover */}
              <motion.div
                className={`absolute inset-0 ${item.bgColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                initial={false}
                animate={{ opacity: hoveredCard === index ? 0.1 : 0 }}
              />
              
              {/* Content */}
              <div className="relative p-8 flex flex-col items-center text-center h-full">
                {/* Icon Container */}
                <motion.div 
                  className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
                  variants={iconVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {item.icon}
                </motion.div>
                
                {/* Title */}
                <motion.h3 
                  className="text-xl font-bold text-gray-800 mb-4 leading-tight"
                  initial={false}
                  animate={{ 
                    color: hoveredCard === index ? "#1f2937" : "#374151" 
                  }}
                >
                  {item.title}
                </motion.h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed flex-grow">
                  {item.desc}
                </p>
                
                {/* Arrow indicator on hover */}
                <motion.div
                  className="mt-4 text-gray-400 group-hover:text-gray-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: hoveredCard === index ? 1 : 0,
                    x: hoveredCard === index ? 0 : -10,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{item.hasPopup ? 'Get Help' : 'Learn more'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              </div>
              
              {/* Subtle border glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, ${item.color.replace('from-', '').replace('to-', ', ')})`,
                  opacity: 0,
                  filter: 'blur(1px)',
                }}
                animate={{ 
                  opacity: hoveredCard === index ? 0.1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Floating elements for decoration */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full opacity-20 blur-xl"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Medical Help Popup */}
      {activePopup === "medical" && (
        <MedicalHelpPopup 
          isOpen={true} 
          onClose={closePopup} 
        />
      )}
    </section>
  );
}

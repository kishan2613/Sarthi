import { motion } from "framer-motion";

export default function AboutSimhastha() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-start overflow-hidden"
      style={{
        backgroundColor: "#fae7e0",
        backgroundImage: "url('/About.png')",
        backgroundSize: "contain", // Changed from "cover" to "contain"
        backgroundPosition: "center right", // Better positioning
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent"></div>
      
      {/* Content block positioned on the left with improved styling */}
      <motion.div
        className="relative z-10 ml-8 md:ml-16 lg:ml-24 max-w-lg"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Decorative element */}
        <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-purple-600 mb-6"></div>
        
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            About
          </span>
          <br />
          <span className="text-gray-800">Simhastha</span>
          <br />
          <span className="text-gray-600 text-3xl md:text-4xl lg:text-5xl">Mahakumbh</span>
        </motion.h2>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-medium">
            Simhastha Mahakumbh is one of the largest spiritual gatherings in the
            world, celebrated once every 12 years in the holy city of Ujjain, on
            the banks of the sacred Shipra river.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-gray-600">
            Millions of devotees and saints gather to take a holy dip, which is 
            believed to cleanse sins and grant spiritual liberation. The festival 
            represents faith, unity, and cultural heritage, turning Ujjain into a 
            divine confluence of spirituality and tradition.
          </p>

          {/* Call to action button */}
          <motion.button
            className="mt-8 px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>

      
      
      <motion.div
        className="absolute bottom-32 right-32 w-12 h-12 bg-purple-200 rounded-full opacity-40"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </section>
  );
}
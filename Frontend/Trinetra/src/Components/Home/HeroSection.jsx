import { motion } from "framer-motion";
import Background from "/Herovideo.mp4";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center overflow-hidden"
    >
      {/* Full Background Video with Fallback */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/Heronew.png" // Shows while video loads
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={Background} type="video/mp4" />
        {/* Fallback content for browsers that don't support video */}
        <img 
          src="/Heronew.png" 
          alt="Simhastha Ujjain Mahakumbh 2028" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>

      {/* Ultimate CSS Fallback Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/Heronew.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1
        }}
      />

      {/* Left Aligned Content */}
      <div className="relative z-20 ml-5 mt-7 flex flex-col items-start text-left pl-0 md:pl-0 lg:pl-0 max-w-3xl">
      

        {/* CTA Button */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
          className="mt-8"
        >
          <Link
            to="/slots"
            className="px-8 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-transform"
          >
            Get Started
          </Link>
        </motion.div> */}
      </div>
    </section>
  );
}

import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { Icon: Facebook, href: "#facebook", label: "Facebook" },
    { Icon: Twitter, href: "#twitter", label: "Twitter" },
    { Icon: Instagram, href: "#instagram", label: "Instagram" },
    { Icon: Linkedin, href: "#linkedin", label: "LinkedIn" }
  ];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Event Timeline", href: "#timeline" },
    { name: "Lost & Found", href: "#lost-found" },
    { name: "Contact", href: "#contact" }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
   <footer 
  id="footer"
  className="relative overflow-hidden"
  style={{
    background: 'linear-gradient(135deg, rgba(250, 231, 224, 0.95) 0%, rgba(240, 200, 180, 0.95) 50%, rgba(250, 231, 224, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
     
    width: '100%' // Fix: Adjust width to not overlap sidebar
  }}
>
  {/* Background Pattern */}
  <div 
    className="absolute inset-0 opacity-5"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: '40px 40px'
    }}
  />

  {/* Top Gradient Border */}
  <div className="h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600"></div>

  <motion.div 
    className="max-w-6xl mx-auto px-8 pt-16 pb-8 relative z-10"
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
  >
    <div className="grid md:grid-cols-4 gap-12">
      {/* Brand Section - Enhanced */}
      <motion.div variants={itemVariants} className="md:col-span-2">
        <motion.h2 
          className="text-4xl font-extrabold mb-4"
          style={{
            background: 'linear-gradient(45deg, #f97316, #a855f7, #2563eb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          🔍 Trinetra
        </motion.h2>
        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          AI-powered suspicious activity detection for safe and smart crowd management. 
          Keeping communities connected and secure.
        </p>
        
        {/* Contact Info */}
        <div className="space-y-3">
          <motion.div 
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-300"
            whileHover={{ x: 5 }}
          >
            <Mail className="w-5 h-5 mr-3" />
            <span>contact@trinetra.com</span>
          </motion.div>
          <motion.div 
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-300"
            whileHover={{ x: 5 }}
          >
            <Phone className="w-5 h-5 mr-3" />
            <span>+91-1800-TRINETRA</span>
          </motion.div>
          <motion.div 
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-300"
            whileHover={{ x: 5 }}
          >
            <MapPin className="w-5 h-5 mr-3" />
            <span>Delhi, India</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Links - Enhanced */}
      <motion.div variants={itemVariants}>
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Quick Links</h3>
        <ul className="space-y-3">
          {quickLinks.map((link, index) => (
            <motion.li key={link.name}>
              <motion.a
                href={link.href}
                className="text-gray-700 hover:text-orange-600 transition-all duration-300 block py-1 text-lg"
                whileHover={{ x: 10, color: '#ea580c' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {link.name}
              </motion.a>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Social Links - Enhanced */}
      <motion.div variants={itemVariants}>
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Connect With Us</h3>
        <div className="grid grid-cols-2 gap-4">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 text-gray-600 hover:text-white transition-all duration-300 shadow-lg group"
              whileHover={{ 
                scale: 1.1, 
                y: -5,
                background: 'linear-gradient(45deg, #f97316, #a855f7)',
                boxShadow: '0 10px 25px rgba(249, 115, 22, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <social.Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </motion.a>
          ))}
        </div>
        
        {/* Newsletter Signup */}
        <div className="mt-8">
          <h4 className="font-semibold text-gray-800 mb-3">Stay Updated</h4>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-l-lg bg-white/80 border border-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
            />
            <motion.button
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-r-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Enhanced Bottom Section */}
    <motion.div 
      className="mt-16 pt-8 border-t border-gray-300/60"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        <motion.p 
          className="text-gray-600 text-lg"
          whileHover={{ scale: 1.05 }}
        >
          © {currentYear} Trinetra. All Rights Reserved.
        </motion.p>
        
        <div className="flex space-x-6 mt-4 md:mt-0">
          {["Privacy Policy", "Terms of Service", "Support"].map((link, index) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-gray-600 hover:text-orange-600 transition-colors duration-300"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + (index * 0.1) }}
            >
              {link}
            </motion.a>
          ))}
        </div>
      </div>
      
      {/* Made with love section */}
      <motion.div 
        className="text-center mt-6 pt-6 border-t border-gray-200/60"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
      >
        
      </motion.div>
    </motion.div>
  </motion.div>
</footer>

  );
}

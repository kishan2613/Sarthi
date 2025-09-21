import { motion } from "framer-motion";

export default function Contact() {
  return (
    <motion.div 
      className="p-10 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
      <p className="text-lg">Get in touch with us through this page.</p>
    </motion.div>
  );
}

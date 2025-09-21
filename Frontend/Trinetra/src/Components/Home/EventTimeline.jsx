import { motion } from "framer-motion";

export default function EventTimeline() {
  const events = [
    {
      year: "2026",
      title: "Preparations Begin",
      description: "Initial planning, infrastructure setup, and AI crowd monitoring trials start.",
    },
    {
      year: "2027",
      title: "Pilgrimage Campaign",
      description: "Nationwide awareness and digital campaigns for Simhastha Mahakumbh 2028.",
    },
    {
      year: "Jan 2028",
      title: "Early Arrivals",
      description: "First groups of devotees and volunteers start arriving in Ujjain.",
    },
    {
      year: "Apr 2028",
      title: "Main Event",
      description: "Millions gather for the sacred Simhastha Mahakumbh festival with AI-powered crowd management.",
    },
    {
      year: "May 2028",
      title: "Closing Ceremony",
      description: "Final rituals, cultural programs, and safe dispersal of the crowd.",
    },
  ];

  return (
    <section id="timeline" className="relative py-16 bg-[#fae7e0]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 bg-clip-text text-transparent"
        >
          Event Timeline
        </motion.h2>

        {/* Timeline */}
        <div className="relative border-l-4 border-orange-500 ml-6">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="mb-10 ml-6"
            >
              {/* Dot */}
              <div className="absolute w-6 h-6 bg-orange-500 rounded-full -left-3 border-4 border-white"></div>

              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">{event.year} - {event.title}</h3>
              <p className="mt-2 text-gray-700">{event.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import BookingForm from "../Pages/Book"; // your booking form
import Temples from "../data/Temples";   // mock data JSON

export default function Booking() {
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-16 bg-[#fae7e0] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-4xl font-extrabold mb-12 text-center bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Book Your Temple Slot
        </h2>

        {/* Temple Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Temples.map((temple, idx) => {
            const isFull = temple.status === "Full";

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-2xl shadow-lg overflow-hidden bg-white relative border-l-4 ${
                  isFull ? "border-red-500" : "border-orange-500"
                }`}
              >
                {/* Image */}
                <img
                  src={temple.image}
                  alt={temple.name}
                  className="w-full h-48 object-cover"
                />

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {temple.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{temple.location}</p>

                  {/* Status */}
                  <p
                    className={`mt-3 font-semibold ${
                      isFull ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {temple.status}
                  </p>

                  {/* Book Now Button */}
                  <button
                    disabled={isFull}
                    onClick={() => {
                      setSelectedTemple(temple);
                      setIsModalOpen(true);
                    }}
                    className={`mt-5 flex items-center gap-2 px-4 py-2 w-full justify-center rounded-xl font-medium text-white transition ${
                      isFull
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-purple-600 hover:scale-105"
                    }`}
                  >
                    <Ticket className="w-5 h-5" />
                    {isFull ? "Fully Booked" : "Book Now"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal for Booking Form */}
      {isModalOpen && selectedTemple && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative w-[50%] bg-white rounded-xl shadow-lg p-6">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              ✕
            </button>

            {/* Pass temple info to BookingForm */}
            <BookingForm
              preselectedTemple={selectedTemple}
              onBookingSuccess={() => {
                setIsModalOpen(false);
                window.location.reload(); // optional: refresh data
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}

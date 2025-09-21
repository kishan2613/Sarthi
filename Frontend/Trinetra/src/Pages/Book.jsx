import axios from "axios";
import { useState, useEffect } from "react";
import Ticket from "./Ticket";

export default function BookingForm({ preselectedSlot, onBookingSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    aadhaarNumber: "",
    slotId: preselectedSlot || "",
    numberOfPeople: 1,
  });

  const [slots, setSlots] = useState([]); 
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/slots");
        setSlots(response.data);
      } catch (error) {
        console.error("❌ Error fetching slots:", error.message);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/slots/book", {
        user: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          aadhaarNumber: formData.aadhaarNumber,
        },
        slot: formData.slotId,
        bookingDetails: {
          numberOfPeople: formData.numberOfPeople,
        },
      });

      console.log("✅ Booking successful:", response.data);

      const bookedSlot = slots.find((s) => s._id === formData.slotId);

      setTicketData({
        name: formData.fullName,
        people: formData.numberOfPeople,
        date: bookedSlot?.date,
        time: bookedSlot?.time,
        ghat: bookedSlot?.ghat,
      });

    } catch (error) {
      console.error("❌ Booking failed:", error.response?.data || error.message);
      alert("Booking failed: " + (error.response?.data?.message || "Server error"));
    }
  };

  if (ticketData) {
  return (
    <Ticket 
      fullName={ticketData.name}
      numberOfPeople={ticketData.people}
      date={ticketData.date}
      slot={`${ticketData.time} – ${ticketData.ghat}`} // combine nicely
      autoDownload={true}
    />
  );
}


  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full pt-8  ">
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="aadhaarNumber"
        placeholder="Aadhaar Number"
        value={formData.aadhaarNumber}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        name="slotId"
        value={formData.slotId}
        onChange={handleChange}
        required
        disabled={loadingSlots}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select a Slot --</option>
        {slots.map((slot) => (
          <option key={slot._id} value={slot._id}>
            {new Date(slot.date).toLocaleDateString("en-GB")} ({slot.time} – {slot.ghat})
          </option>
        ))}
      </select>
      <input
        type="number"
        name="numberOfPeople"
        placeholder="Number of People"
        value={formData.numberOfPeople}
        onChange={handleChange}
        required
        min="1"
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        type="submit" 
        className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:scale-105 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Book Slot
      </button>
    </form>
  );
}

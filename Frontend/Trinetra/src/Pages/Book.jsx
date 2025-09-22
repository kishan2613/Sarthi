import { useState } from "react";
import axios from "axios";

export default function BookingForm({ preselectedTemple, onSuccess }) {
  const [formData, setFormData] = useState({
    templeName: preselectedTemple || "",
    userName: "",
    phone: "",
    
    numberOfPersons: 1,
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/queue/form", formData);
      setMessage("✅ Booking Successful!");
      setFormData({
        templeName: preselectedTemple || "",
        userName: "",
        phone: "",
        
        numberOfPersons: 1,
        date: "",
      });
      if (onSuccess) onSuccess(res.data.booking);
    } catch (error) {
      setMessage("❌ Failed: " + (error.response?.data?.message || "Server error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center text-orange-600">
        Book Your Temple Slot
      </h2>

      {/* Temple Name */}
      <div>
        <label className="block font-medium mb-1">Temple Name</label>
        <input
          type="text"
          name="templeName"
          value={formData.templeName}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          placeholder="Enter temple name"
          required
        />
      </div>

      {/* User Name */}
      <div>
        <label className="block font-medium mb-1">Your Name</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          placeholder="Enter your full name"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          placeholder="9876543210"
          required
        />
      </div>


      {/* Number of Persons */}
      <div>
        <label className="block font-medium mb-1">Number of Persons</label>
        <input
          type="number"
          name="numberOfPersons"
          value={formData.numberOfPersons}
          onChange={handleChange}
          min="1"
          className="w-full border rounded-lg p-2"
          required
        />
      </div>

      {/* Date */}
      <div>
        <label className="block font-medium mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
      </div>

      

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>

      {/* Response Message */}
      {message && (
        <p className="text-center font-medium mt-2">{message}</p>
      )}
    </form>
  );
}

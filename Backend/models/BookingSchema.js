const mongoose = require("mongoose");
const {Schema} = mongoose;

const BookingSchema = new Schema({
    user: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    aadhaarNumber: { type: String, required: true }
  },
  slot: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Slot", 
    required: true 
  }, // 🔗 Reference to Slot

  bookingDetails: {
    bookingId: { 
      type: String, 
      unique: true, 
      default: () => new mongoose.Types.ObjectId().toString() 
    },
    numberOfPeople: { type: Number, required: true, min: 1, max: 10 },
    status: { 
      type: String, 
      enum: ["Booked", "Cancelled", "Completed"], 
      default: "Booked" 
    },
    createdAt: { type: Date, default: Date.now },
  }
});

module.exports = mongoose.model("Booking", BookingSchema);
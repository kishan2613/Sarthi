const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  templeName: { type: String, required: true },
  name: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    match: [/^(\+91[\-\s]?)?[6-9]\d{9}$/, "Please enter a valid phone number"],
  },
  persons: { type: Number, required: true, min: 1 },
  date: { type: Date, required: true },
  gateNumber: { type: String }, // will auto-generate
  ticketId: { type: String, unique: true }, // unique ticket ID
  createdAt: { type: Date, default: Date.now },
});

// Auto-generate ticketId & gateNumber
bookingSchema.pre("save", function (next) {
  if (!this.ticketId) {
    this.ticketId =
      "TKT-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  if (!this.gateNumber) {
    // Example: random gate between 1 and 5
    const gate = Math.floor(Math.random() * 5) + 1;
    this.gateNumber = `Gate-${gate}`;
  }

  next();
});

module.exports = mongoose.model("Booking", bookingSchema);

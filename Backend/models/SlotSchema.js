const mongoose = require("mongoose");
const {Schema} = mongoose;

const SlotSchema = new Schema({
    date: { type: Date, required: true },          // e.g. 15 April 2028
  time: { type: String, required: true },        // "06:00 - 07:00 AM"
  ghat: { type: String, required: true },        // "Ram Ghat", "Triveni Ghat"
  capacity: { type: Number, required: true },    // e.g. 5000 people per slot
  booked: { type: Number, default: 0 },          // how many already booked
  status: {
    type: String,
    enum: ["Available", "Full"],
    default: "Available"
  },
  // Store which bookings are linked to this slot
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }]
});

// Middleware → auto update status
SlotSchema.pre("save", function(next) {
  this.status = this.booked >= this.capacity ? "Full" : "Available";
  next();
});

// Prevent duplicate slots (same ghat+date+time)
SlotSchema.index({ date: 1, time: 1, ghat: 1 }, { unique: true });


module.exports = mongoose.model("Slot", SlotSchema);
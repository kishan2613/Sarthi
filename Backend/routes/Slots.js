const express = require("express");
const Booking = require("../models/BookingSchema");

const router = express.Router();

// @desc    Get all bookings
// @route   GET /api/bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


// POST /form
router.post("/form", async (req, res) => {
  try {
    const { templeName, userName, phone, numberOfPersons, date } = req.body;

    const newBooking = new Booking({
      templeName,
      name: userName,
      phone,
      persons: numberOfPersons,
      date, 
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking Successful ✅",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({
      message: "Booking Failed ❌",
      error: error.message,
    });
  }
});



module.exports = router;

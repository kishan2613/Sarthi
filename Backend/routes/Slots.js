const express = require("express");
const router = express.Router();
const Slot = require("../models/SlotSchema");
const Booking = require("../models/BookingSchema");
const {availableSlot} = require("../controllers/slotsController");

router.get("/",availableSlot);

router.post("/book",async(req,res)=>{
    try{
        const {user, slot, bookingDetails} = req.body;

        const slotExists = await Slot.findById(slot);
        if(!slotExists){
            return res.status(404).json({ message: "Slot not found" });
        }

    const booking = new Booking({
        user,
        slot,
        bookingDetails,
    });

    slotExists.booked = Number(slotExists.booked) + Number(bookingDetails.numberOfPeople);
    await slotExists.save();
    await booking.save();
        res.status(201).json({
      message: "Booking created successfully",
      booking,
      updatedSlot: slotExists,
    });
    }catch (error) {
    console.error(" Error creating booking:", error); // log in terminal
    res.status(500).json({ 
        message: "Server error", 
        error: error.message // send actual error message
    });
}
})

module.exports = router;    
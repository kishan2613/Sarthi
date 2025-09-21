const Slot = require("../models/SlotSchema");

exports.availableSlot = async(req,res)=>{
    let allSlots = await Slot.find({});
    res.json(allSlots);

};
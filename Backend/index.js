require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Booking = require("./models/BookingSchema");
const bodyParser = require("body-parser");
const cors = require("cors")

const PORT = process.env.PORT;
const url = process.env.MONGO_URL;

const BookRoutes = require("./routes/Slots");
const Rekroute = require("./routes/recognition")

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());



//Routes
app.use("/api/queue",BookRoutes);
app.use("/api/recognition", Rekroute);



app.get("/",(req, res) => {
  res.send("API is running...");
});

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connection Established");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });
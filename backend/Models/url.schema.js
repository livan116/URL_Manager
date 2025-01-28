const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  urlCode: { type: String, required: true, unique: true },
  expirationDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  totalClicks: {
    type: Number,
    default: 0, // Tracks total clicks across all dates
  },
  clicksPerDay: [
    {
      date: {
        type: String, // Store the date as a string (e.g., "2025-01-26")
        required: true,
      },
      count: {
        type: Number, // Number of clicks for the specific date
        default: 0,
      },
    },
  ],
  remarks: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  accessLogs: [
    {
      deviceType: String, // E.g., Mobile, Tablet, Desktop
      ipAddress: String, // Store the IP address of the user
      clickedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Url", urlSchema);

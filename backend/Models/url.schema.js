const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  urlCode: { type: String, required: true, unique: true },
  expirationDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  totalClicks: {
    type: Number,
    default: 0,  // Tracks total clicks across all dates
  },
  clicksPerDay: [
    {
      date: String,   // Store date as string (e.g., '2025-01-27')
      count: {
        type: Number,
        default: 0,  // Track the number of clicks for that day
      },
    },
  ],
  remarks: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  accessLogs: [
        {
            deviceType: String, // E.g., Mobile, Tablet, Desktop
            ipAddress: String, // Store the IP address of the user
            clickedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
});

module.exports = mongoose.model("Url", urlSchema);

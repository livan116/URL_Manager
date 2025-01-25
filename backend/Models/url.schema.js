const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  urlCode: { type: String, required: true, unique: true },
  expirationDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  clickCount: { type: Number, default: 0 },
  remarks: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

module.exports = mongoose.model("Url", urlSchema);

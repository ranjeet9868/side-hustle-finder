// models/Job.js
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  country: { type: String, required: true },
  nearby: { type: String, required: true },
  budget: { type: String, required: true },
  schedule: { type: String, required: true }, // New field for days/times
  poster: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  posterPaymentIntentId: String,
  shovelerPaymentIntentId: String,
  matchedApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    default: null,
  },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", JobSchema);

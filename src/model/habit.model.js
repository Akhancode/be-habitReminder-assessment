const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true, enum: ["Health", "Work", "Personal Development"] },
    frequency: { type: String, required: true, enum: ["daily", "weekly"] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reminder: { type: String }, // Store as HH:mm format (e.g., "09:30")
  
});

module.exports = mongoose.model("Habit", habitSchema);

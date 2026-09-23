// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Model: Inquiry.js
// Description: MongoDB schema for user contact messages and inquiries,
// supporting admin responses, reply status, and timestamps.
// =========================================================================

const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      required: [true, "Please provide an inquiry subject"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please provide inquiry details"],
    },
    status: {
      type: String,
      enum: ["pending", "responded"],
      default: "pending",
    },
    adminResponse: {
      type: String,
      default: "",
    },
    respondedAt: {
      type: Date,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inquiry", inquirySchema);

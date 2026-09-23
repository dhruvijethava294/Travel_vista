// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Model: Booking.js
// Description: MongoDB schema for tour package and hotel stay reservations,
// including customer details, schedule, pricing, and demo payment tracking.
// =========================================================================

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingType: {
      type: String,
      enum: ["package", "hotel", "custom_tour"],
      default: "package",
      required: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourPackage",
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    travelers: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    travelDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "paid",
    },
    paymentMethod: {
      type: String,
      enum: ["Credit/Debit Card", "UPI / QR Code", "Net Banking", "Cash on Arrival"],
      default: "Credit/Debit Card",
    },
    transactionId: {
      type: String,
      default: function () {
        return "TXN" + Math.floor(10000000 + Math.random() * 90000000);
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
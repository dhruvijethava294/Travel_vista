const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    city: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    },
    images: [
      {
        type: String,
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    roomType: {
      type: String,
      default: "Deluxe Room",
    },
    contactPhone: {
      type: String,
      default: "+91 98765 43210",
    },
    contactEmail: {
      type: String,
      default: "reservations@travelvista.com",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hotel", hotelSchema);
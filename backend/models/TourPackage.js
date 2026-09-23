const mongoose = require("mongoose");

const itineraryItemSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  activities: {
    type: String,
    required: true,
  },
  meals: {
    type: String,
    default: "Breakfast",
  },
});

const tourPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Package title is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Adventure", "Beach", "Honeymoon", "Family", "Heritage", "Luxury", "Wildlife"],
      default: "Family",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      default: "3 Days / 2 Nights",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    images: [
      {
        type: String,
      },
    ],
    videos: [
      {
        type: String,
      },
    ],
    itinerary: [itineraryItemSchema],
    placesToVisit: [
      {
        type: String,
      },
    ],
    included: [
      {
        type: String,
      },
    ],
    excluded: [
      {
        type: String,
      },
    ],
    includedHotels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 12,
    },
    maxGroupSize: {
      type: Number,
      default: 15,
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

module.exports = mongoose.model("TourPackage", tourPackageSchema);
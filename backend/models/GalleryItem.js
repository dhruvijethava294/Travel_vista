const mongoose = require("mongoose");

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Beaches", "Mountains", "Heritage", "Luxury", "Wildlife", "Cities"],
      default: "Beaches",
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    url: {
      type: String,
      required: [true, "Media URL is required"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    destination: {
      type: String,
      default: "Global",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GalleryItem", galleryItemSchema);

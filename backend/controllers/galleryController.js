const GalleryItem = require("../models/GalleryItem");

// @desc    Get gallery items (photos & videos)
// @route   GET /api/gallery
// @access  Public
exports.getGalleryItems = async (req, res) => {
  try {
    const { category, mediaType, destination } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (mediaType) {
      query.mediaType = mediaType;
    }

    if (destination && destination !== "All") {
      query.destination = { $regex: destination, $options: "i" };
    }

    const items = await GalleryItem.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error fetching gallery items",
    });
  }
};

// @desc    Create gallery item (Admin)
// @route   POST /api/gallery
// @access  Private/Admin
exports.createGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error creating gallery item",
    });
  }
};

// @desc    Delete gallery item (Admin)
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

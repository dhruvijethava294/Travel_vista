const TourPackage = require("../models/TourPackage");

// @desc    Get all tour packages with search & filters
// @route   GET /api/packages
// @access  Public
exports.getPackages = async (req, res) => {
  try {
    const { search, destination, category, minPrice, maxPrice, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { placesToVisit: { $regex: search, $options: "i" } },
      ];
    }

    if (destination && destination !== "all") {
      query.destination = { $regex: destination, $options: "i" };
    }

    if (category && category !== "all") {
      query.category = { $regex: category, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "rating_desc") sortOption = { rating: -1 };
    else if (sort === "duration") sortOption = { duration: 1 };

    const packages = await TourPackage.find(query)
      .populate("includedHotels")
      .sort(sortOption);

    res.json(packages);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error fetching packages",
    });
  }
};

// @desc    Get featured tour packages
// @route   GET /api/packages/featured
// @access  Public
exports.getFeaturedPackages = async (req, res) => {
  try {
    const packages = await TourPackage.find({ featured: true })
      .populate("includedHotels")
      .limit(6);

    if (packages.length === 0) {
      const fallback = await TourPackage.find()
        .populate("includedHotels")
        .limit(6)
        .sort({ rating: -1 });
      return res.json(fallback);
    }

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get package by ID
// @route   GET /api/packages/:id
// @access  Public
exports.getPackageById = async (req, res) => {
  try {
    const packageData = await TourPackage.findById(req.params.id).populate(
      "includedHotels"
    );

    if (!packageData) {
      return res.status(404).json({
        message: "Tour package not found",
      });
    }

    res.json(packageData);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error fetching package details",
    });
  }
};

// @desc    Create new package (Admin)
// @route   POST /api/packages
// @access  Private/Admin
exports.createPackage = async (req, res) => {
  try {
    const packageData = await TourPackage.create(req.body);
    const populated = await TourPackage.findById(packageData._id).populate(
      "includedHotels"
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error creating package",
    });
  }
};

// @desc    Update package (Admin)
// @route   PUT /api/packages/:id
// @access  Private/Admin
exports.updatePackage = async (req, res) => {
  try {
    const packageData = await TourPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("includedHotels");

    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(packageData);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error updating package",
    });
  }
};

// @desc    Delete package (Admin)
// @route   DELETE /api/packages/:id
// @access  Private/Admin
exports.deletePackage = async (req, res) => {
  try {
    const packageData = await TourPackage.findByIdAndDelete(req.params.id);

    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({
      message: "Package deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error deleting package",
    });
  }
};
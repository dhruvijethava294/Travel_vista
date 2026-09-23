// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Controller: inquiryController.js
// Description: Manages user inquiries and Admin response replies.
// =========================================================================

const Inquiry = require("../models/Inquiry");

// @desc    Submit a new user inquiry / contact message
// @route   POST /api/inquiries
// @access  Public
exports.createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please provide your name, email, subject, and message.",
      });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone: phone || "",
      subject,
      message,
      status: "pending",
      adminResponse: "",
    });

    res.status(201).json({
      message: "Inquiry submitted successfully! Our travel specialists will respond shortly.",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to submit inquiry",
    });
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
// @access  Private/Admin
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("respondedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch inquiries",
    });
  }
};

// @desc    Admin gives response / reply to user inquiry
// @route   PUT /api/inquiries/:id/response
// @access  Private/Admin
exports.respondInquiry = async (req, res) => {
  try {
    const { adminResponse } = req.body;

    if (!adminResponse || !adminResponse.trim()) {
      return res.status(400).json({
        message: "Please provide a response message.",
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    inquiry.adminResponse = adminResponse.trim();
    inquiry.status = "responded";
    inquiry.respondedAt = new Date();
    if (req.user) {
      inquiry.respondedBy = req.user._id;
    }

    await inquiry.save();

    res.json({
      message: "Response sent successfully!",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to update inquiry response",
    });
  }
};

// @desc    Delete inquiry (Admin)
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to delete inquiry",
    });
  }
};

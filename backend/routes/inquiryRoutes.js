// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Routes: inquiryRoutes.js
// =========================================================================

const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getAllInquiries,
  respondInquiry,
  deleteInquiry,
} = require("../controllers/inquiryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public route to submit inquiry
router.post("/", createInquiry);

// Admin routes to view, respond, and delete
router.get("/", protect, adminOnly, getAllInquiries);
router.put("/:id/response", protect, adminOnly, respondInquiry);
router.delete("/:id", protect, adminOnly, deleteInquiry);

module.exports = router;

const express = require("express");
const controller = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, controller.createBooking);
router.get("/my-bookings", protect, controller.getMyBookings);
router.get("/:id", protect, controller.getBookingById);
router.put("/:id/cancel", protect, controller.cancelBooking);

// Admin routes
router.get("/", protect, adminOnly, controller.getAllBookings);
router.put("/:id/status", protect, adminOnly, controller.updateBookingStatus);
router.delete("/:id", protect, adminOnly, controller.deleteBooking);

module.exports = router;
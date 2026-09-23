// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Controller: bookingController.js
// Description: Handles booking creation with demo payment tracking,
// user reservation history, cancellation, and admin management.
// =========================================================================

const Booking = require("../models/Booking");
const TourPackage = require("../models/TourPackage");
const Hotel = require("../models/Hotel");

// @desc    Create new booking with payment confirmation
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      bookingType,
      package: packageId,
      hotel: hotelId,
      travelers,
      travelDate,
      checkIn,
      checkOut,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests,
      totalAmount,
      paymentMethod,
      transactionId,
    } = req.body;

    // Administrator role check: Admins manage packages and inquiries, but cannot book packages
    if (req.user && req.user.role === "admin") {
      return res.status(403).json({
        message: "Administrator accounts cannot place bookings. Please log in with a customer account.",
      });
    }

    if (!contactName || !contactEmail || !contactPhone) {
      return res.status(400).json({
        message: "Contact name, email and phone number are required",
      });
    }

    let calculatedAmount = totalAmount;

    // Fallback calculation if not explicitly provided
    if (!calculatedAmount) {
      if (bookingType === "package" && packageId) {
        const pkg = await TourPackage.findById(packageId);
        if (pkg) calculatedAmount = pkg.price * (Number(travelers) || 1);
      } else if (bookingType === "hotel" && hotelId) {
        const htl = await Hotel.findById(hotelId);
        if (htl) calculatedAmount = htl.pricePerNight * (Number(travelers) || 1);
      }
    }

    const genTxnId = transactionId || ("TXN" + Math.floor(10000000 + Math.random() * 90000000));

    const booking = await Booking.create({
      user: req.user._id,
      bookingType: bookingType || "package",
      package: packageId || null,
      hotel: hotelId || null,
      travelers: Number(travelers) || 1,
      travelDate: travelDate || new Date(),
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests: specialRequests || "",
      totalAmount: calculatedAmount || 0,
      paymentStatus: "paid",
      paymentMethod: paymentMethod || "Credit/Debit Card",
      transactionId: genTxnId,
      status: "confirmed",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("package")
      .populate("hotel")
      .populate("user", "name email phone");

    res.status(201).json({
      message: "Booking & Payment completed successfully!",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error creating booking",
    });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("package")
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error fetching user bookings",
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("package")
      .populate("hotel")
      .populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check ownership or admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone role")
      .populate("package")
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error fetching bookings",
    });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("package")
      .populate("hotel");

    res.json({
      message: "Booking status updated successfully",
      booking: populated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking (Admin)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
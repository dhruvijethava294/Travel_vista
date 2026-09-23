// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Component: BookingModal.jsx
// Description: Modal popup for booking tour packages and hotel stays.
// Integrated with Demo Payment Gateway (Card, UPI, QR, NetBanking).
// Enforces user login before allowing booking submission.
// =========================================================================

import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import PaymentModal from "./PaymentModal";
import {
  Calendar,
  Users,
  CheckCircle,
  X,
  CreditCard,
  Building,
  Sparkles,
  AlertCircle,
  Lock,
  LogIn,
  UserPlus,
  Printer,
  ShieldCheck,
  ShieldAlert,
  Package,
} from "lucide-react";

function BookingModal({ isOpen, onClose, item, type = "package", availableHotels = [] }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form states
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState("");
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync logged-in user contact information
  useEffect(() => {
    if (user) {
      setContactName(user.name || "");
      setContactEmail(user.email || "");
      setContactPhone(user.phone || "");
    } else {
      setContactName("");
      setContactEmail("");
      setContactPhone("");
    }
  }, [user]);

  // Set default selected hotel if available
  useEffect(() => {
    if (item && item.includedHotels && item.includedHotels.length > 0) {
      const firstHotel = item.includedHotels[0];
      setSelectedHotelId(typeof firstHotel === "object" ? firstHotel._id : firstHotel);
    } else if (type === "hotel" && item) {
      setSelectedHotelId(item._id);
    }
  }, [item, type]);

  if (!isOpen || !item) return null;

  // Calculate pricing based on item type and traveler count
  const basePrice = type === "package" ? item.price : item.pricePerNight;
  const travelersNum = Math.max(1, Number(travelers) || 1);
  const totalAmount = (basePrice || 0) * travelersNum;

  // Step 1: Open Demo Payment Modal
  const handleOpenPayment = (e) => {
    e.preventDefault();

    if (user && user.role === "admin") {
      setErrorMsg("Administrator accounts cannot book packages. Please sign in with a Customer account to place reservations.");
      return;
    }

    if (!user) {
      setErrorMsg("You must be logged in to book. Please sign in or register.");
      return;
    }

    if (!travelDate) {
      setErrorMsg("Please select a travel start date.");
      return;
    }

    if (!contactName || !contactEmail || !contactPhone) {
      setErrorMsg("Please provide your contact name, email, and phone number.");
      return;
    }

    setErrorMsg("");
    setIsPaymentOpen(true);
  };

  // Step 2: On Payment Success -> Create Booking
  const handlePaymentSuccess = async (paymentDetails) => {
    setIsPaymentOpen(false);
    try {
      setSubmitting(true);
      setErrorMsg("");

      const payload = {
        bookingType: type,
        package: type === "package" ? item._id : undefined,
        hotel: selectedHotelId || (type === "hotel" ? item._id : undefined),
        travelers: travelersNum,
        travelDate: new Date(travelDate),
        contactName,
        contactEmail,
        contactPhone,
        specialRequests,
        totalAmount,
        paymentMethod: paymentDetails.paymentMethod,
        transactionId: paymentDetails.transactionId,
        paymentStatus: paymentDetails.paymentStatus,
      };

      let finalBooking = null;

      try {
        const response = await api.post("/bookings", payload);
        finalBooking = response.data.booking;
      } catch (apiErr) {
        // Fallback local booking simulation
        finalBooking = {
          _id: "BK" + Math.floor(100000 + Math.random() * 900000),
          bookingType: type,
          package: type === "package" ? item : undefined,
          hotel: type === "hotel" ? item : undefined,
          user: { name: contactName, email: contactEmail, phone: contactPhone },
          travelers: travelersNum,
          travelDate: new Date(travelDate).toISOString(),
          contactName,
          contactEmail,
          contactPhone,
          specialRequests,
          totalAmount,
          paymentMethod: paymentDetails.paymentMethod,
          transactionId: paymentDetails.transactionId,
          paymentStatus: "paid",
          status: "confirmed",
          createdAt: new Date().toISOString(),
        };
      }

      // Always sync to localStorage so Admin & User pages instantly see it!
      const existing = JSON.parse(localStorage.getItem("local_bookings") || "[]");
      localStorage.setItem("local_bookings", JSON.stringify([finalBooking, ...existing]));

      setBookingSuccess(finalBooking);
    } catch (err) {
      setErrorMsg(err.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setBookingSuccess(null);
    setIsPaymentOpen(false);
    setErrorMsg("");
    onClose();
  };

  return (
    <>
      <div
        className="modal show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", zIndex: 1060 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Modal Header */}
            <div className="modal-header bg-dark text-white py-3 px-4">
              <div className="d-flex align-items-center gap-2">
                <Sparkles className="text-warning" size={20} />
                <h5 className="modal-title brand-font text-white mb-0">
                  {type === "package" ? "Book Tour Package" : "Book Hotel Stay"}
                </h5>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body p-4">
              {/* Case 0: Administrator Accounts Cannot Place Bookings */}
              {user && user.role === "admin" ? (
                <div className="text-center py-4">
                  <div className="d-inline-flex p-3 bg-danger bg-opacity-10 text-danger rounded-circle mb-3">
                    <ShieldAlert size={48} className="text-danger" />
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Admin Mode: Bookings Disabled</h4>
                  <p className="text-muted mx-auto mb-4" style={{ maxWidth: "480px" }}>
                    As an Administrator, you can view packages, create new packages, manage hotels, and respond to customer inquiries. <strong>Administrator accounts cannot place customer bookings.</strong>
                  </p>

                  <div className="card bg-light border-0 p-3 mb-4 text-start mx-auto" style={{ maxWidth: "480px" }}>
                    <div className="d-flex gap-3 align-items-center">
                      <img
                        src={item.image}
                        alt={item.title || item.name}
                        className="rounded-3"
                        style={{ width: "65px", height: "65px", objectFit: "cover" }}
                      />
                      <div>
                        <h6 className="fw-bold text-dark mb-1">{item.title || item.name}</h6>
                        <span className="badge bg-secondary small mb-1">
                          📍 {item.destination || item.location}
                        </span>
                        <div className="small text-muted">
                          To make a customer booking or test user payments, please sign in with a Customer account (e.g. <code>user@travelvista.com</code>).
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button className="btn btn-outline-secondary px-4 py-2" onClick={handleClose}>
                      Close
                    </button>
                    <button
                      className="btn btn-primary-custom px-4 py-2 d-flex align-items-center gap-2"
                      onClick={() => {
                        handleClose();
                        navigate("/admin/packages");
                      }}
                    >
                      <Package size={18} />
                      <span>Manage Packages in Admin</span>
                    </button>
                  </div>
                </div>
              ) : !user ? (
                <div className="text-center py-4">
                  <div className="d-inline-flex p-3 bg-warning bg-opacity-10 text-warning rounded-circle mb-3">
                    <Lock size={48} className="text-warning" />
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Login Required to Book</h4>
                  <p className="text-muted mx-auto mb-4" style={{ maxWidth: "460px" }}>
                    To ensure instant reservation confirmation, secure demo payment, and voucher generation, you must be logged in before booking.
                  </p>

                  <div className="card bg-light border-0 p-3 mb-4 text-start mx-auto" style={{ maxWidth: "460px" }}>
                    <div className="d-flex gap-3 align-items-center">
                      <img
                        src={item.image}
                        alt={item.title || item.name}
                        className="rounded-3"
                        style={{ width: "65px", height: "65px", objectFit: "cover" }}
                      />
                      <div>
                        <h6 className="fw-bold text-dark mb-1">{item.title || item.name}</h6>
                        <span className="text-muted small d-block">
                          📍 {item.destination || item.location}
                        </span>
                        <strong className="text-primary">
                          ₹{basePrice?.toLocaleString()} / {type === "package" ? "person" : "night"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button
                      className="btn btn-primary-custom px-4 py-2 d-flex align-items-center gap-2"
                      onClick={() => {
                        handleClose();
                        navigate("/login");
                      }}
                    >
                      <LogIn size={18} />
                      <span>Sign In / Login</span>
                    </button>
                    <button
                      className="btn btn-outline-primary px-4 py-2 d-flex align-items-center gap-2"
                      onClick={() => {
                        handleClose();
                        navigate("/register");
                      }}
                    >
                      <UserPlus size={18} />
                      <span>Create New Account</span>
                    </button>
                  </div>
                </div>
              ) : bookingSuccess ? (
                /* Case 2: Booking Confirmed & Payment Success Screen */
                <div className="text-center py-4">
                  <div className="mb-3 text-success">
                    <CheckCircle size={60} className="mx-auto" />
                  </div>
                  <h3 className="fw-bold text-dark mb-1">Booking & Payment Successful!</h3>
                  <p className="text-muted mb-3">
                    Thank you, <strong>{contactName}</strong>! Your payment has been approved and reservation placed.
                  </p>

                  <div className="card bg-light border-0 p-3 mb-4 text-start mx-auto" style={{ maxWidth: "480px" }}>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Booking Reference:</span>
                      <strong className="badge bg-primary fs-6">
                        #{bookingSuccess._id?.slice(-8).toUpperCase()}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Transaction ID:</span>
                      <span className="font-monospace fw-bold text-dark">
                        {bookingSuccess.transactionId || "TXN-VERIFIED-9821"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Payment Method:</span>
                      <span className="badge bg-success bg-opacity-10 text-success fw-bold">
                        {bookingSuccess.paymentMethod || "Credit/Debit Card"} (PAID)
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Booked Item:</span>
                      <strong className="text-dark">{item.title || item.name}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Travel Date:</span>
                      <span>{new Date(travelDate).toLocaleDateString()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Travelers:</span>
                      <span>{travelersNum} Guest(s)</span>
                    </div>
                    <div className="d-flex justify-content-between pt-2 border-top">
                      <span className="fw-bold">Total Amount Paid:</span>
                      <span className="fw-bold text-primary fs-5">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button className="btn btn-outline-secondary px-4" onClick={handleClose}>
                      Close
                    </button>
                    <button
                      className="btn btn-primary-custom px-4"
                      onClick={() => {
                        handleClose();
                        navigate("/my-bookings");
                      }}
                    >
                      View in My Bookings
                    </button>
                  </div>
                </div>
              ) : (
                /* Case 3: Logged-in User Booking Form */
                <form onSubmit={handleOpenPayment}>
                  {errorMsg && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3">
                      <AlertCircle size={16} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Item Summary Card */}
                  <div className="card bg-light border-0 p-3 mb-3">
                    <div className="row align-items-center g-3">
                      <div className="col-auto">
                        <img
                          src={item.image}
                          alt={item.title || item.name}
                          className="rounded-3"
                          style={{ width: "75px", height: "75px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="col">
                        <h6 className="fw-bold mb-1 text-dark">{item.title || item.name}</h6>
                        <p className="text-muted small mb-1">
                          📍 {item.destination || item.location} • {item.duration || `Rating: ${item.rating} ⭐`}
                        </p>
                        <span className="text-primary fw-bold">
                          ₹{basePrice?.toLocaleString()} / {type === "package" ? "person" : "night"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Inputs */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">
                        <Users size={15} className="me-1 text-primary" />
                        Number of Travelers
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className="form-control"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">
                        <Calendar size={15} className="me-1 text-primary" />
                        Travel / Check-in Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={travelDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setTravelDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Hotel Selection if Available */}
                  {type === "package" && availableHotels.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-muted">
                        <Building size={15} className="me-1 text-primary" />
                        Selected Hotel / Accommodation
                      </label>
                      <select
                        className="form-select"
                        value={selectedHotelId}
                        onChange={(e) => setSelectedHotelId(e.target.value)}
                      >
                        <option value="">Default Standard Hotel</option>
                        {availableHotels.map((h) => (
                          <option key={h._id} value={h._id}>
                            {h.name} ({h.location}) - ⭐ {h.rating}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Contact Information (Auto-filled from User State) */}
                  <h6 className="fw-bold mt-4 mb-2 small text-uppercase text-muted border-top pt-3">
                    Customer Contact Information
                  </h6>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small text-muted">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-muted">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-muted">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-muted">Special Preferences (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Vegetarian meals, airport pickup, double bed..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-light p-3 rounded-3 mb-4 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="small text-muted d-block">
                        ₹{basePrice?.toLocaleString()} × {travelersNum} Traveler(s)
                      </span>
                      <strong className="text-dark">Grand Total Payable:</strong>
                    </div>
                    <span className="price-tag text-primary fs-4">₹{totalAmount.toLocaleString()}</span>
                  </div>

                  {/* Form Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={handleClose}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary-custom px-4 d-flex align-items-center gap-2"
                      disabled={submitting}
                    >
                      <CreditCard size={18} />
                      <span>{submitting ? "Processing..." : `Proceed to Payment (₹${totalAmount.toLocaleString()})`}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={totalAmount}
        itemTitle={item.title || item.name}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}

export default BookingModal;

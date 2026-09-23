// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: PlanTour.jsx
// Description: Interactive 3-step Custom Tour Planner.
// Users choose a package, select hotel accommodation, and pay demo amount.
// Enforces user login before booking submission.
// =========================================================================

import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { mockPackages, mockHotels } from "../services/mockData";
import PaymentModal from "../components/PaymentModal";
import {
  Compass,
  CheckCircle2,
  Building,
  Calendar,
  Users,
  CreditCard,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  Lock,
  LogIn,
  UserPlus,
} from "lucide-react";

function PlanTour() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [packages, setPackages] = useState(mockPackages);
  const [hotels, setHotels] = useState(mockHotels);
  const [loading, setLoading] = useState(true);

  // Selection states
  const [selectedPackageId, setSelectedPackageId] = useState(
    searchParams.get("package") || mockPackages[0]._id
  );
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [travelDate, setTravelDate] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Contact info
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Payment State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pkgRes, htlRes] = await Promise.allSettled([
          api.get("/packages"),
          api.get("/hotels"),
        ]);

        const pkgs =
          pkgRes.status === "fulfilled" && pkgRes.value.data?.length > 0
            ? pkgRes.value.data
            : mockPackages;
        const htls =
          htlRes.status === "fulfilled" && htlRes.value.data?.length > 0
            ? htlRes.value.data
            : mockHotels;

        setPackages(pkgs);
        setHotels(htls);

        const queryPkgId = searchParams.get("package");
        if (queryPkgId && pkgs.find((p) => p._id === queryPkgId)) {
          setSelectedPackageId(queryPkgId);
        } else if (pkgs.length > 0) {
          setSelectedPackageId(pkgs[0]._id);
        }
      } catch (err) {
        setPackages(mockPackages);
        setHotels(mockHotels);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Sync logged in user data
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

  const currentPackage = packages.find((p) => p._id === selectedPackageId) || packages[0];
  const matchingHotels = hotels.filter(
    (h) =>
      !currentPackage ||
      h.city?.toLowerCase() === currentPackage.destination?.toLowerCase() ||
      h.location?.toLowerCase().includes(currentPackage.destination?.toLowerCase())
  );
  const availableHotels = matchingHotels.length > 0 ? matchingHotels : hotels;

  const currentHotel = hotels.find((h) => h._id === selectedHotelId) || availableHotels[0];

  // Pricing calculation
  const packagePrice = currentPackage ? currentPackage.price : 14999;
  const hotelUpgradePrice = currentHotel ? Math.round(currentHotel.pricePerNight * 0.2) : 0;
  const pricePerPerson = packagePrice + hotelUpgradePrice;
  const travelersCount = Math.max(1, Number(travelers) || 1);
  const grandTotal = pricePerPerson * travelersCount;

  // Step 1: Open Payment Gateway
  const handleOpenPayment = (e) => {
    e.preventDefault();

    if (user && user.role === "admin") {
      setErrorMsg("Administrator accounts cannot book packages. Please log in with a customer account to make a reservation.");
      return;
    }

    if (!user) {
      setErrorMsg("You must be logged in to book a custom tour. Please sign in or register.");
      return;
    }

    if (!travelDate) {
      setErrorMsg("Please choose your intended travel start date.");
      return;
    }

    if (!contactName || !contactEmail || !contactPhone) {
      setErrorMsg("Please fill in your name, email, and contact phone number.");
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
        bookingType: "custom_tour",
        package: selectedPackageId,
        hotel: currentHotel?._id,
        travelers: travelersCount,
        travelDate: new Date(travelDate),
        contactName,
        contactEmail,
        contactPhone,
        specialRequests,
        totalAmount: grandTotal,
        paymentMethod: paymentDetails.paymentMethod,
        transactionId: paymentDetails.transactionId,
        paymentStatus: paymentDetails.paymentStatus,
      };

      let finalBooking = null;

      try {
        const res = await api.post("/bookings", payload);
        finalBooking = res.data.booking;
      } catch (apiErr) {
        // Fallback local booking simulation
        finalBooking = {
          _id: "BK" + Math.floor(100000 + Math.random() * 900000),
          bookingType: "custom_tour",
          package: currentPackage,
          hotel: currentHotel,
          user: { name: contactName, email: contactEmail, phone: contactPhone },
          travelers: travelersCount,
          travelDate: new Date(travelDate).toISOString(),
          contactName,
          contactEmail,
          contactPhone,
          specialRequests,
          totalAmount: grandTotal,
          paymentMethod: paymentDetails.paymentMethod,
          transactionId: paymentDetails.transactionId,
          paymentStatus: "paid",
          status: "confirmed",
          createdAt: new Date().toISOString(),
        };
      }

      // Always sync to localStorage so Admin & User pages see it immediately!
      const existing = JSON.parse(localStorage.getItem("local_bookings") || "[]");
      localStorage.setItem("local_bookings", JSON.stringify([finalBooking, ...existing]));

      setBookingSuccess(finalBooking);
    } catch (err) {
      setErrorMsg(err.message || "Failed to book custom tour. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="py-5 bg-light min-vh-100">
        <div className="container">
          {/* Page Header */}
          <div className="text-center mb-5">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-2">
              ✨ MCA Academic Project: Custom Tour Planner
            </span>
            <h1 className="brand-font fw-bold">Plan & Customize Your Tour</h1>
            <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
              Select a destination package, customize your hotel stay, and complete demo payment with instant confirmation.
            </p>
          </div>

          {/* Guest Warning Banner if Not Logged In */}
          {!user && !bookingSuccess && (
            <div className="alert alert-warning border-warning rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap g-3">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 bg-warning bg-opacity-25 rounded-circle text-dark">
                  <Lock size={24} />
                </div>
                <div>
                  <strong className="d-block text-dark">Login Required to Book Tours</strong>
                  <span className="small text-muted">
                    You can explore and customize packages freely, but you must log in or register before completing your payment.
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-sm btn-dark px-3 d-flex align-items-center gap-1">
                  <LogIn size={15} /> <span>Sign In</span>
                </Link>
                <Link to="/register" className="btn btn-sm btn-outline-dark px-3 d-flex align-items-center gap-1">
                  <UserPlus size={15} /> <span>Register</span>
                </Link>
              </div>
            </div>
          )}

          {bookingSuccess ? (
            /* Booking & Payment Success Card */
            <div className="card shadow-lg border-0 rounded-4 p-5 text-center max-w-700 mx-auto bg-white">
              <div className="text-success mb-3">
                <CheckCircle2 size={64} className="mx-auto" />
              </div>
              <h2 className="brand-font fw-bold mb-2">Booking & Payment Successful!</h2>
              <p className="text-muted mb-4">
                Booking Reference:{" "}
                <span className="badge bg-primary fs-6">
                  #{bookingSuccess._id?.slice(-8).toUpperCase()}
                </span>
              </p>

              <div className="card bg-light border-0 p-4 mb-4 text-start">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Transaction ID:</span>
                  <span className="font-monospace fw-bold text-dark">
                    {bookingSuccess.transactionId || "TXN-DEMO-9912"}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Payment Mode:</span>
                  <span className="badge bg-success bg-opacity-10 text-success fw-bold">
                    {bookingSuccess.paymentMethod || "Credit/Debit Card"} (PAID)
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Selected Package:</span>
                  <strong className="text-dark">{currentPackage?.title}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Selected Hotel:</span>
                  <strong className="text-dark">{currentHotel?.name}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Departure Date:</span>
                  <span>{new Date(travelDate).toLocaleDateString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Travelers:</span>
                  <span>{travelersCount} Guest(s)</span>
                </div>
                <div className="d-flex justify-content-between pt-3 border-top">
                  <span className="fw-bold">Total Amount Paid:</span>
                  <span className="fw-bold text-primary fs-4">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setBookingSuccess(null)}
                >
                  Plan Another Tour
                </button>
                <Link to="/my-bookings" className="btn btn-primary-custom px-4">
                  View in My Bookings
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleOpenPayment}>
              {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                  <AlertCircle size={20} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="row g-4">
                {/* Left Column: Interactive Steps */}
                <div className="col-lg-8">
                  {/* Step 1: Base Package */}
                  <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary text-white rounded-circle p-2">1</span>
                      <h4 className="fw-bold brand-font mb-0">Select Base Tour Package</h4>
                    </div>
                    <p className="text-muted small mb-3">
                      Choose the holiday package you want to customize:
                    </p>

                    <div className="row g-3">
                      {packages.map((pkg) => (
                        <div className="col-md-6" key={pkg._id}>
                          <div
                            className={`card p-3 h-100 rounded-3 cursor-pointer border ${
                              selectedPackageId === pkg._id
                                ? "border-primary border-2 bg-primary-light bg-opacity-25 shadow-sm"
                                : "border-light-subtle bg-white"
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedPackageId(pkg._id)}
                          >
                            <div className="d-flex gap-3 align-items-center">
                              <img
                                src={pkg.image}
                                alt={pkg.title}
                                className="rounded-3"
                                style={{ width: "75px", height: "75px", objectFit: "cover" }}
                              />
                              <div>
                                <h6 className="fw-bold text-dark mb-1">{pkg.title}</h6>
                                <div className="small text-muted mb-1">
                                  📍 {pkg.destination} • ⏱️ {pkg.duration}
                                </div>
                                <span className="text-primary fw-bold">
                                  ₹{pkg.price?.toLocaleString()} /person
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Choose / Upgrade Hotel */}
                  <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary text-white rounded-circle p-2">2</span>
                      <h4 className="fw-bold brand-font mb-0">Choose Hotel & Resort Accommodation</h4>
                    </div>
                    <p className="text-muted small mb-3">
                      Select a verified hotel in {currentPackage?.destination || "the destination"}:
                    </p>

                    <div className="row g-3">
                      {availableHotels.map((htl) => (
                        <div className="col-md-6" key={htl._id}>
                          <div
                            className={`card p-3 h-100 rounded-3 cursor-pointer border ${
                              (selectedHotelId || availableHotels[0]._id) === htl._id
                                ? "border-primary border-2 bg-primary-light bg-opacity-25 shadow-sm"
                                : "border-light-subtle bg-white"
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedHotelId(htl._id)}
                        >
                          <div className="d-flex gap-3 align-items-center">
                            <img
                              src={htl.image}
                              alt={htl.name}
                              className="rounded-3"
                              style={{ width: "75px", height: "75px", objectFit: "cover" }}
                            />
                            <div>
                              <h6 className="fw-bold text-dark mb-1">{htl.name}</h6>
                              <div className="small text-muted mb-1">
                                📍 {htl.location} • ⭐ {htl.rating}
                              </div>
                              <span className="text-secondary fw-bold small">
                                {htl.roomType || "Deluxe Suite"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>

                  {/* Step 3: Dates & Travelers */}
                  <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary text-white rounded-circle p-2">3</span>
                      <h4 className="fw-bold brand-font mb-0">Trip Dates & Passenger Details</h4>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">
                          <Calendar size={15} className="me-1 text-primary" />
                          Departure / Travel Start Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          min={new Date().toISOString().split("T")[0]}
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">
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
                    </div>

                    <h6 className="fw-bold mb-3 border-top pt-3 small text-uppercase text-muted">
                      Lead Passenger Contact Information
                    </h6>
                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <label className="form-label small text-muted">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. John Doe"
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
                          placeholder="e.g. john@example.com"
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
                          placeholder="e.g. +91 98765 43210"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label small text-muted">Special Preferences (Optional)</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Airport pickup time, vegetarian meals, wheelchair assistance..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Quotation Summary */}
                <div className="col-lg-4">
                  <div className="card shadow border-0 rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
                    <h4 className="fw-bold brand-font mb-3">Live Quotation</h4>

                    {/* Base Package summary */}
                    <div className="mb-3 border-bottom pb-3">
                      <span className="text-muted small d-block mb-1">Base Package:</span>
                      <strong className="text-dark d-block mb-1">{currentPackage?.title}</strong>
                      <span className="small text-muted">
                        📍 {currentPackage?.destination} ({currentPackage?.duration})
                      </span>
                    </div>

                    {/* Hotel Stay summary */}
                    <div className="mb-3 border-bottom pb-3">
                      <span className="text-muted small d-block mb-1">Hotel Stay:</span>
                      <strong className="text-dark d-block mb-1">{currentHotel?.name}</strong>
                      <span className="small text-muted">
                        📍 {currentHotel?.location} ({currentHotel?.roomType || "Deluxe Suite"})
                      </span>
                    </div>

                    {/* Cost breakdown */}
                    <div className="bg-light p-3 rounded-3 mb-4">
                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Package Rate:</span>
                        <span>₹{packagePrice.toLocaleString()} /person</span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Hotel Surcharge:</span>
                        <span>₹{hotelUpgradePrice.toLocaleString()} /person</span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Passengers:</span>
                        <span>× {travelersCount} Guest(s)</span>
                      </div>
                      <div className="d-flex justify-content-between pt-2 border-top">
                        <strong className="text-dark">Grand Total:</strong>
                        <span className="price-tag text-primary fs-4">₹{grandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Submit / Login Button */}
                    {user ? (
                      <button
                        type="submit"
                        className="btn btn-primary-custom w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                        disabled={submitting}
                      >
                        <CreditCard size={18} />
                        <span>Proceed to Pay ₹{grandTotal.toLocaleString()}</span>
                      </button>
                    ) : (
                      <div className="text-center">
                        <Link
                          to="/login"
                          className="btn btn-primary-custom w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mb-2"
                        >
                          <LogIn size={18} />
                          <span>Login to Pay & Book</span>
                        </Link>
                        <span className="small text-muted">
                          Don't have an account? <Link to="/register" className="fw-bold">Register here</Link>
                        </span>
                      </div>
                    )}

                    <div className="mt-3 text-center">
                      <span className="small text-muted d-flex align-items-center justify-content-center gap-1">
                        <ShieldCheck size={14} className="text-success" />
                        256-Bit SSL Demo Payment Guarantee
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Demo Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={grandTotal}
        itemTitle={`Custom Tour: ${currentPackage?.title}`}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}

export default PlanTour;

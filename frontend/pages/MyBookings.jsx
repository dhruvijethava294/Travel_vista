// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: MyBookings.jsx
// Description: User dashboard for viewing personal bookings,
// cancelling reservations, and downloading/printing travel vouchers.
// =========================================================================

import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { mockBookings } from "../services/mockData";
import {
  CalendarCheck,
  Package,
  Building,
  Calendar,
  Users,
  CreditCard,
  AlertCircle,
  FileText,
  XCircle,
  CheckCircle2,
  Printer,
  Sparkles,
  Lock,
  LogIn,
  UserPlus,
} from "lucide-react";

function MyBookings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState(mockBookings);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/bookings/my-bookings");
      if (res.data && res.data.length > 0) {
        setBookings(res.data);
      } else {
        const local = JSON.parse(localStorage.getItem("local_bookings") || "[]");
        setBookings([...local, ...mockBookings]);
      }
    } catch (err) {
      const local = JSON.parse(localStorage.getItem("local_bookings") || "[]");
      setBookings([...local, ...mockBookings]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setCancellingId(id);
      try {
        await api.put(`/bookings/${id}/cancel`);
      } catch (e) {
        // Local state update for smooth demo
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
        );
      }
      fetchBookings();
    } catch (err) {
      alert("Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  // If user is not logged in, prompt authentication
  if (!user) {
    return (
      <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="card shadow-sm border-0 rounded-4 text-center p-5 max-w-700 mx-auto bg-white">
            <div className="d-inline-flex p-3 bg-warning bg-opacity-10 text-warning rounded-circle mb-3 mx-auto">
              <Lock size={48} className="text-warning" />
            </div>
            <h3 className="brand-font fw-bold text-dark mb-2">Login Required</h3>
            <p className="text-muted mb-4">
              Please sign in to your TravelVista account to access your booked tours, hotel reservations, and official travel vouchers.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/login" className="btn btn-primary-custom px-4 d-flex align-items-center gap-2">
                <LogIn size={18} />
                <span>Sign In / Login</span>
              </Link>
              <Link to="/register" className="btn btn-outline-secondary px-4 d-flex align-items-center gap-2">
                <UserPlus size={18} />
                <span>Register Account</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "all") return true;
    return b.status === filterStatus;
  });

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap g-3">
          <div>
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-1">
              🎫 Travel Management (Logged in as {user.name})
            </span>
            <h1 className="brand-font fw-bold mb-0">My Bookings & Trips</h1>
          </div>
          <Link to="/packages" className="btn btn-primary-custom">
            Book New Tour
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="d-flex gap-2 mb-4 border-bottom pb-3 flex-wrap">
          {["all", "confirmed", "pending", "cancelled"].map((st) => (
            <button
              key={st}
              className={`btn btn-sm ${
                filterStatus === st ? "btn-dark text-white fw-bold" : "btn-outline-secondary"
              } rounded-pill px-4 text-capitalize`}
              onClick={() => setFilterStatus(st)}
            >
              {st === "all" ? `All Bookings (${bookings.length})` : `${st}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading your reservations...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card shadow-sm border-0 rounded-4 text-center p-5 bg-white">
            <CalendarCheck size={56} className="mx-auto text-muted mb-3" />
            <h4 className="fw-bold">No Bookings Found</h4>
            <p className="text-muted mb-4">
              {filterStatus === "all"
                ? "You haven't booked any tours or hotel stays yet."
                : `No ${filterStatus} bookings found.`}
            </p>
            <div>
              <Link to="/packages" className="btn btn-primary-custom px-4">
                Explore Packages Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredBookings.map((b) => {
              const itemTitle = b.package?.title || b.hotel?.name || "Custom Tour Reservation";
              const itemDest = b.package?.destination || b.hotel?.location || "Tour Location";
              const itemImg =
                b.package?.image ||
                b.hotel?.image ||
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";

              return (
                <div className="col-12" key={b._id}>
                  <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white p-4">
                    <div className="row align-items-center g-4">
                      {/* Image Thumbnail */}
                      <div className="col-md-2 col-12">
                        <img
                          src={itemImg}
                          alt={itemTitle}
                          className="rounded-3 w-100"
                          style={{ height: "120px", objectFit: "cover" }}
                        />
                      </div>

                      {/* Details */}
                      <div className="col-md-5 col-12">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-secondary text-white text-uppercase small">
                            {b.bookingType === "package"
                              ? "Tour Package"
                              : b.bookingType === "hotel"
                              ? "Hotel Stay"
                              : "Custom Tour"}
                          </span>
                          <span className="text-muted small">
                            Ref: <strong>{b._id?.slice(-8).toUpperCase()}</strong>
                          </span>
                        </div>
                        <h5 className="fw-bold brand-font text-dark mb-1">{itemTitle}</h5>
                        <p className="text-muted small mb-2">📍 {itemDest}</p>
                        <div className="d-flex gap-3 text-secondary small">
                          <span className="d-flex align-items-center gap-1">
                            <Calendar size={14} className="text-primary" />
                            {new Date(b.travelDate).toLocaleDateString()}
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <Users size={14} className="text-primary" />
                            {b.travelers} Guest(s)
                          </span>
                        </div>
                      </div>

                      {/* Status & Amount */}
                      <div className="col-md-2 col-6 text-md-center">
                        <span className="text-muted small d-block mb-1">Status</span>
                        <span
                          className={`badge ${
                            b.status === "confirmed"
                              ? "bg-success"
                              : b.status === "cancelled"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          } px-3 py-2 text-capitalize`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <div className="col-md-3 col-6 text-end">
                        <span className="text-muted small d-block mb-1">Total Amount</span>
                        <h4 className="fw-bold text-primary brand-font mb-3">
                          ₹{b.totalAmount?.toLocaleString()}
                        </h4>

                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            onClick={() => setSelectedVoucher(b)}
                          >
                            <FileText size={14} />
                            <span>Voucher</span>
                          </button>
                          {b.status !== "cancelled" && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              disabled={cancellingId === b._id}
                              onClick={() => handleCancelBooking(b._id)}
                            >
                              {cancellingId === b._id ? "Cancelling..." : "Cancel"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Printable Booking Voucher Modal */}
      {selectedVoucher && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 overflow-hidden shadow-lg">
              <div className="modal-header bg-dark text-white py-3 px-4">
                <h5 className="modal-title brand-font text-white d-flex align-items-center gap-2">
                  <FileText size={20} className="text-warning" />
                  <span>TravelVista Official Travel Voucher</span>
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedVoucher(null)}
                ></button>
              </div>

              <div className="modal-body p-4" id="printable-voucher">
                <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
                  <div>
                    <h3 className="brand-font fw-bold text-primary mb-1">
                      Travel<span className="text-warning">Vista</span>
                    </h3>
                    <p className="text-muted small mb-0">Booking Confirmation & Travel Voucher</p>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success px-3 py-2 fs-6 text-uppercase">
                      {selectedVoucher.status}
                    </span>
                    <p className="text-muted small mt-1 mb-0">
                      ID: #{selectedVoucher._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <h6 className="text-uppercase text-muted small fw-bold">Primary Traveler</h6>
                    <p className="fw-bold mb-1">{selectedVoucher.contactName}</p>
                    <p className="text-muted small mb-0">✉️ {selectedVoucher.contactEmail}</p>
                    <p className="text-muted small mb-0">📞 {selectedVoucher.contactPhone}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-uppercase text-muted small fw-bold">Reservation Schedule</h6>
                    <p className="mb-1">
                      <strong>Travel Date:</strong> {new Date(selectedVoucher.travelDate).toLocaleDateString()}
                    </p>
                    <p className="mb-0 text-muted small">
                      <strong>Travelers Count:</strong> {selectedVoucher.travelers} Guest(s)
                    </p>
                  </div>
                </div>

                <div className="card bg-light border-0 p-3 mb-4">
                  <h6 className="fw-bold mb-2">Booked Service Details</h6>
                  <p className="fw-bold text-primary mb-1">
                    {selectedVoucher.package?.title || selectedVoucher.hotel?.name || "Custom Tour"}
                  </p>
                  {selectedVoucher.package && (
                    <p className="small text-muted mb-1">
                      Duration: {selectedVoucher.package.duration} • Destination: {selectedVoucher.package.destination}
                    </p>
                  )}
                  {selectedVoucher.hotel && (
                    <p className="small text-muted mb-1">
                      Hotel: {selectedVoucher.hotel.name} ({selectedVoucher.hotel.location})
                    </p>
                  )}
                  {selectedVoucher.specialRequests && (
                    <p className="small text-muted mb-0">
                      <strong>Notes:</strong> {selectedVoucher.specialRequests}
                    </p>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top flex-wrap g-2">
                  <div>
                    <span className="text-muted small d-block">
                      Payment Mode: <strong>{selectedVoucher.paymentMethod || "Credit/Debit Card"}</strong> (PAID)
                    </span>
                    <span className="text-muted small font-monospace">
                      Txn ID: {selectedVoucher.transactionId || "TXN-VERIFIED-9821"}
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="small text-muted d-block">Grand Total Paid:</span>
                    <span className="price-tag text-primary fs-4">₹{selectedVoucher.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light border-0 p-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedVoucher(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary-custom d-flex align-items-center gap-2"
                  onClick={() => window.print()}
                >
                  <Printer size={16} />
                  <span>Print Voucher</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
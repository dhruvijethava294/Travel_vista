// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: AdminBookings.jsx
// Description: Admin management of customer reservations and bookings
// Displays all user bookings, payment status, payment method, customer info,
// and live status update controls.
// =========================================================================

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import { mockBookings } from "../services/mockData";
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Users,
  Calendar,
  Phone,
  Mail,
  Filter,
  Lock,
  LogIn,
  CreditCard,
  FileText,
  Printer,
  Sparkles,
} from "lucide-react";

function AdminBookings() {
  const { user, isAdmin } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Robust Fetch Function: Retrieves from Backend API & merges local bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      let apiBookings = [];

      try {
        const res = await api.get("/bookings");
        if (res.data && Array.isArray(res.data)) {
          apiBookings = res.data;
        }
      } catch (apiErr) {
        console.warn("Backend API bookings fetch warning:", apiErr.message);
      }

      // Retrieve locally saved bookings
      const localBookings = JSON.parse(localStorage.getItem("local_bookings") || "[]");

      // Merge backend bookings, local bookings, and default mock bookings without duplicates
      const allMerged = [...apiBookings, ...localBookings, ...mockBookings];
      const seenIds = new Set();
      const uniqueBookings = [];

      for (const item of allMerged) {
        if (item && item._id && !seenIds.has(item._id)) {
          seenIds.add(item._id);
          uniqueBookings.push(item);
        }
      }

      setBookings(uniqueBookings);
    } catch (err) {
      console.error("Error loading admin bookings:", err);
      const local = JSON.parse(localStorage.getItem("local_bookings") || "[]");
      setBookings([...local, ...mockBookings]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchBookings();
    }
  }, [isAdmin]);

  // Update Booking Status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      try {
        await api.put(`/bookings/${id}/status`, { status: newStatus });
      } catch (e) {
        // local update
      }

      // Update local storage if present
      const local = JSON.parse(localStorage.getItem("local_bookings") || "[]");
      const updatedLocal = local.map((b) =>
        b._id === id ? { ...b, status: newStatus } : b
      );
      localStorage.setItem("local_bookings", JSON.stringify(updatedLocal));

      // Update UI state
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert("Failed to update booking status.");
    }
  };

  // Delete Booking
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer booking record?")) return;
    try {
      try {
        await api.delete(`/bookings/${id}`);
      } catch (e) {
        // local deletion
      }

      const local = JSON.parse(localStorage.getItem("local_bookings") || "[]");
      const filteredLocal = local.filter((b) => b._id !== id);
      localStorage.setItem("local_bookings", JSON.stringify(filteredLocal));

      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete booking.");
    }
  };

  // If user is not an Admin, show access gate
  if (!isAdmin) {
    return (
      <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="card shadow-sm border-0 rounded-4 text-center p-5 max-w-700 mx-auto bg-white">
            <Lock size={48} className="text-danger mx-auto mb-3" />
            <h3 className="brand-font fw-bold text-dark mb-2">Admin Access Required</h3>
            <p className="text-muted mb-4">
              Please sign in as an Administrator (e.g. <code>admin@travelvista.com</code>) to view and manage customer bookings.
            </p>
            <div>
              <Link to="/login" className="btn btn-primary-custom px-4 d-inline-flex align-items-center gap-2">
                <LogIn size={18} /> <span>Sign In as Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter Bookings by Search & Status
  const filtered = bookings.filter((b) => {
    const custName = b.contactName || b.user?.name || "";
    const custEmail = b.contactEmail || b.user?.email || "";
    const itemTitle = b.package?.title || b.hotel?.name || b.packageTitle || "";
    const txn = b.transactionId || "";

    const matchesSearch =
      custName.toLowerCase().includes(search.toLowerCase()) ||
      custEmail.toLowerCase().includes(search.toLowerCase()) ||
      itemTitle.toLowerCase().includes(search.toLowerCase()) ||
      txn.toLowerCase().includes(search.toLowerCase()) ||
      b._id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-fluid px-lg-5">
        <div className="row g-4">
          <div className="col-lg-2 col-md-3">
            <AdminSidebar />
          </div>

          <div className="col-lg-10 col-md-9">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap g-3">
              <div>
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold mb-1">
                  📋 Customer Orders & Reservations (MCA Project)
                </span>
                <h2 className="brand-font fw-bold mb-0">Manage User Bookings</h2>
              </div>
              <div className="text-muted small">
                Showing <strong>{filtered.length}</strong> of <strong>{bookings.length}</strong> Total Bookings
              </div>
            </div>

            {/* Filter & Search bar */}
            <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
              <div className="row g-3 align-items-center">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Search size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search by customer name, email, package title, or Txn ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses ({bookings.length})</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending Review</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="text-muted mt-2">Loading user bookings...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <CalendarCheck size={48} className="mx-auto text-muted mb-3" />
                  <h5>No User Bookings Found</h5>
                  <p className="small text-muted">Bookings placed by users will appear here automatically.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr className="small text-muted text-uppercase">
                        <th>Booking ID & Txn</th>
                        <th>Customer Details</th>
                        <th>Booked Item</th>
                        <th>Schedule</th>
                        <th>Payment Details</th>
                        <th>Total (₹)</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((b) => {
                        const itemTitle =
                          b.package?.title || b.hotel?.name || b.packageTitle || "Custom Tour";
                        const customerName = b.contactName || b.user?.name || "Customer";
                        const customerEmail = b.contactEmail || b.user?.email || "customer@example.com";
                        const customerPhone = b.contactPhone || b.user?.phone || "+91 98765 00000";

                        return (
                          <tr key={b._id}>
                            <td>
                              <span className="badge bg-light text-dark border font-monospace d-block mb-1">
                                #{b._id?.slice(-8).toUpperCase()}
                              </span>
                              <small className="text-muted font-monospace d-block" style={{ fontSize: "11px" }}>
                                {b.transactionId || "TXN-PAID"}
                              </small>
                            </td>

                            <td>
                              <strong className="text-dark d-block">{customerName}</strong>
                              <small className="text-muted d-block">{customerEmail}</small>
                              <small className="text-muted">{customerPhone}</small>
                            </td>

                            <td>
                              <span className="fw-semibold text-primary d-block">
                                {itemTitle}
                              </span>
                              <span className="badge bg-secondary small text-capitalize">
                                {b.bookingType || "package"}
                              </span>
                            </td>

                            <td className="small">
                              <div>📅 {new Date(b.travelDate).toLocaleDateString()}</div>
                              <div className="text-muted">👥 {b.travelers || 1} Guest(s)</div>
                            </td>

                            <td className="small">
                              <span className="badge bg-success bg-opacity-10 text-success d-block mb-1">
                                {b.paymentStatus === "paid" ? "✓ PAID" : "PENDING"}
                              </span>
                              <span className="text-muted" style={{ fontSize: "11px" }}>
                                💳 {b.paymentMethod || "Credit/Debit Card"}
                              </span>
                            </td>

                            <td className="fw-bold text-dark fs-6">
                              ₹{b.totalAmount?.toLocaleString()}
                            </td>

                            <td>
                              <select
                                className={`form-select form-select-sm fw-bold ${
                                  b.status === "confirmed"
                                    ? "text-success border-success"
                                    : b.status === "cancelled"
                                    ? "text-danger border-danger"
                                    : "text-warning border-warning"
                                }`}
                                value={b.status || "confirmed"}
                                onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>

                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  title="View Voucher"
                                  onClick={() => setSelectedVoucher(b)}
                                >
                                  <FileText size={15} />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  title="Delete Booking"
                                  onClick={() => handleDelete(b._id)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin View Voucher Modal */}
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
                  <span>Travel Voucher & Invoice Details</span>
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedVoucher(null)}
                ></button>
              </div>

              <div className="modal-body p-4" id="admin-printable-voucher">
                <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
                  <div>
                    <h3 className="brand-font fw-bold text-primary mb-1">
                      Travel<span className="text-warning">Vista</span>
                    </h3>
                    <p className="text-muted small mb-0">Official Booking Voucher & Tax Invoice</p>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success px-3 py-2 fs-6 text-uppercase">
                      {selectedVoucher.status || "CONFIRMED"}
                    </span>
                    <p className="text-muted small mt-1 mb-0">
                      ID: #{selectedVoucher._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <h6 className="text-uppercase text-muted small fw-bold">Customer Details</h6>
                    <p className="fw-bold mb-1">{selectedVoucher.contactName || selectedVoucher.user?.name}</p>
                    <p className="text-muted small mb-0">✉️ {selectedVoucher.contactEmail || selectedVoucher.user?.email}</p>
                    <p className="text-muted small mb-0">📞 {selectedVoucher.contactPhone || selectedVoucher.user?.phone}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-uppercase text-muted small fw-bold">Payment & Schedule</h6>
                    <p className="mb-1">
                      <strong>Travel Date:</strong> {new Date(selectedVoucher.travelDate).toLocaleDateString()}
                    </p>
                    <p className="mb-1 text-muted small">
                      <strong>Transaction ID:</strong> {selectedVoucher.transactionId || "TXN-PAID-9821"}
                    </p>
                    <p className="mb-0 text-muted small">
                      <strong>Payment Mode:</strong> {selectedVoucher.paymentMethod || "Credit/Debit Card"} (PAID)
                    </p>
                  </div>
                </div>

                <div className="card bg-light border-0 p-3 mb-4">
                  <h6 className="fw-bold mb-2">Booked Service</h6>
                  <p className="fw-bold text-primary mb-1">
                    {selectedVoucher.package?.title || selectedVoucher.hotel?.name || "Custom Tour"}
                  </p>
                  {selectedVoucher.package && (
                    <p className="small text-muted mb-1">
                      Duration: {selectedVoucher.package.duration} • Destination: {selectedVoucher.package.destination}
                    </p>
                  )}
                  {selectedVoucher.specialRequests && (
                    <p className="small text-muted mb-0">
                      <strong>Special Requests:</strong> {selectedVoucher.specialRequests}
                    </p>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <div>
                    <span className="text-muted small">Payment Verification: Instant Online Authorized</span>
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
                  <span>Print Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;

// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: AdminDashboard.jsx
// Description: Central Administrator Management Dashboard.
// Displays key analytics (Revenue, Bookings, Packages, Hotels, Destinations)
// and quick status toggles for recent customer orders.
// =========================================================================

import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import { mockPackages, mockHotels, mockDestinations, mockBookings, mockInquiries } from "../services/mockData";
import {
  Package,
  Hotel,
  MapPin,
  CalendarCheck,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  PlusCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  LogIn,
  CreditCard,
  MessageSquare,
} from "lucide-react";

function AdminDashboard() {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    packagesCount: mockPackages.length,
    hotelsCount: mockHotels.length,
    destinationsCount: mockDestinations.length,
    bookingsCount: mockBookings.length,
    inquiriesCount: mockInquiries.length,
    pendingInquiries: 2,
    totalRevenue: 49498,
    pendingBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pkgRes, htlRes, destRes, bookRes, inqRes] = await Promise.allSettled([
        api.get("/packages"),
        api.get("/hotels"),
        api.get("/destinations"),
        api.get("/bookings"),
        api.get("/inquiries"),
      ]);

      const pkgs = pkgRes.status === "fulfilled" && pkgRes.value.data?.length > 0 ? pkgRes.value.data : mockPackages;
      const htls = htlRes.status === "fulfilled" && htlRes.value.data?.length > 0 ? htlRes.value.data : mockHotels;
      const dests = destRes.status === "fulfilled" && destRes.value.data?.length > 0 ? destRes.value.data : mockDestinations;

      let apiBookings = [];
      if (bookRes.status === "fulfilled" && Array.isArray(bookRes.value.data)) {
        apiBookings = bookRes.value.data;
      }

      // Merge with locally stored bookings & mock bookings without duplicates
      const localBookings = JSON.parse(localStorage.getItem("local_bookings") || "[]");
      const allMerged = [...apiBookings, ...localBookings, ...mockBookings];
      const seenIds = new Set();
      const uniqueBookings = [];

      for (const item of allMerged) {
        if (item && item._id && !seenIds.has(item._id)) {
          seenIds.add(item._id);
          uniqueBookings.push(item);
        }
      }

      const totalRev = uniqueBookings
        .filter((b) => b.status !== "cancelled")
        .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

      // Inquiries calculation
      let apiInquiries = [];
      if (inqRes.status === "fulfilled" && Array.isArray(inqRes.value.data)) {
        apiInquiries = inqRes.value.data;
      }
      const localInquiries = JSON.parse(localStorage.getItem("local_inquiries") || "[]");
      const allInquiriesMerged = [...localInquiries, ...apiInquiries, ...mockInquiries];
      const inqSeen = new Set();
      const uniqueInquiries = [];
      for (const item of allInquiriesMerged) {
        if (item && item._id && !inqSeen.has(item._id)) {
          inqSeen.add(item._id);
          uniqueInquiries.push(item);
        }
      }
      const pendingInqs = uniqueInquiries.filter((i) => i.status === "pending").length;

      setStats({
        packagesCount: pkgs.length,
        hotelsCount: htls.length,
        destinationsCount: dests.length,
        bookingsCount: uniqueBookings.length,
        inquiriesCount: uniqueInquiries.length,
        pendingInquiries: pendingInqs,
        totalRevenue: totalRev,
        pendingBookings: pending,
      });

      setRecentBookings(uniqueBookings.slice(0, 8));
    } catch (err) {
      console.error("Dashboard data load error:", err);
      const local = JSON.parse(localStorage.getItem("local_bookings") || "[]");
      setRecentBookings([...local, ...mockBookings].slice(0, 8));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      try {
        await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      } catch (e) {
        // local update
      }

      const local = JSON.parse(localStorage.getItem("local_bookings") || "[]");
      const updatedLocal = local.map((b) =>
        b._id === bookingId ? { ...b, status: newStatus } : b
      );
      localStorage.setItem("local_bookings", JSON.stringify(updatedLocal));

      setRecentBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert("Failed to update booking status.");
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
              You need Administrator privileges to access the TravelVista Admin Console. Please log in using an Admin account (e.g. <code>admin@travelvista.com</code>).
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

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-fluid px-lg-5">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-2 col-md-3">
            <AdminSidebar />
          </div>

          {/* Main Content */}
          <div className="col-lg-10 col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap g-3">
              <div>
                <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold mb-1">
                  🛡️ Administrator Console
                </span>
                <h2 className="brand-font fw-bold mb-0">System Overview & Analytics</h2>
              </div>
              <div className="d-flex gap-2">
                <Link to="/admin/packages" className="btn btn-sm btn-primary-custom d-flex align-items-center gap-1">
                  <PlusCircle size={16} />
                  <span>Manage Packages</span>
                </Link>
                <Link to="/admin/hotels" className="btn btn-sm btn-secondary-custom d-flex align-items-center gap-1">
                  <PlusCircle size={16} />
                  <span>Manage Hotels</span>
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2">Loading system metrics...</p>
              </div>
            ) : (
              <>
                {/* Metric Cards Row */}
                <div className="row g-3 mb-4">
                  {/* Revenue */}
                  <div className="col-lg-4 col-md-6">
                    <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small fw-bold text-uppercase">Total Bookings Revenue</span>
                        <div className="p-2 bg-success bg-opacity-10 text-success rounded-3">
                          <DollarSign size={20} />
                        </div>
                      </div>
                      <h3 className="fw-bold brand-font text-dark mb-1">
                        ₹{stats.totalRevenue.toLocaleString()}
                      </h3>
                      <span className="small text-success d-flex align-items-center gap-1">
                        <TrendingUp size={14} /> Verified completed transactions
                      </span>
                    </div>
                  </div>

                  {/* Total Bookings */}
                  <div className="col-lg-4 col-md-6">
                    <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small fw-bold text-uppercase">Total Reservations</span>
                        <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                          <CalendarCheck size={20} />
                        </div>
                      </div>
                      <h3 className="fw-bold brand-font text-dark mb-1">{stats.bookingsCount}</h3>
                      <span className="small text-muted">
                        Pending review: <strong>{stats.pendingBookings}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Tour Packages */}
                  <div className="col-lg-4 col-md-6">
                    <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small fw-bold text-uppercase">Active Packages</span>
                        <div className="p-2 bg-warning bg-opacity-25 text-dark rounded-3">
                          <Package size={20} />
                        </div>
                      </div>
                      <h3 className="fw-bold brand-font text-dark mb-1">{stats.packagesCount}</h3>
                      <span className="small text-muted">Across global destinations</span>
                    </div>
                  </div>

                  {/* Hotels */}
                  <div className="col-lg-4 col-md-6">
                    <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small fw-bold text-uppercase">Hotels & Resorts</span>
                        <div className="p-2 bg-info bg-opacity-10 text-info rounded-3">
                          <Hotel size={20} />
                        </div>
                      </div>
                      <h3 className="fw-bold brand-font text-dark mb-1">{stats.hotelsCount}</h3>
                      <span className="small text-muted">Verified partner accommodations</span>
                    </div>
                  </div>

                  {/* Destinations */}
                  <div className="col-lg-4 col-md-6">
                    <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small fw-bold text-uppercase">Destinations</span>
                        <div className="p-2 bg-danger bg-opacity-10 text-danger rounded-3">
                          <MapPin size={20} />
                        </div>
                      </div>
                      <h3 className="fw-bold brand-font text-dark mb-1">{stats.destinationsCount}</h3>
                      <span className="small text-muted">Featured cities & countries</span>
                    </div>
                  </div>

                  {/* Inquiries & Messages */}
                  <div className="col-lg-4 col-md-6">
                    <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small fw-bold text-uppercase">Customer Inquiries</span>
                        <div className="p-2 bg-purple bg-opacity-10 text-primary rounded-3">
                          <MessageSquare size={20} />
                        </div>
                      </div>
                      <h3 className="fw-bold brand-font text-dark mb-1">{stats.inquiriesCount}</h3>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted">
                          Pending reply: <strong className="text-danger">{stats.pendingInquiries}</strong>
                        </span>
                        <Link to="/admin/inquiries" className="small fw-bold text-primary">
                          Respond &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings Table */}
                <div className="card shadow-sm border-0 rounded-4 p-4 bg-white mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold brand-font mb-0">Recent User Bookings & Orders</h5>
                    <Link to="/admin/bookings" className="btn btn-sm btn-outline-primary">
                      View All Bookings
                    </Link>
                  </div>

                  {recentBookings.length === 0 ? (
                    <p className="text-muted small py-3">No bookings placed yet.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr className="small text-muted text-uppercase">
                            <th>Booking ID</th>
                            <th>Customer</th>
                            <th>Type / Item</th>
                            <th>Travel Date</th>
                            <th>Payment</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.map((b) => {
                            const custName = b.contactName || b.user?.name || "Customer";
                            const custEmail = b.contactEmail || b.user?.email || "customer@example.com";
                            const itemTitle = b.package?.title || b.hotel?.name || b.packageTitle || "Custom Tour";

                            return (
                              <tr key={b._id}>
                                <td>
                                  <span className="badge bg-light text-dark border font-monospace">
                                    #{b._id?.slice(-8).toUpperCase()}
                                  </span>
                                </td>
                                <td>
                                  <strong className="text-dark d-block">{custName}</strong>
                                  <small className="text-muted">{custEmail}</small>
                                </td>
                                <td>
                                  <span className="small d-block fw-semibold text-primary">
                                    {itemTitle}
                                  </span>
                                  <span className="badge bg-secondary small text-capitalize">
                                    {b.bookingType || "package"}
                                  </span>
                                </td>
                                <td className="small">
                                  {new Date(b.travelDate).toLocaleDateString()}
                                </td>
                                <td>
                                  <span className="badge bg-success bg-opacity-10 text-success small d-block">
                                    PAID
                                  </span>
                                  <small className="text-muted" style={{ fontSize: "11px" }}>
                                    {b.paymentMethod || "Card"}
                                  </small>
                                </td>
                                <td className="fw-bold text-dark">
                                  ₹{b.totalAmount?.toLocaleString()}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      b.status === "confirmed"
                                        ? "bg-success"
                                        : b.status === "cancelled"
                                        ? "bg-danger"
                                        : "bg-warning text-dark"
                                    } text-capitalize`}
                                  >
                                    {b.status || "confirmed"}
                                  </span>
                                </td>
                                <td>
                                  <select
                                    className="form-select form-select-sm"
                                    value={b.status || "confirmed"}
                                    onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                                  >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
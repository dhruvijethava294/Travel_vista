// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: AdminHotels.jsx
// Description: Admin management of Hotels & Resorts (CRUD Operations,
// Amenities, Room Categories, Pricing).
// =========================================================================

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import { mockHotels } from "../services/mockData";
import { Hotel, PlusCircle, Edit2, Trash2, Search, Star, MapPin, Lock, LogIn } from "lucide-react";

function AdminHotels() {
  const { user, isAdmin } = useContext(AuthContext);
  const [hotels, setHotels] = useState(mockHotels);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: "",
    location: "",
    city: "",
    pricePerNight: "",
    rating: 4.5,
    roomType: "Deluxe Room",
    description: "",
    image: "",
    amenitiesStr: "Free WiFi, Infinity Pool, Spa, Free Breakfast, AC",
    contactPhone: "+91 98765 43210",
    contactEmail: "reservations@travelvista.com",
    address: "",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    reviewsCount: 24,
    totalRooms: 20,
    availableRooms: 15,
  };

  const [form, setForm] = useState(initialForm);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hotels");
      if (res.data && res.data.length > 0) {
        setHotels(res.data);
      } else {
        setHotels(mockHotels);
      }
    } catch (err) {
      setHotels(mockHotels);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchHotels();
  }, [isAdmin]);

  const handleOpenAdd = () => {
    setEditingHotelId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (h) => {
    setEditingHotelId(h._id);
    setForm({
      name: h.name || "",
      location: h.location || "",
      city: h.city || "",
      pricePerNight: h.pricePerNight || "",
      rating: h.rating || 4.5,
      roomType: h.roomType || "Deluxe Room",
      description: h.description || "",
      image: h.image || "",
      amenitiesStr: h.amenities ? h.amenities.join(", ") : "",
      contactPhone: h.contactPhone || "",
      contactEmail: h.contactEmail || "",
      address: h.address || h.location || "",
      checkInTime: h.checkInTime || "2:00 PM",
      checkOutTime: h.checkOutTime || "11:00 AM",
      cancellationPolicy: h.cancellationPolicy || "Free cancellation up to 48 hours before check-in",
      reviewsCount: h.reviewsCount != null ? h.reviewsCount : 24,
      totalRooms: h.totalRooms != null ? h.totalRooms : 20,
      availableRooms: h.availableRooms != null ? h.availableRooms : 15,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      try {
        await api.delete(`/hotels/${id}`);
      } catch (e) {
        setHotels((prev) => prev.filter((h) => h._id !== id));
      }
      fetchHotels();
    } catch (err) {
      alert("Failed to delete hotel.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const amenities = form.amenitiesStr
        ? form.amenitiesStr.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: form.name,
        location: form.location,
        city: form.city || form.location,
        pricePerNight: Number(form.pricePerNight),
        rating: Number(form.rating),
        roomType: form.roomType,
        description: form.description,
        image: form.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        images: [form.image].filter(Boolean),
        amenities,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        address: form.address || form.location,
        checkInTime: form.checkInTime,
        checkOutTime: form.checkOutTime,
        cancellationPolicy: form.cancellationPolicy,
        reviewsCount: Number(form.reviewsCount) || 24,
        totalRooms: Number(form.totalRooms) || 20,
        availableRooms: Number(form.availableRooms) || 15,
      };

      try {
        if (editingHotelId) {
          await api.put(`/hotels/${editingHotelId}`, payload);
        } else {
          await api.post("/hotels", payload);
        }
      } catch (apiErr) {
        if (editingHotelId) {
          setHotels((prev) =>
            prev.map((h) => (h._id === editingHotelId ? { ...h, ...payload } : h))
          );
        } else {
          setHotels((prev) => [{ ...payload, _id: "htl-new-" + Date.now() }, ...prev]);
        }
      }

      setIsModalOpen(false);
      fetchHotels();
    } catch (err) {
      alert("Failed to save hotel.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="card shadow-sm border-0 rounded-4 text-center p-5 max-w-700 mx-auto bg-white">
            <Lock size={48} className="text-danger mx-auto mb-3" />
            <h3 className="brand-font fw-bold text-dark mb-2">Admin Access Required</h3>
            <p className="text-muted mb-4">Please sign in as an Administrator to manage hotels & resorts.</p>
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

  const filtered = hotels.filter(
    (h) =>
      h.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-fluid px-lg-5">
        <div className="row g-4">
          <div className="col-lg-2 col-md-3">
            <AdminSidebar />
          </div>

          <div className="col-lg-10 col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap g-3">
              <div>
                <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill fw-bold mb-1">
                  🏨 Partner Accommodations (MCA Project)
                </span>
                <h2 className="brand-font fw-bold mb-0">Manage Hotels & Resorts</h2>
              </div>
              <button
                className="btn btn-primary-custom d-flex align-items-center gap-2"
                onClick={handleOpenAdd}
              >
                <PlusCircle size={18} />
                <span>Add Hotel / Resort</span>
              </button>
            </div>

            {/* Search */}
            <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Filter hotels by name or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr className="small text-muted text-uppercase">
                        <th>Image</th>
                        <th>Hotel Name & Category</th>
                        <th>Location & City</th>
                        <th>Price/Night</th>
                        <th>Timing & Policy</th>
                        <th>Rooms Left</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((h) => (
                        <tr key={h._id}>
                          <td>
                            <img
                              src={h.image}
                              alt={h.name}
                              className="rounded-3"
                              style={{ width: "65px", height: "50px", objectFit: "cover" }}
                            />
                          </td>
                          <td>
                            <strong className="text-dark d-block">{h.name}</strong>
                            <small className="badge bg-light text-secondary border">{h.roomType || "Deluxe Suite"}</small>
                          </td>
                          <td className="small">📍 {h.location} {h.city ? `(${h.city})` : ""}</td>
                          <td className="fw-bold text-primary">₹{h.pricePerNight?.toLocaleString()}</td>
                          <td>
                            <small className="d-block text-dark fw-semibold">In: {h.checkInTime || "2:00 PM"} | Out: {h.checkOutTime || "11:00 AM"}</small>
                            <small className="text-success text-truncate d-block" style={{ maxWidth: "160px" }} title={h.cancellationPolicy}>
                              {h.cancellationPolicy || "Free cancellation"}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {h.availableRooms != null ? h.availableRooms : 15} / {h.totalRooms || 20}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              ⭐ {h.rating} ({h.reviewsCount || 24})
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleOpenEdit(h)}
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(h._id)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-dark text-white py-3 px-4">
                <h5 className="modal-title brand-font text-white mb-0">
                  {editingHotelId ? "Edit Hotel Details" : "Add New Hotel / Resort"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Hotel Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Taj Exotica Resort & Spa"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Location / Area</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. South Goa"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">City</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Goa"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Price Per Night (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 12000"
                        value={form.pricePerNight}
                        onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Rating (1 to 5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        className="form-control"
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Room Category</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Ocean View Villa"
                        value={form.roomType}
                        onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Check-in Time</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 2:00 PM"
                        value={form.checkInTime}
                        onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Check-out Time</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 11:00 AM"
                        value={form.checkOutTime}
                        onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Reviews Count</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 24"
                        value={form.reviewsCount}
                        onChange={(e) => setForm({ ...form, reviewsCount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Total Rooms</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 20"
                        value={form.totalRooms}
                        onChange={(e) => setForm({ ...form, totalRooms: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Available Rooms</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 15"
                        value={form.availableRooms}
                        onChange={(e) => setForm({ ...form, availableRooms: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Cancellation Policy</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Free cancellation up to 48 hours before check-in"
                        value={form.cancellationPolicy}
                        onChange={(e) => setForm({ ...form, cancellationPolicy: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Hotel Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="e.g. reservations@hotel.com"
                        value={form.contactEmail}
                        onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Street Address / Landmark</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Near Benaulim Beach Road"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Contact Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="e.g. +91 98765 43210"
                        value={form.contactPhone}
                        onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Cover Photo URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Amenities (Comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Free WiFi, Private Beach, Infinity Pool, Spa, Multi-cuisine Restaurant"
                      value={form.amenitiesStr}
                      onChange={(e) => setForm({ ...form, amenitiesStr: e.target.value })}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Hotel description..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary-custom px-4"
                      disabled={submitting}
                    >
                      {submitting ? "Saving..." : editingHotelId ? "Update Hotel" : "Add Hotel"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHotels;

// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: AdminPackage.jsx
// Description: Admin management of Tour Packages (CRUD Operations,
// Day-by-Day Itinerary builder, linked hotels, inclusions/exclusions).
// =========================================================================

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import { mockPackages, mockHotels } from "../services/mockData";
import {
  Package,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Sparkles,
  MapPin,
  Clock,
  Lock,
  LogIn,
} from "lucide-react";

function AdminPackage() {
  const { user, isAdmin } = useContext(AuthContext);
  const [packages, setPackages] = useState(mockPackages);
  const [hotels, setHotels] = useState(mockHotels);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    title: "",
    destination: "",
    category: "Family",
    duration: "4 Days / 3 Nights",
    price: "",
    description: "",
    image: "",
    placesToVisitStr: "",
    includedStr: "",
    excludedStr: "",
    videoUrl: "",
    includedHotels: [],
    itinerary: [
      { day: 1, title: "Arrival & Sightseeing", activities: "Hotel check-in and evening city walk.", meals: "Dinner" },
      { day: 2, title: "Full Day Guided Tour", activities: "Exploring key monuments and cultural places.", meals: "Breakfast & Dinner" },
    ],
  };

  const [form, setForm] = useState(initialFormState);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const [pkgRes, htlRes] = await Promise.allSettled([api.get("/packages"), api.get("/hotels")]);
      if (pkgRes.status === "fulfilled" && pkgRes.value.data?.length > 0) {
        setPackages(pkgRes.value.data);
      } else {
        setPackages(mockPackages);
      }
      if (htlRes.status === "fulfilled" && htlRes.value.data?.length > 0) {
        setHotels(htlRes.value.data);
      } else {
        setHotels(mockHotels);
      }
    } catch (err) {
      setPackages(mockPackages);
      setHotels(mockHotels);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchPackages();
  }, [isAdmin]);

  const handleOpenAddModal = () => {
    setEditingPackageId(null);
    setForm(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg) => {
    setEditingPackageId(pkg._id);
    setForm({
      title: pkg.title || "",
      destination: pkg.destination || "",
      category: pkg.category || "Family",
      duration: pkg.duration || "4 Days / 3 Nights",
      price: pkg.price || "",
      description: pkg.description || "",
      image: pkg.image || "",
      placesToVisitStr: pkg.placesToVisit ? pkg.placesToVisit.join(", ") : "",
      includedStr: pkg.included ? pkg.included.join("\n") : "",
      excludedStr: pkg.excluded ? pkg.excluded.join("\n") : "",
      videoUrl: pkg.videos && pkg.videos.length > 0 ? pkg.videos[0] : "",
      includedHotels: pkg.includedHotels ? pkg.includedHotels.map((h) => (typeof h === "object" ? h._id : h)) : [],
      itinerary: pkg.itinerary && pkg.itinerary.length > 0 ? pkg.itinerary : initialFormState.itinerary,
    });
    setIsModalOpen(true);
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this tour package?")) return;
    try {
      try {
        await api.delete(`/packages/${id}`);
      } catch (e) {
        setPackages((prev) => prev.filter((p) => p._id !== id));
      }
      fetchPackages();
    } catch (err) {
      alert("Failed to delete package.");
    }
  };

  const handleItineraryChange = (index, field, value) => {
    const updated = [...form.itinerary];
    updated[index][field] = value;
    setForm({ ...form, itinerary: updated });
  };

  const handleAddItineraryDay = () => {
    setForm({
      ...form,
      itinerary: [
        ...form.itinerary,
        {
          day: form.itinerary.length + 1,
          title: "Day Exploration",
          activities: "Sightseeing and leisure activities.",
          meals: "Breakfast Included",
        },
      ],
    });
  };

  const handleRemoveItineraryDay = (index) => {
    const filtered = form.itinerary.filter((_, i) => i !== index);
    const reindexed = filtered.map((item, i) => ({ ...item, day: i + 1 }));
    setForm({ ...form, itinerary: reindexed });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const places = form.placesToVisitStr
        ? form.placesToVisitStr.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const inc = form.includedStr
        ? form.includedStr.split("\n").map((s) => s.trim()).filter(Boolean)
        : [];
      const exc = form.excludedStr
        ? form.excludedStr.split("\n").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        title: form.title,
        destination: form.destination,
        category: form.category,
        duration: form.duration,
        price: Number(form.price),
        description: form.description,
        image: form.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        images: [form.image].filter(Boolean),
        videos: form.videoUrl ? [form.videoUrl] : [],
        placesToVisit: places,
        included: inc,
        excluded: exc,
        includedHotels: form.includedHotels,
        itinerary: form.itinerary,
      };

      try {
        if (editingPackageId) {
          await api.put(`/packages/${editingPackageId}`, payload);
        } else {
          await api.post("/packages", payload);
        }
      } catch (apiErr) {
        if (editingPackageId) {
          setPackages((prev) =>
            prev.map((p) => (p._id === editingPackageId ? { ...p, ...payload } : p))
          );
        } else {
          setPackages((prev) => [{ ...payload, _id: "pkg-new-" + Date.now() }, ...prev]);
        }
      }

      setIsModalOpen(false);
      fetchPackages();
    } catch (err) {
      alert("Failed to save tour package.");
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
            <p className="text-muted mb-4">Please sign in as an Administrator to manage tour packages.</p>
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

  const filteredPackages = packages.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.destination?.toLowerCase().includes(search.toLowerCase())
  );

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
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-1">
                  📦 Tour Inventory
                </span>
                <h2 className="brand-font fw-bold mb-0">Manage Tour Packages</h2>
              </div>
              <button
                className="btn btn-primary-custom d-flex align-items-center gap-2"
                onClick={handleOpenAddModal}
              >
                <PlusCircle size={18} />
                <span>Create New Package</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Filter packages by title or destination..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Packages Table */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="text-muted mt-2">Loading packages...</p>
                </div>
              ) : filteredPackages.length === 0 ? (
                <p className="text-muted py-4 text-center">No packages found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr className="small text-muted text-uppercase">
                        <th>Image</th>
                        <th>Title & Category</th>
                        <th>Destination</th>
                        <th>Duration</th>
                        <th>Price (₹)</th>
                        <th>Hotels</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPackages.map((pkg) => (
                        <tr key={pkg._id}>
                          <td>
                            <img
                              src={pkg.image}
                              alt={pkg.title}
                              className="rounded-3"
                              style={{ width: "65px", height: "50px", objectFit: "cover" }}
                            />
                          </td>
                          <td>
                            <strong className="text-dark d-block">{pkg.title}</strong>
                            <span className="badge bg-secondary small">{pkg.category}</span>
                          </td>
                          <td>📍 {pkg.destination}</td>
                          <td className="small">{pkg.duration}</td>
                          <td className="fw-bold text-primary">₹{pkg.price?.toLocaleString()}</td>
                          <td>
                            <span className="badge bg-info bg-opacity-10 text-primary">
                              {pkg.includedHotels?.length || 0} Linked
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleOpenEditModal(pkg)}
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeletePackage(pkg._id)}
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

      {/* Add / Edit Package Modal */}
      {isModalOpen && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-dark text-white py-3 px-4">
                <h5 className="modal-title brand-font text-white mb-0">
                  {editingPackageId ? "Edit Tour Package" : "Create New Tour Package"}
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
                      <label className="form-label small fw-bold">Package Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Goa Beach & Watersports Blast"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Destination</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Goa"
                        value={form.destination}
                        onChange={(e) => setForm({ ...form, destination: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Category</label>
                      <select
                        className="form-select"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="Beach">Beach</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Honeymoon">Honeymoon</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Heritage">Heritage</option>
                        <option value="Family">Family</option>
                        <option value="Wildlife">Wildlife</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Duration</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 5 Days / 4 Nights"
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Price Per Person (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 19999"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Cover Photo URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Detailed Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Comprehensive package overview..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Places to Visit (Comma-separated)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Baga Beach, Fort Aguada, Dudhsagar Falls"
                        value={form.placesToVisitStr}
                        onChange={(e) => setForm({ ...form, placesToVisitStr: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Video Tour Embed URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://www.youtube.com/embed/..."
                        value={form.videoUrl}
                        onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Included Hotels Checkboxes */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold d-block">
                      Link Verified Hotels & Resorts
                    </label>
                    <div className="d-flex flex-wrap gap-2">
                      {hotels.map((h) => {
                        const isChecked = form.includedHotels.includes(h._id);
                        return (
                          <button
                            type="button"
                            key={h._id}
                            className={`btn btn-sm ${
                              isChecked ? "btn-primary text-white" : "btn-outline-secondary"
                            } rounded-pill`}
                            onClick={() => {
                              if (isChecked) {
                                setForm({
                                  ...form,
                                  includedHotels: form.includedHotels.filter((id) => id !== h._id),
                                });
                              } else {
                                setForm({
                                  ...form,
                                  includedHotels: [...form.includedHotels, h._id],
                                });
                              }
                            }}
                          >
                            {isChecked ? "✓ " : "+ "}
                            {h.name} ({h.location})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inclusions & Exclusions */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-success">
                        Inclusions (One per line)
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="3 Nights Resort Accommodation&#10;Daily Breakfast&#10;Airport Transfers"
                        value={form.includedStr}
                        onChange={(e) => setForm({ ...form, includedStr: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-danger">
                        Exclusions (One per line)
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Flight Tickets&#10;Personal Expenses&#10;Optional Scuba Diving"
                        value={form.excludedStr}
                        onChange={(e) => setForm({ ...form, excludedStr: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  {/* Day-by-Day Itinerary Builder */}
                  <div className="border rounded-3 p-3 bg-light mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold brand-font mb-0">
                        Day-by-Day Itinerary Schedule ({form.itinerary.length} Days)
                      </h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                        onClick={handleAddItineraryDay}
                      >
                        <PlusCircle size={14} /> Add Day
                      </button>
                    </div>

                    {form.itinerary.map((dayItem, index) => (
                      <div key={index} className="card p-3 mb-2 bg-white border">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong className="text-primary small">Day {dayItem.day}</strong>
                          {form.itinerary.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger p-0"
                              onClick={() => handleRemoveItineraryDay(index)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="row g-2 mb-2">
                          <div className="col-md-8">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Day Title e.g. North Goa Sightseeing"
                              value={dayItem.title}
                              onChange={(e) => handleItineraryChange(index, "title", e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Meals Included e.g. Breakfast & Dinner"
                              value={dayItem.meals}
                              onChange={(e) => handleItineraryChange(index, "meals", e.target.value)}
                            />
                          </div>
                        </div>
                        <textarea
                          className="form-control form-control-sm"
                          rows="2"
                          placeholder="Activity description for the day..."
                          value={dayItem.activities}
                          onChange={(e) => handleItineraryChange(index, "activities", e.target.value)}
                          required
                        ></textarea>
                      </div>
                    ))}
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
                      {submitting ? "Saving..." : editingPackageId ? "Update Package" : "Create Package"}
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

export default AdminPackage;
// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: AdminDestinations.jsx
// Description: Admin management of Destinations (CRUD Operations,
// Highlights, Season Info, Cover Photos).
// =========================================================================

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import { mockDestinations } from "../services/mockData";
import { MapPin, PlusCircle, Edit2, Trash2, Search, Calendar, Video, Lock, LogIn } from "lucide-react";

function AdminDestinations() {
  const { user, isAdmin } = useContext(AuthContext);
  const [destinations, setDestinations] = useState(mockDestinations);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestId, setEditingDestId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: "",
    country: "",
    description: "",
    image: "",
    bestTimeToVisit: "October to March",
    highlightsStr: "Beaches, Sightseeing, Watersports",
    videoUrl: "",
  };

  const [form, setForm] = useState(initialForm);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/destinations");
      if (res.data && res.data.length > 0) {
        setDestinations(res.data);
      } else {
        setDestinations(mockDestinations);
      }
    } catch (err) {
      setDestinations(mockDestinations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchDestinations();
  }, [isAdmin]);

  const handleOpenAdd = () => {
    setEditingDestId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d) => {
    setEditingDestId(d._id);
    setForm({
      name: d.name || "",
      country: d.country || "",
      description: d.description || "",
      image: d.image || "",
      bestTimeToVisit: d.bestTimeToVisit || "October to March",
      highlightsStr: d.highlights ? d.highlights.join(", ") : "",
      videoUrl: d.videoUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      try {
        await api.delete(`/destinations/${id}`);
      } catch (e) {
        setDestinations((prev) => prev.filter((d) => d._id !== id));
      }
      fetchDestinations();
    } catch (err) {
      alert("Failed to delete destination.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const highlights = form.highlightsStr
        ? form.highlightsStr.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: form.name,
        country: form.country,
        description: form.description,
        image: form.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        bestTimeToVisit: form.bestTimeToVisit,
        highlights,
        videoUrl: form.videoUrl,
      };

      try {
        if (editingDestId) {
          await api.put(`/destinations/${editingDestId}`, payload);
        } else {
          await api.post("/destinations", payload);
        }
      } catch (apiErr) {
        if (editingDestId) {
          setDestinations((prev) =>
            prev.map((d) => (d._id === editingDestId ? { ...d, ...payload } : d))
          );
        } else {
          setDestinations((prev) => [{ ...payload, _id: "dest-new-" + Date.now() }, ...prev]);
        }
      }

      setIsModalOpen(false);
      fetchDestinations();
    } catch (err) {
      alert("Failed to save destination.");
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
            <p className="text-muted mb-4">Please sign in as an Administrator to manage destinations.</p>
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

  const filtered = destinations.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.country?.toLowerCase().includes(search.toLowerCase())
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
                <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold mb-1">
                  🌍 Global Locations (MCA Project)
                </span>
                <h2 className="brand-font fw-bold mb-0">Manage Destinations</h2>
              </div>
              <button
                className="btn btn-primary-custom d-flex align-items-center gap-2"
                onClick={handleOpenAdd}
              >
                <PlusCircle size={18} />
                <span>Add Destination</span>
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
                  placeholder="Filter destinations by city or country..."
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
                        <th>Name</th>
                        <th>Country</th>
                        <th>Best Season</th>
                        <th>Highlights</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((d) => (
                        <tr key={d._id}>
                          <td>
                            <img
                              src={d.image}
                              alt={d.name}
                              className="rounded-3"
                              style={{ width: "65px", height: "50px", objectFit: "cover" }}
                            />
                          </td>
                          <td className="fw-bold text-dark">{d.name}</td>
                          <td>📍 {d.country}</td>
                          <td className="small">{d.bestTimeToVisit}</td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {d.highlights?.length || 0} Highlights
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleOpenEdit(d)}
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(d._id)}
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
                  {editingDestId ? "Edit Destination" : "Add New Destination"}
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
                      <label className="form-label small fw-bold">Destination City / Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Goa"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. India"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Best Season to Visit</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. October to March"
                        value={form.bestTimeToVisit}
                        onChange={(e) => setForm({ ...form, bestTimeToVisit: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
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
                    <label className="form-label small fw-bold">Highlights (Comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Baga Beach, Fort Aguada, Mandovi Cruise"
                      value={form.highlightsStr}
                      onChange={(e) => setForm({ ...form, highlightsStr: e.target.value })}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">Overview / Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Destination description..."
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
                      {submitting ? "Saving..." : editingDestId ? "Update Destination" : "Add Destination"}
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

export default AdminDestinations;

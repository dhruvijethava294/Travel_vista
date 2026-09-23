// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: AdminMedia.jsx
// Description: Admin management of Gallery Photos and Virtual Video Tours
// (Upload media links, filter by type, delete media).
// =========================================================================

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import { mockGalleryItems } from "../services/mockData";
import { Image, Video, PlusCircle, Trash2, Search, Lock, LogIn } from "lucide-react";

function AdminMedia() {
  const { user, isAdmin } = useContext(AuthContext);
  const [items, setItems] = useState(mockGalleryItems);
  const [loading, setLoading] = useState(true);
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: "",
    category: "Beaches",
    mediaType: "image",
    url: "",
    destination: "Goa",
    description: "",
  };

  const [form, setForm] = useState(initialForm);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await api.get("/gallery");
      if (res.data && res.data.length > 0) {
        setItems(res.data);
      } else {
        setItems(mockGalleryItems);
      }
    } catch (err) {
      setItems(mockGalleryItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchMedia();
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media item?")) return;
    try {
      try {
        await api.delete(`/gallery/${id}`);
      } catch (e) {
        setItems((prev) => prev.filter((i) => i._id !== id));
      }
      fetchMedia();
    } catch (err) {
      alert("Failed to delete media item.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      try {
        await api.post("/gallery", form);
      } catch (e) {
        setItems((prev) => [{ ...form, _id: "med-" + Date.now() }, ...prev]);
      }
      setIsModalOpen(false);
      setForm(initialForm);
      fetchMedia();
    } catch (err) {
      alert("Failed to upload/create media item.");
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
            <p className="text-muted mb-4">Please sign in as an Administrator to manage photo & video gallery items.</p>
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

  const filtered = items.filter((item) => {
    if (mediaTypeFilter === "all") return true;
    return item.mediaType === mediaTypeFilter;
  });

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
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-1">
                  📸 Media Gallery (MCA Project)
                </span>
                <h2 className="brand-font fw-bold mb-0">Manage Photos & Videos</h2>
              </div>
              <button
                className="btn btn-primary-custom d-flex align-items-center gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusCircle size={18} />
                <span>Upload New Media</span>
              </button>
            </div>

            {/* Filter */}
            <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
              <div className="d-flex gap-2">
                {["all", "image", "video"].map((type) => (
                  <button
                    key={type}
                    className={`btn btn-sm ${
                      mediaTypeFilter === type ? "btn-dark text-white fw-bold" : "btn-outline-secondary"
                    } rounded-pill px-4 text-capitalize`}
                    onClick={() => setMediaTypeFilter(type)}
                  >
                    {type === "all" ? "All Media" : type === "image" ? "Photos Only" : "Videos Only"}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-muted py-4 text-center">No media found.</p>
              ) : (
                <div className="row g-3">
                  {filtered.map((item) => (
                    <div className="col-lg-3 col-md-4 col-sm-6" key={item._id}>
                      <div className="card h-100 border rounded-3 overflow-hidden shadow-sm">
                        <div style={{ height: "160px", overflow: "hidden" }}>
                          {item.mediaType === "video" ? (
                            <div className="ratio ratio-16x9 h-100">
                              <iframe src={item.url} title={item.title} allowFullScreen></iframe>
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                            />
                          )}
                        </div>
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="badge bg-secondary small">{item.category}</span>
                            <span className="badge bg-light text-dark border small text-capitalize">
                              {item.mediaType}
                            </span>
                          </div>
                          <h6 className="fw-bold mb-1 text-truncate" title={item.title}>
                            {item.title}
                          </h6>
                          <small className="text-muted d-block mb-2">📍 {item.destination}</small>
                          <button
                            className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-1"
                            onClick={() => handleDelete(item._id)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-dark text-white py-3 px-4">
                <h5 className="modal-title brand-font text-white mb-0">Add Media Item</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Title / Caption</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sunset in Baga Beach"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Media Type</label>
                      <select
                        className="form-select"
                        value={form.mediaType}
                        onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                      >
                        <option value="image">Photo / Image</option>
                        <option value="video">Embedded Video</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Category</label>
                      <select
                        className="form-select"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="Beaches">Beaches</option>
                        <option value="Mountains">Mountains</option>
                        <option value="Heritage">Heritage</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Wildlife">Wildlife</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Destination / Location Tag</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Goa, India"
                      value={form.destination}
                      onChange={(e) => setForm({ ...form, destination: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">Media URL (Photo URL or YouTube Embed)</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/... or https://www.youtube.com/embed/..."
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      required
                    />
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
                      {submitting ? "Uploading..." : "Save Media"}
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

export default AdminMedia;

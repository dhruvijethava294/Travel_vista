// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: Profile.jsx
// Description: User profile management (update name, phone, avatar, password).
// =========================================================================

import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { User, Mail, Phone, Shield, Save, CheckCircle2, Lock, Sparkles, LogIn } from "lucide-react";

function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setProfileImage(user.profileImage || "");
    }

    const fetchBookingStats = async () => {
      try {
        const res = await api.get("/bookings/my-bookings");
        setBookingsCount(res.data.length);
      } catch (e) {
        const local = JSON.parse(localStorage.getItem("local_bookings") || "[]");
        setBookingsCount(local.length);
      }
    };
    if (user) fetchBookingStats();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const payload = { name, phone, profileImage };
      if (password) payload.password = password;

      try {
        const res = await api.put("/auth/profile", payload);
        updateUser(res.data.user);
      } catch (apiErr) {
        // Fallback local update
        updateUser({ name, phone, profileImage });
      }

      setSuccessMsg("Profile updated successfully!");
      setPassword("");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="card shadow-sm border-0 rounded-4 text-center p-5 max-w-700 mx-auto bg-white">
            <Lock size={48} className="text-warning mx-auto mb-3" />
            <h3 className="brand-font fw-bold text-dark mb-2">Login Required</h3>
            <p className="text-muted mb-4">Please log in to view and edit your profile.</p>
            <div>
              <Link to="/login" className="btn btn-primary-custom px-4 d-inline-flex align-items-center gap-2">
                <LogIn size={18} /> <span>Sign In / Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
              {/* Header profile info */}
              <div className="d-flex align-items-center gap-4 border-bottom pb-4 mb-4 flex-wrap">
                <img
                  src={
                    profileImage ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                  }
                  alt={user?.name}
                  className="rounded-circle shadow-sm"
                  style={{ width: "90px", height: "90px", objectFit: "cover" }}
                />
                <div>
                  <h3 className="brand-font fw-bold mb-1">{user?.name}</h3>
                  <p className="text-muted small mb-2">{user?.email}</p>
                  <div className="d-flex gap-2">
                    <span className="badge bg-primary text-capitalize">
                      Role: {user?.role || "user"}
                    </span>
                    <span className="badge bg-success bg-opacity-10 text-success">
                      {bookingsCount} Total Bookings
                    </span>
                  </div>
                </div>
              </div>

              {successMsg && (
                <div className="alert alert-success d-flex align-items-center gap-2 py-2 small mb-4">
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="alert alert-danger py-2 small mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleUpdate}>
                <h5 className="fw-bold brand-font mb-3">Edit Profile Details</h5>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <User size={16} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Email Address (Read-Only)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <Mail size={16} className="text-muted" />
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 bg-light"
                        value={user?.email || ""}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <Phone size={16} className="text-muted" />
                      </span>
                      <input
                        type="tel"
                        className="form-control border-start-0"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Profile Avatar URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-top pt-3 mb-4">
                  <h6 className="fw-bold mb-2">Change Password (Leave blank to keep unchanged)</h6>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Lock size={16} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      placeholder="New password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom d-flex align-items-center gap-2 px-4"
                  disabled={loading}
                >
                  <Save size={18} />
                  <span>{loading ? "Saving Changes..." : "Save Profile"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
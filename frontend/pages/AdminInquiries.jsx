// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: AdminInquiries.jsx
// Description: Admin management of customer contact inquiries and messages.
// Admin views user queries, provides official responses/quotes,
// and marks inquiry status as responded.
// =========================================================================

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import { mockInquiries } from "../services/mockData";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Mail,
  Phone,
  User,
  AlertCircle,
  HelpCircle,
  Lock,
  LogIn,
  Eye,
  Edit3,
} from "lucide-react";

function AdminInquiries() {
  const { user, isAdmin } = useContext(AuthContext);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Response Modal State
  const [activeInquiry, setActiveInquiry] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [responseSuccessMsg, setResponseSuccessMsg] = useState("");

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      let apiInquiries = [];

      try {
        const res = await api.get("/inquiries");
        if (Array.isArray(res.data)) {
          apiInquiries = res.data;
        }
      } catch (e) {
        // Fallback
      }

      const local = JSON.parse(localStorage.getItem("local_inquiries") || "[]");
      const combined = [...local, ...apiInquiries, ...mockInquiries];

      // Remove duplicates by _id
      const seen = new Set();
      const unique = [];
      for (const item of combined) {
        if (item && item._id && !seen.has(item._id)) {
          seen.add(item._id);
          unique.push(item);
        }
      }

      setInquiries(unique);
    } catch (err) {
      const local = JSON.parse(localStorage.getItem("local_inquiries") || "[]");
      setInquiries([...local, ...mockInquiries]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchInquiries();
  }, [isAdmin]);

  const handleOpenResponseModal = (inq) => {
    setActiveInquiry(inq);
    setResponseMessage(inq.adminResponse || "");
    setResponseSuccessMsg("");
  };

  const handleApplyTemplate = (text) => {
    setResponseMessage(text);
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseMessage.trim()) return;

    try {
      setSubmittingResponse(true);

      const updatedData = {
        adminResponse: responseMessage.trim(),
        status: "responded",
        respondedAt: new Date().toISOString(),
      };

      try {
        await api.put(`/inquiries/${activeInquiry._id}/response`, {
          adminResponse: responseMessage.trim(),
        });
      } catch (err) {
        // Fallback local update
      }

      // Update in localStorage
      const local = JSON.parse(localStorage.getItem("local_inquiries") || "[]");
      const updatedLocal = local.map((inq) =>
        inq._id === activeInquiry._id ? { ...inq, ...updatedData } : inq
      );
      // If not present in local, add it
      if (!local.find((inq) => inq._id === activeInquiry._id)) {
        updatedLocal.unshift({ ...activeInquiry, ...updatedData });
      }
      localStorage.setItem("local_inquiries", JSON.stringify(updatedLocal));

      // Update state
      setInquiries((prev) =>
        prev.map((inq) =>
          inq._id === activeInquiry._id ? { ...inq, ...updatedData } : inq
        )
      );

      setResponseSuccessMsg("Response has been recorded and sent to customer!");
      setTimeout(() => {
        setActiveInquiry(null);
        setResponseSuccessMsg("");
      }, 1200);
    } catch (err) {
      alert("Failed to submit response.");
    } finally {
      setSubmittingResponse(false);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer inquiry?")) return;

    try {
      try {
        await api.delete(`/inquiries/${id}`);
      } catch (e) {
        // Offline
      }

      const local = JSON.parse(localStorage.getItem("local_inquiries") || "[]");
      const updatedLocal = local.filter((inq) => inq._id !== id);
      localStorage.setItem("local_inquiries", JSON.stringify(updatedLocal));

      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
    } catch (err) {
      alert("Failed to delete inquiry.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="card shadow-sm border-0 rounded-4 text-center p-5 max-w-700 mx-auto bg-white">
            <Lock size={48} className="text-danger mx-auto mb-3" />
            <h3 className="brand-font fw-bold text-dark mb-2">Admin Access Required</h3>
            <p className="text-muted mb-4">
              Please sign in as an Administrator to view and respond to customer inquiries.
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

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name?.toLowerCase().includes(search.toLowerCase()) ||
      inq.email?.toLowerCase().includes(search.toLowerCase()) ||
      inq.subject?.toLowerCase().includes(search.toLowerCase()) ||
      inq.message?.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "pending") return matchesSearch && inq.status === "pending";
    if (filterStatus === "responded") return matchesSearch && inq.status === "responded";
    return matchesSearch;
  });

  const pendingCount = inquiries.filter((i) => i.status === "pending").length;
  const respondedCount = inquiries.filter((i) => i.status === "responded").length;

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
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap g-3">
              <div>
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-1">
                  💬 Customer Inquiries Desk
                </span>
                <h2 className="brand-font fw-bold mb-0">Customer Inquiries & Responses</h2>
              </div>
              <div className="d-flex gap-2">
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-semibold">
                  ⏳ {pendingCount} Pending Response
                </span>
                <span className="badge bg-success text-white px-3 py-2 rounded-pill fw-semibold">
                  ✓ {respondedCount} Responded
                </span>
              </div>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
              <div className="row g-3 align-items-center">
                <div className="col-md-7">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Search size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search inquiries by customer name, email, subject, or message..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-5 d-flex justify-content-md-end gap-2">
                  <button
                    className={`btn btn-sm ${
                      filterStatus === "all" ? "btn-dark" : "btn-outline-secondary"
                    }`}
                    onClick={() => setFilterStatus("all")}
                  >
                    All ({inquiries.length})
                  </button>
                  <button
                    className={`btn btn-sm ${
                      filterStatus === "pending" ? "btn-warning text-dark" : "btn-outline-warning text-dark"
                    }`}
                    onClick={() => setFilterStatus("pending")}
                  >
                    Pending ({pendingCount})
                  </button>
                  <button
                    className={`btn btn-sm ${
                      filterStatus === "responded" ? "btn-success" : "btn-outline-success"
                    }`}
                    onClick={() => setFilterStatus("responded")}
                  >
                    Responded ({respondedCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Inquiries List */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2">Loading customer inquiries...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="card shadow-sm border-0 rounded-4 p-5 text-center bg-white">
                <HelpCircle size={48} className="text-muted mx-auto mb-3 opacity-50" />
                <h5 className="fw-bold text-dark">No inquiries found</h5>
                <p className="text-muted small">
                  {search
                    ? "No inquiries matching your search criteria."
                    : "No customer contact requests submitted yet."}
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {filteredInquiries.map((inq) => {
                  const isResponded = inq.status === "responded";
                  return (
                    <div
                      key={inq._id}
                      className={`card shadow-sm border-0 rounded-4 p-4 bg-white transition-hover ${
                        isResponded ? "border-start border-success border-4" : "border-start border-warning border-4"
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <h5 className="fw-bold text-dark mb-0">{inq.subject}</h5>
                            <span
                              className={`badge ${
                                isResponded ? "bg-success bg-opacity-10 text-success" : "bg-warning bg-opacity-25 text-dark"
                              } fw-bold`}
                            >
                              {isResponded ? "✓ Responded" : "⏳ Pending Response"}
                            </span>
                          </div>
                          <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                            <span className="d-flex align-items-center gap-1">
                              <User size={14} className="text-primary" />
                              <strong className="text-dark">{inq.name}</strong>
                            </span>
                            <span>•</span>
                            <span className="d-flex align-items-center gap-1">
                              <Mail size={14} className="text-secondary" />
                              <span>{inq.email}</span>
                            </span>
                            {inq.phone && (
                              <>
                                <span>•</span>
                                <span className="d-flex align-items-center gap-1">
                                  <Phone size={14} className="text-secondary" />
                                  <span>{inq.phone}</span>
                                </span>
                              </>
                            )}
                            <span>•</span>
                            <span className="d-flex align-items-center gap-1">
                              <Clock size={14} />
                              <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            className={`btn btn-sm ${
                              isResponded ? "btn-outline-primary" : "btn-primary-custom"
                            } d-flex align-items-center gap-1`}
                            onClick={() => handleOpenResponseModal(inq)}
                          >
                            {isResponded ? <Edit3 size={15} /> : <Send size={15} />}
                            <span>{isResponded ? "Edit Response" : "Give Response"}</span>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteInquiry(inq._id)}
                            title="Delete Inquiry"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Customer Message */}
                      <div className="bg-light p-3 rounded-3 mb-3">
                        <span className="text-muted small fw-bold d-block mb-1 text-uppercase">
                          Customer Query / Requirements:
                        </span>
                        <p className="mb-0 text-dark" style={{ lineHeight: "1.6" }}>
                          {inq.message}
                        </p>
                      </div>

                      {/* Admin Response Box (If responded) */}
                      {isResponded && inq.adminResponse && (
                        <div className="bg-success bg-opacity-10 border border-success border-opacity-25 p-3 rounded-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="text-success small fw-bold d-flex align-items-center gap-1">
                              <CheckCircle2 size={15} /> Admin Official Response:
                            </span>
                            {inq.respondedAt && (
                              <span className="text-muted small" style={{ fontSize: "11px" }}>
                                Replied on {new Date(inq.respondedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="mb-0 text-dark small font-monospace" style={{ lineHeight: "1.6" }}>
                            {inq.adminResponse}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Response Modal */}
      {activeInquiry && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white py-3 px-4">
                <div className="d-flex align-items-center gap-2">
                  <MessageSquare className="text-warning" size={20} />
                  <h5 className="modal-title brand-font text-white mb-0">
                    Respond to Customer Inquiry
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setActiveInquiry(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                {responseSuccessMsg && (
                  <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-3">
                    <CheckCircle2 size={18} />
                    <span>{responseSuccessMsg}</span>
                  </div>
                )}

                {/* Inquiry Summary */}
                <div className="card bg-light border-0 p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <strong className="text-dark">{activeInquiry.subject}</strong>
                    <span className="badge bg-secondary small">{activeInquiry.email}</span>
                  </div>
                  <div className="small text-muted mb-2">
                    Customer: <strong>{activeInquiry.name}</strong> {activeInquiry.phone && `(${activeInquiry.phone})`}
                  </div>
                  <p className="small text-dark mb-0 bg-white p-2 rounded border">
                    "{activeInquiry.message}"
                  </p>
                </div>

                {/* Quick Response Templates */}
                <div className="mb-3">
                  <span className="small text-muted fw-bold d-block mb-1">
                    ⚡ Quick Response Templates (Click to fill):
                  </span>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill"
                      onClick={() =>
                        handleApplyTemplate(
                          `Hello ${activeInquiry.name}, thank you for contacting TravelVista! We have customized your tour quotation according to your preferences. Our travel specialist has sent full details to ${activeInquiry.email}.`
                        )
                      }
                    >
                      + Custom Quote Sent
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill"
                      onClick={() =>
                        handleApplyTemplate(
                          `Hello ${activeInquiry.name}, we are pleased to confirm hotel availability for your selected travel dates with complimentary airport transfer included.`
                        )
                      }
                    >
                      + Hotel Availability Confirmed
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill"
                      onClick={() =>
                        handleApplyTemplate(
                          `Hello ${activeInquiry.name}, for group and corporate bookings, our dedicated concierge team is ready to assist you. Please feel free to call our direct helpline at +91 98765 43210.`
                        )
                      }
                    >
                      + Corporate Group Support
                    </button>
                  </div>
                </div>

                {/* Response Form */}
                <form onSubmit={handleSubmitResponse}>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-dark">
                      Official Admin Response / Notes
                    </label>
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Type your official response to the customer here..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      required
                    ></textarea>
                    <small className="text-muted">
                      This response will be saved in the inquiry record and marked as responded.
                    </small>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={() => setActiveInquiry(null)}
                      disabled={submittingResponse}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary-custom px-4 d-flex align-items-center gap-2"
                      disabled={submittingResponse}
                    >
                      <Send size={16} />
                      <span>{submittingResponse ? "Submitting..." : "Send Response"}</span>
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

export default AdminInquiries;

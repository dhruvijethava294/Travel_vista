import { useState, useContext, useEffect } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, HelpCircle, AlertCircle } from "lucide-react";

function Contact() {
  const { user } = useContext(AuthContext);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    const newInquiry = {
      _id: "inq-" + Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      subject: formData.subject,
      message: formData.message,
      status: "pending",
      adminResponse: "",
      respondedAt: null,
      createdAt: new Date().toISOString(),
    };

    try {
      await api.post("/inquiries", formData);
    } catch (err) {
      console.log("Inquiry offline simulation mode");
    }

    // Always persist to local_inquiries so Admin Console sees it immediately
    const existing = JSON.parse(localStorage.getItem("local_inquiries") || "[]");
    localStorage.setItem("local_inquiries", JSON.stringify([newInquiry, ...existing]));

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-2">
            💬 24/7 Assistance
          </span>
          <h1 className="brand-font fw-bold">Get in Touch with TravelVista</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Have questions regarding holiday packages, custom tour itineraries, hotel reservations, or corporate bookings? We are here to help.
          </p>
        </div>

        <div className="row g-4 mb-5">
          {/* Contact Details Column */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-dark text-white h-100">
              <h3 className="brand-font fw-bold mb-3 text-white">Contact Information</h3>
              <p className="text-secondary small mb-4">
                Reach out directly to our dedicated travel specialists or drop by our regional offices.
              </p>

              <div className="d-flex flex-column gap-4 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 bg-secondary bg-opacity-25 rounded-circle text-warning">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="text-secondary small d-block">Phone Support</span>
                    <strong className="text-white">+91 98765 43210</strong>
                    <p className="text-secondary small mb-0">+971 4 555 1234 (Dubai)</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 bg-secondary bg-opacity-25 rounded-circle text-warning">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-secondary small d-block">Email Inquiries</span>
                    <strong className="text-white">support@travelvista.com</strong>
                    <p className="text-secondary small mb-0">bookings@travelvista.com</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 bg-secondary bg-opacity-25 rounded-circle text-warning">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-secondary small d-block">Headquarters</span>
                    <strong className="text-white">TravelVista Global Tourism</strong>
                    <p className="text-secondary small mb-0">Marina Bay Tower 4, Dubai / Nariman Point, Mumbai</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-3 border-top border-secondary border-opacity-25">
                <span className="badge bg-warning text-dark px-3 py-2 fw-bold">
                  ⚡ Average Response Time: Under 15 Minutes
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white h-100">
              <h3 className="brand-font fw-bold mb-3 text-dark">Send Us a Message</h3>

              {submitted ? (
                <div className="text-center py-5">
                  <div className="text-success mb-3">
                    <CheckCircle2 size={64} className="mx-auto" />
                  </div>
                  <h4 className="fw-bold mb-2">Message Sent Successfully!</h4>
                  <p className="text-muted mb-4">
                    Thank you, <strong>{formData.name}</strong>. Our travel concierge specialist will contact you shortly at{" "}
                    <strong>{formData.email}</strong>.
                  </p>
                  <button
                    className="btn btn-primary-custom"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Your Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Dhruvi Patel"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Your Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="e.g. dhruvi@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Subject / Package of Interest</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Inquiry regarding Dubai 6-Day Tour Package"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Message Details</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Tell us your travel requirements, number of people, preferred dates..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    disabled={submitting}
                  >
                    <Send size={18} />
                    <span>{submitting ? "Submitting Inquiry..." : "Submit Inquiry"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
          <h4 className="fw-bold brand-font mb-4 d-flex align-items-center gap-2">
            <HelpCircle className="text-primary" /> Frequently Asked Questions
          </h4>

          <div className="row g-4">
            <div className="col-md-6">
              <h6 className="fw-bold text-dark">Can I customize my tour package?</h6>
              <p className="text-muted small">
                Yes! You can use our interactive <strong>Plan Tour</strong> page to customize tour packages, select your preferred hotels, and add special requests.
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="fw-bold text-dark">What is your cancellation policy?</h6>
              <p className="text-muted small">
                Most packages and hotel stays can be cancelled free of charge up to 48 hours before the scheduled travel date directly from your <strong>My Bookings</strong> panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
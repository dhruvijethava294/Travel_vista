// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: PackageDetails.jsx
// Description: Displays full package itinerary, included hotels,
// inclusions/exclusions, photos, virtual video tours, and sticky booking card.
// =========================================================================

import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import BookingModal from "../components/BookingModal";
import { mockPackages, mockHotels } from "../services/mockData";
import {
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  Building,
  Video,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Share2,
  LogIn,
} from "lucide-react"; 

function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [packageData, setPackageData] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [allHotels, setAllHotels] = useState(mockHotels);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [pkgRes, hotelRes] = await Promise.allSettled([
          api.get(`/packages/${id}`),
          api.get("/hotels"),
        ]);

        let foundPkg = null;
        if (pkgRes.status === "fulfilled" && pkgRes.value.data) {
          foundPkg = pkgRes.value.data;
        } else {
          foundPkg =
            mockPackages.find((p) => p._id === id) ||
            mockPackages.find((p) => p.title.toLowerCase().includes(id.toLowerCase())) ||
            mockPackages[0];
        }

        setPackageData(foundPkg);
        setActiveImage(foundPkg?.image || foundPkg?.images?.[0] || "");

        if (hotelRes.status === "fulfilled" && hotelRes.value.data?.length > 0) {
          setAllHotels(hotelRes.value.data);
        } else {
          setAllHotels(mockHotels);
        }
      } catch (err) {
        const fallback = mockPackages.find((p) => p._id === id) || mockPackages[0];
        setPackageData(fallback);
        setActiveImage(fallback.image);
        setAllHotels(mockHotels);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5 min-vh-100 d-flex align-items-center justify-content-center">
        <div>
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading itinerary & details...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="container py-5 text-center">
        <h3>Package Not Found</h3>
        <p className="text-muted">The requested tour package could not be found.</p>
        <Link to="/packages" className="btn btn-primary-custom">
          Back to Packages
        </Link>
      </div>
    );
  }

  const galleryImages = [
    packageData.image,
    ...(packageData.images || []),
  ].filter(Boolean);

  return (
    <div className="bg-light py-4 min-vh-100">
      <div className="container">
        {/* Navigation Breadcrumbs */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link
            to="/packages"
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
          >
            <ChevronLeft size={16} />
            <span>All Packages</span>
          </Link>
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill">
            {packageData.category || "Standard Tour"}
          </span>
        </div>

        {/* Title and Price Header */}
        <div className="row align-items-center mb-4 g-3">
          <div className="col-lg-8">
            <h1 className="brand-font fw-bold text-dark mb-2">{packageData.title}</h1>
            <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
              <span className="d-flex align-items-center gap-1">
                <MapPin size={16} className="text-danger" />
                <strong className="text-dark">{packageData.destination}</strong>
              </span>
              <span>•</span>
              <span className="d-flex align-items-center gap-1">
                <Clock size={16} className="text-primary" />
                <strong>{packageData.duration}</strong>
              </span>
              <span>•</span>
              <span className="rating-pill">
                <Star size={14} className="fill-warning" />
                <span>{packageData.rating || 4.8} ({packageData.reviewsCount || 24} reviews)</span>
              </span>
            </div>
          </div>
          <div className="col-lg-4 text-lg-end">
            <span className="text-muted small d-block">All-Inclusive Price</span>
            <span className="display-6 fw-bold text-primary brand-font">
              ₹{packageData.price?.toLocaleString()}
            </span>
            <span className="text-muted small"> / person</span>
          </div>
        </div>

        {/* Hero Gallery Images */}
        <div className="row g-3 mb-5">
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: "400px" }}>
              <img
                src={activeImage}
                alt={packageData.title}
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-2 h-100 justify-content-between">
              {galleryImages.slice(0, 3).map((img, i) => (
                <div
                  key={i}
                  className={`rounded-3 overflow-hidden cursor-pointer border ${
                    activeImage === img ? "border-primary border-3" : "border-0"
                  }`}
                  style={{ height: "125px", cursor: "pointer" }}
                  onClick={() => setActiveImage(img)}
                >
                  <img
                    src={img}
                    alt={`Preview ${i}`}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content & Sticky Booking Card */}
        <div className="row g-4">
          {/* Left Column: Itinerary, Places, Inclusions */}
          <div className="col-lg-8">
            {/* Overview */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3 brand-font">Tour Overview</h4>
              <p className="text-secondary" style={{ lineHeight: "1.8" }}>
                {packageData.description}
              </p>

              {/* Places to visit */}
              {packageData.placesToVisit && packageData.placesToVisit.length > 0 && (
                <div className="mt-3">
                  <h6 className="fw-bold small text-uppercase text-muted mb-2">
                    Key Attractions & Places to Visit:
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {packageData.placesToVisit.map((place, idx) => (
                      <span key={idx} className="tag-chip accent">
                        📍 {place}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Day by Day Itinerary */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <Sparkles size={22} className="text-warning" />
                <h4 className="fw-bold mb-0 brand-font">Day-by-Day Detailed Itinerary</h4>
              </div>

              {packageData.itinerary && packageData.itinerary.length > 0 ? (
                <div>
                  {packageData.itinerary.map((item, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-dot">{item.day}</div>
                      <div className="bg-light p-3 rounded-3">
                        <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap">
                          <h6 className="fw-bold text-dark mb-1">
                            Day {item.day}: {item.title}
                          </h6>
                          {item.meals && (
                            <span className="badge bg-success bg-opacity-10 text-success small">
                              🍽️ {item.meals}
                            </span>
                          )}
                        </div>
                        <p className="text-secondary small mb-0">{item.activities}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Standard itinerary customized upon booking.</p>
              )}
            </div>

            {/* Inclusions & Exclusions */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-4 brand-font">Package Inclusions & Exclusions</h4>
              <div className="row g-4">
                <div className="col-md-6">
                  <h6 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                    <CheckCircle2 size={18} /> What's Included:
                  </h6>
                  <ul className="list-unstyled small">
                    {packageData.included && packageData.included.length > 0 ? (
                      packageData.included.map((inc, i) => (
                        <li key={i} className="mb-2 d-flex align-items-start gap-2 text-secondary">
                          <span className="text-success fw-bold">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted">All hotel stays, daily breakfast, and guided sightseeing.</li>
                    )}
                  </ul>
                </div>

                <div className="col-md-6">
                  <h6 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                    <XCircle size={18} /> What's Excluded:
                  </h6>
                  <ul className="list-unstyled small">
                    {packageData.excluded && packageData.excluded.length > 0 ? (
                      packageData.excluded.map((exc, i) => (
                        <li key={i} className="mb-2 d-flex align-items-start gap-2 text-secondary">
                          <span className="text-danger fw-bold">✗</span>
                          <span>{exc}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted">Flights, visa fees, and personal expenses.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Included Hotels Details */}
            {packageData.includedHotels && packageData.includedHotels.length > 0 && (
              <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                <h4 className="fw-bold mb-3 brand-font d-flex align-items-center gap-2">
                  <Building className="text-primary" size={22} /> Included Hotels & Resorts
                </h4>
                <div className="row g-3">
                  {packageData.includedHotels.map((h, i) => {
                    const hotelObj = typeof h === "object" ? h : allHotels.find((x) => x._id === h);
                    if (!hotelObj) return null;
                    return (
                      <div className="col-md-6" key={i}>
                        <div className="border rounded-3 p-3 bg-light d-flex gap-3 align-items-center">
                          <img
                            src={hotelObj.image}
                            alt={hotelObj.name}
                            className="rounded"
                            style={{ width: "70px", height: "70px", objectFit: "cover" }}
                          />
                          <div>
                            <h6 className="fw-bold mb-1">{hotelObj.name}</h6>
                            <p className="text-muted small mb-1">📍 {hotelObj.location}</p>
                            <span className="badge bg-warning text-dark small">⭐ {hotelObj.rating} / 5</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Video Tour Preview */}
            {packageData.videos && packageData.videos.length > 0 && (
              <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                <h4 className="fw-bold mb-3 brand-font d-flex align-items-center gap-2">
                  <Video className="text-danger" size={22} /> Virtual Tour Experience
                </h4>
                <div className="ratio ratio-16x9 rounded-3 overflow-hidden">
                  <iframe
                    src={packageData.videos[0]}
                    title="Package Video Preview"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="col-lg-4">
            <div className="card shadow border-0 rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
              <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill align-self-start mb-2">
                Instant Confirmation
              </span>
              <h4 className="fw-bold brand-font mb-1">Reserve Your Spot</h4>
              <p className="text-muted small mb-3">Guaranteed departure with free cancellation option.</p>

              <div className="bg-light p-3 rounded-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted small">Package Price:</span>
                  <span className="fw-bold text-dark fs-5">₹{packageData.price?.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center small text-muted">
                  <span>Duration:</span>
                  <span>{packageData.duration}</span>
                </div>
              </div>

              <div className="mb-3">
                <ul className="list-unstyled small text-muted">
                  <li className="mb-2 d-flex align-items-center gap-2">
                    <ShieldCheck size={16} className="text-primary" /> 100% Secure Checkout
                  </li>
                  <li className="mb-2 d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary" /> Verified Tour Guides
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <Sparkles size={16} className="text-primary" /> Customizable Hotel Stays
                  </li>
                </ul>
              </div>

              {/* Book button opens modal (which enforces login if user is guest) */}
              <button
                className="btn btn-primary-custom w-100 py-3 fw-bold fs-6 mb-2"
                onClick={() => setIsModalOpen(true)}
              >
                {user ? "Proceed to Book Tour" : "Login to Book Tour"}
              </button>

              <Link
                to={`/plan-tour?package=${packageData._id}`}
                className="btn btn-outline-secondary w-100 py-2 small"
              >
                Customize with Tour Planner
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={packageData}
        type="package"
        availableHotels={allHotels}
      />
    </div>
  );
}

export default PackageDetails;
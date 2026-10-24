// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Page: HotelDetails.jsx
// Description: Retrieves and displays comprehensive hotel stay information
// from Express backend API with gallery, amenities, real-time availability
// cost calculator, policies, related tour packages, and BookingModal.
// =========================================================================

import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import BookingModal from "../components/BookingModal";
import HotelCard from "../components/HotelCard";
import { mockHotels, mockPackages } from "../services/mockData";
import {
  Star,
  MapPin,
  Building,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Sparkles,
  Wifi,
  Waves,
  Coffee,
  Utensils,
  Bed,
  Tv,
  Wind,
  Car,
  Clock,
  Calendar,
  Share2,
  Check,
  Package as PackageIcon,
  Calculator,
  Info,
} from "lucide-react";

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Core Data States
  const [hotel, setHotel] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [nearbyPackages, setNearbyPackages] = useState([]);
  const [similarHotels, setSimilarHotels] = useState([]);

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic Date & Stay Calculator States
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const dayAfterTomorrow = new Date(Date.now() + 172800000).toISOString().split("T")[0];
  const [checkInDate, setCheckInDate] = useState(tomorrow);
  const [checkOutDate, setCheckOutDate] = useState(dayAfterTomorrow);
  const [guestCount, setGuestCount] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);

  // 1. Retrieve Data from Express API with fallback
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        let fetchedHotel = null;
        let fetchedPackages = [];
        let fetchedSimilar = [];

        // Attempt API request to GET /api/hotels/:id
        try {
          const res = await api.get(`/hotels/${id}`, {
            params: { includePackages: "true", includeSimilar: "true" },
          });

          if (res.data) {
            fetchedHotel = res.data;
            if (Array.isArray(res.data.relatedPackages)) {
              fetchedPackages = res.data.relatedPackages;
            }
            if (Array.isArray(res.data.similarHotels)) {
              fetchedSimilar = res.data.similarHotels;
            }
          }
        } catch (apiErr) {
          console.warn("API request failed, checking mock data fallback:", apiErr);
        }

        // Mock fallback if API has no match or backend is offline
        if (!fetchedHotel) {
          fetchedHotel =
            mockHotels.find((h) => h._id === id) ||
            mockHotels.find((h) => h.name.toLowerCase().includes(id.toLowerCase())) ||
            mockHotels[0];
        }

        setHotel(fetchedHotel);
        setActiveImage(fetchedHotel?.image || fetchedHotel?.images?.[0] || "");

        // If packages were not returned by main endpoint, fetch packages or filter mock
        if (fetchedPackages.length === 0 && fetchedHotel) {
          try {
            const pkgRes = await api.get(`/hotels/${fetchedHotel._id || id}/packages`);
            if (pkgRes.data && pkgRes.data.length > 0) {
              fetchedPackages = pkgRes.data;
            } else {
              fetchedPackages = mockPackages.filter(
                (pkg) =>
                  pkg.destination?.toLowerCase().includes(fetchedHotel.city?.toLowerCase()) ||
                  pkg.includedHotels?.some((h) => (h?._id || h) === fetchedHotel._id)
              );
            }
          } catch (pkgErr) {
            fetchedPackages = mockPackages.filter(
              (pkg) =>
                pkg.destination?.toLowerCase().includes(fetchedHotel.city?.toLowerCase()) ||
                pkg.includedHotels?.some((h) => (h?._id || h) === fetchedHotel._id)
            );
          }
        }
        setNearbyPackages(fetchedPackages.slice(0, 3));

        // If similar hotels were not returned, find from mock
        if (fetchedSimilar.length === 0 && fetchedHotel) {
          fetchedSimilar = mockHotels
            .filter((h) => h._id !== fetchedHotel._id)
            .filter(
              (h) =>
                h.city?.toLowerCase() === fetchedHotel.city?.toLowerCase() ||
                h.rating >= 4.5
            );
        }
        setSimilarHotels(fetchedSimilar.slice(0, 3));
      } catch (err) {
        console.error("Error loading hotel details:", err);
        const fallback = mockHotels.find((h) => h._id === id) || mockHotels[0];
        setHotel(fallback);
        setActiveImage(fallback?.image || "");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // 2. Real-time Price and Availability Calculation
  useEffect(() => {
    if (!hotel) return;

    const calculateStayPrice = async () => {
      setCalcLoading(true);
      try {
        // Try backend availability endpoint
        const res = await api.post(`/hotels/${hotel._id || id}/check-availability`, {
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: guestCount,
          rooms: roomCount,
        });

        if (res.data) {
          setPriceBreakdown(res.data);
          setCalcLoading(false);
          return;
        }
      } catch (err) {
        // Fallback calculation on client
      }

      // Client-side fallback calculation
      const inDate = new Date(checkInDate);
      const outDate = new Date(checkOutDate);
      const diffTime = outDate.getTime() - inDate.getTime();
      let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (nights <= 0) nights = 1;

      const basePrice = (hotel.pricePerNight || 5000) * nights * roomCount;
      const taxes = Math.round(basePrice * 0.12);
      const totalAmount = basePrice + taxes;

      setPriceBreakdown({
        nights,
        rooms: roomCount,
        guests: guestCount,
        basePrice,
        taxes,
        totalAmount,
        available: true,
      });
      setCalcLoading(false);
    };

    calculateStayPrice();
  }, [hotel, checkInDate, checkOutDate, guestCount, roomCount, id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getAmenityIcon = (name = "") => {
    const lower = name.toLowerCase();
    if (lower.includes("wifi")) return <Wifi size={18} className="text-primary" />;
    if (lower.includes("pool") || lower.includes("beach")) return <Waves size={18} className="text-info" />;
    if (lower.includes("spa") || lower.includes("wellness")) return <Sparkles size={18} className="text-warning" />;
    if (lower.includes("dining") || lower.includes("restaurant") || lower.includes("breakfast")) return <Utensils size={18} className="text-danger" />;
    if (lower.includes("bar") || lower.includes("lounge") || lower.includes("coffee")) return <Coffee size={18} className="text-secondary" />;
    if (lower.includes("ac") || lower.includes("air")) return <Wind size={18} className="text-primary" />;
    if (lower.includes("tv")) return <Tv size={18} className="text-dark" />;
    if (lower.includes("parking") || lower.includes("valet")) return <Car size={18} className="text-success" />;
    return <CheckCircle2 size={18} className="text-success" />;
  };

  if (loading) {
    return (
      <div className="text-center py-5 min-vh-100 d-flex align-items-center justify-content-center">
        <div>
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-3 fw-semibold">Loading hotel details & amenities...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <Building size={56} className="text-muted mb-3" />
        <h3 className="fw-bold">Hotel Not Found</h3>
        <p className="text-muted mb-4">The requested hotel or resort could not be retrieved from the server.</p>
        <Link to="/hotels" className="btn btn-primary-custom">
          Back to Hotels Listing
        </Link>
      </div>
    );
  }

  const galleryImages = [
    hotel.image,
    ...(hotel.images || []),
  ].filter(Boolean);

  return (
    <div className="bg-light py-4 min-vh-100">
      <div className="container">
        {/* Navigation Breadcrumbs & Share */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <Link
            to="/hotels"
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
          >
            <ChevronLeft size={16} />
            <span>All Hotels & Resorts</span>
          </Link>

          <div className="d-flex align-items-center gap-2">
            <button
              onClick={handleShare}
              className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
              title="Share hotel URL"
            >
              {copied ? <Check size={15} className="text-success" /> : <Share2 size={15} />}
              <span>{copied ? "Link Copied!" : "Share Hotel"}</span>
            </button>
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill">
              {hotel.roomType || "Luxury Suite"}
            </span>
            {hotel.featured && (
              <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-semibold">
                ⭐ Featured Stay
              </span>
            )}
          </div>
        </div>

        {/* Title, Location & Price Banner */}
        <div className="row align-items-center mb-4 g-3">
          <div className="col-lg-8">
            <h1 className="brand-font fw-bold text-dark mb-2">{hotel.name}</h1>
            <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
              <span className="d-flex align-items-center gap-1">
                <MapPin size={16} className="text-danger flex-shrink-0" />
                <strong className="text-dark">{hotel.location}</strong>
                {hotel.city && <span>({hotel.city})</span>}
              </span>
              <span>•</span>
              <span className="rating-pill">
                <Star size={14} className="fill-warning" />
                <span>{hotel.rating || 4.8} / 5 ({hotel.reviewsCount || 24} reviews)</span>
              </span>
              <span>•</span>
              <span className="badge bg-success bg-opacity-10 text-success fw-normal">
                ✓ {hotel.availableRooms != null ? `${hotel.availableRooms} rooms available` : "Available for Instant Booking"}
              </span>
              <span>•</span>
              <span className="badge bg-info bg-opacity-10 text-info fw-normal">
                🛡️ {hotel.cancellationPolicy || "Free cancellation"}
              </span>
            </div>
          </div>

          <div className="col-lg-4 text-lg-end">
            <span className="text-muted small d-block">Starting from</span>
            <span className="display-6 fw-bold text-primary brand-font">
              ₹{hotel.pricePerNight?.toLocaleString()}
            </span>
            <span className="text-muted small"> / room / night</span>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="row g-3 mb-5">
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: "420px" }}>
              <img
                src={activeImage}
                alt={hotel.name}
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
                  className={`rounded-3 overflow-hidden border ${
                    activeImage === img ? "border-primary border-3" : "border-0"
                  }`}
                  style={{ height: "132px", cursor: "pointer" }}
                  onClick={() => setActiveImage(img)}
                >
                  <img
                    src={img}
                    alt={`${hotel.name} view ${i + 1}`}
                    className="w-100 h-100"
                    style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content & Sticky Interactive Booking Card */}
        <div className="row g-4">
          {/* Left Column: Details, Room Specs, Amenities, Reviews, Policies */}
          <div className="col-lg-8">
            {/* Overview Card */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3 brand-font">About {hotel.name}</h4>
              <p className="text-secondary" style={{ lineHeight: "1.8" }}>
                {hotel.description}
              </p>

              {/* Room Specifications */}
              <div className="mt-4 pt-3 border-top">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold text-dark mb-0">Room Specifications & Stay Highlights</h6>
                  <span className="badge bg-success bg-opacity-10 text-success small fw-semibold">
                    {hotel.availableRooms != null ? `${hotel.availableRooms} of ${hotel.totalRooms || 20} rooms vacant` : "Vacant"}
                  </span>
                </div>
                <div className="row g-3">
                  <div className="col-sm-6 col-md-4">
                    <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                      <Bed size={22} className="text-primary flex-shrink-0" />
                      <div>
                        <span className="small text-muted d-block">Room & Bed Type</span>
                        <strong className="text-dark small">{hotel.roomType || "Luxury Suite"}</strong>
                        <span className="text-muted small d-block">
                          {hotel.roomSpecifications?.bedType || "King Size / Twin Bed"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                      <Clock size={22} className="text-primary flex-shrink-0" />
                      <div>
                        <span className="small text-muted d-block">Check-in / Check-out</span>
                        <strong className="text-dark small">
                          In: {hotel.checkInTime || "2:00 PM"}
                        </strong>
                        <span className="text-muted small d-block">
                          Out: {hotel.checkOutTime || "11:00 AM"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                      <Building size={22} className="text-primary flex-shrink-0" />
                      <div>
                        <span className="small text-muted d-block">Room Size & Guests</span>
                        <strong className="text-dark small">{hotel.roomSpecifications?.roomSize || "450 sq.ft"}</strong>
                        <span className="text-muted small d-block">
                          Max {hotel.roomSpecifications?.maxOccupancy || 3} Guests
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                      <ShieldCheck size={22} className="text-success flex-shrink-0" />
                      <div>
                        <span className="small text-muted d-block">Cancellation Terms</span>
                        <strong className="text-success small">Free Cancellation</strong>
                        <span className="text-muted small d-block text-truncate" style={{ maxWidth: "160px" }} title={hotel.cancellationPolicy}>
                          {hotel.cancellationPolicy || "Up to 48 hrs prior"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                      <MapPin size={22} className="text-danger flex-shrink-0" />
                      <div>
                        <span className="small text-muted d-block">Room View</span>
                        <strong className="text-dark small">
                          {hotel.roomSpecifications?.view || "Scenic Landscape"}
                        </strong>
                        <span className="text-muted small d-block">{hotel.city || hotel.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                      <Sparkles size={22} className="text-warning flex-shrink-0" />
                      <div>
                        <span className="small text-muted d-block">Room Inventory</span>
                        <strong className="text-dark small">
                          {hotel.availableRooms != null ? hotel.availableRooms : 15} Available
                        </strong>
                        <span className="text-muted small d-block">
                          Out of {hotel.totalRooms || 20} Total
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Sparkles size={22} className="text-warning" />
                <h4 className="fw-bold mb-0 brand-font">Amenities & World-Class Facilities</h4>
              </div>
              <p className="text-muted small mb-4">
                Enjoy world-class hospitality, fine comfort, and carefully curated facilities for a relaxing stay.
              </p>

              <div className="row g-3">
                {hotel.amenities && hotel.amenities.length > 0 ? (
                  hotel.amenities.map((amenity, idx) => (
                    <div className="col-md-6" key={idx}>
                      <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border border-light-subtle">
                        {getAmenityIcon(amenity)}
                        <span className="fw-semibold text-dark small">{amenity}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Standard amenities including Wi-Fi, air conditioning, and room service.</p>
                )}
              </div>
            </div>

            {/* Ratings & Guest Reviews */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h4 className="fw-bold mb-1 brand-font">Guest Ratings & Reviews</h4>
                  <p className="text-muted small mb-0">Verified feedback from past guests who stayed here</p>
                </div>
                <div className="text-end">
                  <div className="display-6 fw-bold text-dark brand-font">{hotel.rating || 4.8}</div>
                  <div className="rating-pill justify-content-end">
                    <Star size={14} className="fill-warning" />
                    <span>Based on {hotel.reviewsCount || 48} reviews</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar Metrics */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="small text-muted d-flex justify-content-between mb-1">
                    <span>Cleanliness & Hygiene</span>
                    <strong>{hotel.ratingsBreakdown?.cleanliness || 4.9} / 5</strong>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div className="progress-bar bg-success" style={{ width: `${((hotel.ratingsBreakdown?.cleanliness || 4.9) / 5) * 100}%` }}></div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="small text-muted d-flex justify-content-between mb-1">
                    <span>Location & Scenic Views</span>
                    <strong>{hotel.ratingsBreakdown?.location || 4.8} / 5</strong>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div className="progress-bar bg-primary" style={{ width: `${((hotel.ratingsBreakdown?.location || 4.8) / 5) * 100}%` }}></div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="small text-muted d-flex justify-content-between mb-1">
                    <span>Staff & Hospitality</span>
                    <strong>{hotel.ratingsBreakdown?.staff || 4.9} / 5</strong>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div className="progress-bar bg-info" style={{ width: `${((hotel.ratingsBreakdown?.staff || 4.9) / 5) * 100}%` }}></div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="small text-muted d-flex justify-content-between mb-1">
                    <span>Value for Money</span>
                    <strong>{hotel.ratingsBreakdown?.value || 4.7} / 5</strong>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div className="progress-bar bg-warning" style={{ width: `${((hotel.ratingsBreakdown?.value || 4.7) / 5) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Policies */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3 brand-font">Hotel Stay Policies & Terms</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-2">
                      <CheckCircle2 size={16} /> Check-in & Identification
                    </h6>
                    <ul className="list-unstyled small text-secondary mb-0">
                      <li className="mb-1">• Check-in from <strong>{hotel.checkInTime || "2:00 PM"}</strong> / Check-out by <strong>{hotel.checkOutTime || "11:00 AM"}</strong></li>
                      <li className="mb-1">• Government photo ID proof mandatory for all guests</li>
                      <li>• Early check-in subject to room availability</li>
                    </ul>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="fw-bold text-primary mb-2 d-flex align-items-center gap-2">
                      <ShieldCheck size={16} /> Cancellation & Child Policy
                    </h6>
                    <ul className="list-unstyled small text-secondary mb-0">
                      <li className="mb-1 text-dark fw-semibold">• {hotel.cancellationPolicy || "Free cancellation up to 48 hours prior to check-in"}</li>
                      <li className="mb-1">• Complimentary stay for children below 5 years</li>
                      <li>• 100% refund guarantee on qualifying cancellations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Specific Property Guidelines / Policies */}
              {hotel.policies && hotel.policies.length > 0 && (
                <div className="mt-3 p-3 bg-light rounded-3 border border-light-subtle">
                  <h6 className="fw-bold text-dark small mb-2">Specific Property Guidelines:</h6>
                  <ul className="list-unstyled small text-secondary mb-0">
                    {hotel.policies.map((p, idx) => (
                      <li key={idx} className="mb-1 d-flex align-items-center gap-2">
                        <Check size={14} className="text-success flex-shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Direct Hotel Contact */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3 brand-font">Direct Concierge Assistance</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                    <Phone size={20} className="text-warning flex-shrink-0" />
                    <div>
                      <span className="small text-muted d-block">Front Desk / Concierge</span>
                      <strong className="text-dark">{hotel.contactPhone || "+91 98765 43210"}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                    <Mail size={20} className="text-warning flex-shrink-0" />
                    <div>
                      <span className="small text-muted d-block">Reservations Support</span>
                      <strong className="text-dark">{hotel.contactEmail || "reservations@travelvista.com"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Interactive Stay Calculator & Booking Card */}
          <div className="col-lg-4">
            <div className="card shadow border-0 rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill">
                  Instant Confirmation
                </span>
                <span className="small text-muted">₹{hotel.pricePerNight?.toLocaleString()} / night</span>
              </div>

              <h4 className="fw-bold brand-font mb-1">Book Your Stay</h4>
              <p className="text-muted small mb-3">Select dates and guests to view live cost breakdown.</p>

              {/* Date & Guest Selectors */}
              <div className="bg-light p-3 rounded-3 mb-3">
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted mb-1">Check-in</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={checkInDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckInDate(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted mb-1">Check-out</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={checkOutDate}
                      min={checkInDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted mb-1">Guests</label>
                    <select
                      className="form-select form-select-sm"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted mb-1">Rooms</label>
                    <select
                      className="form-select form-select-sm"
                      value={roomCount}
                      onChange={(e) => setRoomCount(Number(e.target.value))}
                    >
                      <option value="1">1 Room</option>
                      <option value="2">2 Rooms</option>
                      <option value="3">3 Rooms</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Breakdown Preview */}
              {priceBreakdown && (
                <div className="p-3 border rounded-3 mb-3 bg-white">
                  <div className="d-flex justify-content-between align-items-center small text-muted mb-1">
                    <span>
                      ₹{hotel.pricePerNight?.toLocaleString()} × {priceBreakdown.nights} {priceBreakdown.nights > 1 ? "nights" : "night"} ({priceBreakdown.rooms} {priceBreakdown.rooms > 1 ? "rooms" : "room"}):
                    </span>
                    <span>₹{priceBreakdown.basePrice?.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
                    <span>Taxes & GST (12%):</span>
                    <span>₹{priceBreakdown.taxes?.toLocaleString()}</span>
                  </div>
                  <div className="border-top pt-2 d-flex justify-content-between align-items-center">
                    <strong className="text-dark">Total Stay Price:</strong>
                    <span className="fs-5 fw-bold text-primary">₹{priceBreakdown.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <ul className="list-unstyled small text-muted">
                  <li className="mb-2 d-flex align-items-center gap-2">
                    <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                    <span>{hotel.cancellationPolicy || "Free cancellation up to 48h"}</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center gap-2">
                    <Clock size={16} className="text-primary flex-shrink-0" />
                    <span>Check-in: <strong>{hotel.checkInTime || "2:00 PM"}</strong> • Out: <strong>{hotel.checkOutTime || "11:00 AM"}</strong></span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <Sparkles size={16} className="text-warning flex-shrink-0" />
                    <span className="fw-semibold text-dark">
                      {hotel.availableRooms != null
                        ? `Only ${hotel.availableRooms} rooms left (out of ${hotel.totalRooms || 20})`
                        : "Instant Confirmation"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Book button opens modal */}
              <button
                className="btn btn-primary-custom w-100 py-3 fw-bold fs-6 mb-2"
                onClick={() => setIsModalOpen(true)}
              >
                {user ? "Proceed to Book Hotel" : "Login to Book Hotel"}
              </button>

              <Link
                to={`/plan-tour?destination=${encodeURIComponent(hotel.city || hotel.location)}`}
                className="btn btn-outline-secondary w-100 py-2 small"
              >
                Customize Tour with this Hotel
              </Link>
            </div>
          </div>
        </div>

        {/* Tour Packages Featuring this Hotel / City */}
        {nearbyPackages.length > 0 && (
          <div className="mt-5 pt-4 border-top">
            <div className="d-flex align-items-center gap-2 mb-4">
              <PackageIcon className="text-primary" size={24} />
              <h3 className="brand-font fw-bold mb-0">Tour Packages in {hotel.city || "this Region"}</h3>
            </div>
            <div className="row g-4">
              {nearbyPackages.map((pkg) => (
                <div className="col-lg-4 col-md-6" key={pkg._id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <div style={{ height: "160px", overflow: "hidden" }}>
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="card-body p-3 d-flex flex-column justify-content-between">
                      <div>
                        <h6 className="fw-bold mb-1">{pkg.title}</h6>
                        <p className="text-muted small mb-2">{pkg.duration} • ₹{pkg.price?.toLocaleString()} / person</p>
                      </div>
                      <Link
                        to={`/packages/${pkg._id}`}
                        className="btn btn-outline-primary btn-sm mt-2"
                      >
                        View Tour Package
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Alternative Luxury Stays */}
        {similarHotels.length > 0 && (
          <div className="mt-5 pt-4 border-top">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Building className="text-primary" size={24} />
              <h3 className="brand-font fw-bold mb-0">Explore More Luxury Stays</h3>
            </div>
            <div className="row g-4">
              {similarHotels.map((htl) => (
                <div className="col-lg-4 col-md-6" key={htl._id}>
                  <HotelCard hotel={htl} onBook={(item) => {
                    setHotel(item);
                    setIsModalOpen(true);
                  }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={hotel}
        type="hotel"
      />
    </div>
  );
}

export default HotelDetails;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import PackageCard from "../components/PackageCard";
import HotelCard from "../components/HotelCard";
import BookingModal from "../components/BookingModal";
import { mockPackages, mockDestinations, mockHotels } from "../services/mockData";
import {
  Compass,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  Award,
  Headphones,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Plane,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [featuredPackages, setFeaturedPackages] = useState(mockPackages.slice(0, 6));
  const [destinations, setDestinations] = useState(mockDestinations);
  const [hotels, setHotels] = useState(mockHotels);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [searchDestination, setSearchDestination] = useState("all");
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchMaxPrice, setSearchMaxPrice] = useState("");

  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState("package");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pkgRes, destRes, hotelRes] = await Promise.allSettled([
          api.get("/packages/featured"),
          api.get("/destinations"),
          api.get("/hotels"),
        ]);

        if (pkgRes.status === "fulfilled" && pkgRes.value.data?.length > 0) {
          setFeaturedPackages(pkgRes.value.data);
        } else {
          setFeaturedPackages(mockPackages.slice(0, 6));
        }

        if (destRes.status === "fulfilled" && destRes.value.data?.length > 0) {
          setDestinations(destRes.value.data);
        } else {
          setDestinations(mockDestinations);
        }

        if (hotelRes.status === "fulfilled" && hotelRes.value.data?.length > 0) {
          setHotels(hotelRes.value.data);
        } else {
          setHotels(mockHotels);
        }
      } catch (err) {
        setFeaturedPackages(mockPackages.slice(0, 6));
        setDestinations(mockDestinations);
        setHotels(mockHotels);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchDestination && searchDestination !== "all") {
      params.append("destination", searchDestination);
    }
    if (searchCategory && searchCategory !== "all") {
      params.append("category", searchCategory);
    }
    if (searchMaxPrice) {
      params.append("maxPrice", searchMaxPrice);
    }
    navigate(`/packages?${params.toString()}`);
  };

  const handleBookPackage = (pkg) => {
    setSelectedItem(pkg);
    setModalType("package");
    setIsModalOpen(true);
  };

  const handleBookHotel = (htl) => {
    setSelectedItem(htl);
    setModalType("hotel");
    setIsModalOpen(true);
  };

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-wrapper text-center">
        <div className="container">
          <div className="hero-content">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center gap-1">
              <Sparkles size={16} /> Welcome to TravelVista 2026
            </span>
            <h1 className="display-4 fw-extrabold text-white">
              Discover Your Next <span className="text-warning">Dream Adventure</span>
            </h1>
            <p className="lead text-light opacity-90 mx-auto" style={{ maxWidth: "680px" }}>
              Explore curated tour packages, luxury hotels, scenic destinations, and design your own custom tour itinerary with instant confirmation.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
              <Link to="/packages" className="btn btn-secondary-custom btn-lg d-flex align-items-center gap-2">
                <Compass size={20} />
                <span>Explore Packages</span>
              </Link>
              <Link to="/plan-tour" className="btn btn-outline-light btn-lg d-flex align-items-center gap-2">
                <Plane size={20} />
                <span>Plan Custom Tour</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Search Filter Bar */}
      <div className="container">
        <div className="search-box-card">
          <form onSubmit={handleSearchSubmit}>
            <div className="row g-3 align-items-center">
              <div className="col-md-3">
                <label className="form-label small text-muted fw-bold d-flex align-items-center gap-1">
                  <MapPin size={15} className="text-primary" /> Destination
                </label>
                <select
                  className="form-select form-select-lg fs-6"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                >
                  <option value="all">All Destinations</option>
                  {destinations.map((d) => (
                    <option key={d._id} value={d.name}>
                      {d.name}, {d.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small text-muted fw-bold d-flex align-items-center gap-1">
                  <Compass size={15} className="text-primary" /> Tour Type
                </label>
                <select
                  className="form-select form-select-lg fs-6"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="Beach">Beach & Tropical</option>
                  <option value="Adventure">Adventure & Snow</option>
                  <option value="Honeymoon">Honeymoon & Romantic</option>
                  <option value="Luxury">Luxury & Metropolis</option>
                  <option value="Heritage">Heritage & Culture</option>
                  <option value="Family">Family Alpine</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small text-muted fw-bold d-flex align-items-center gap-1">
                  <DollarSign size={15} className="text-primary" /> Max Budget (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  className="form-control form-control-lg fs-6"
                  value={searchMaxPrice}
                  onChange={(e) => setSearchMaxPrice(e.target.value)}
                />
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <button type="submit" className="btn btn-primary-custom btn-lg w-100 d-flex align-items-center justify-content-center gap-2">
                  <Search size={20} />
                  <span>Find Tours</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Highlights / Stats bar */}
      <section className="container py-5">
        <div className="row g-4 text-center">
          <div className="col-md-3 col-6">
            <div className="p-3 bg-white rounded-4 shadow-sm border">
              <h2 className="brand-font text-primary fw-bold mb-1">50+</h2>
              <p className="text-muted small mb-0">Global Destinations</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="p-3 bg-white rounded-4 shadow-sm border">
              <h2 className="brand-font text-primary fw-bold mb-1">120+</h2>
              <p className="text-muted small mb-0">Premium Packages</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="p-3 bg-white rounded-4 shadow-sm border">
              <h2 className="brand-font text-primary fw-bold mb-1">10k+</h2>
              <p className="text-muted small mb-0">Happy Travelers</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="p-3 bg-white rounded-4 shadow-sm border">
              <h2 className="brand-font text-primary fw-bold mb-1">4.9/5</h2>
              <p className="text-muted small mb-0">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tour Packages */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-primary text-uppercase fw-bold small tracking-wider">
              Handcrafted Experiences
            </span>
            <h2 className="brand-font fw-bold mt-1">Featured Tour Packages</h2>
          </div>
          <Link to="/packages" className="btn btn-outline-primary d-none d-md-flex align-items-center gap-1">
            <span>View All Packages</span>
            <ChevronRight size={18} />
          </Link>
        </div>

        <div className="row g-4">
          {featuredPackages.slice(0, 6).map((pkg) => (
            <div className="col-lg-4 col-md-6" key={pkg._id}>
              <PackageCard packageData={pkg} onBook={handleBookPackage} />
            </div>
          ))}
        </div>

        <div className="text-center mt-4 d-md-none">
          <Link to="/packages" className="btn btn-primary-custom w-100">
            View All Packages
          </Link>
        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-primary text-uppercase fw-bold small">
                Incredible Places
              </span>
              <h2 className="brand-font fw-bold mt-1">Popular Destinations</h2>
            </div>
            <Link to="/destinations" className="btn btn-outline-secondary d-none d-md-flex align-items-center gap-1">
              <span>Explore All</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="row g-4">
            {destinations.slice(0, 6).map((dest) => (
              <div className="col-lg-4 col-md-6" key={dest._id}>
                <div
                  className="dest-card"
                  onClick={() => navigate(`/packages?destination=${dest.name}`)}
                >
                  <img src={dest.image} alt={dest.name} loading="lazy" />
                  <div className="dest-card-overlay">
                    <span className="badge bg-warning text-dark w-auto align-self-start mb-2 small fw-bold">
                      {dest.country}
                    </span>
                    <h4 className="fw-bold text-white mb-1">{dest.name}</h4>
                    <p className="small text-light opacity-90 mb-2">
                      {dest.description?.slice(0, 70)}...
                    </p>
                    <span className="text-warning small fw-bold d-flex align-items-center gap-1">
                      <span>View Packages</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Tour Custom Trip Banner */}
      <section className="container py-5">
        <div
          className="rounded-4 p-5 text-white position-relative overflow-hidden shadow-lg"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #0284c7 100%)",
          }}
        >
          <div className="row align-items-center position-relative z-2">
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3">
                ✨ Custom Trip Planner
              </span>
              <h2 className="display-6 fw-bold text-white mb-3">
                Tailor Your Vacation Exactly How You Want
              </h2>
              <p className="text-light opacity-90 fs-6 mb-4">
                Select your favorite destination package, upgrade to luxury hotels, pick your travel dates, and get an instant transparent quote with 1-click booking.
              </p>
              <Link to="/plan-tour" className="btn btn-secondary-custom btn-lg">
                Launch Trip Planner Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Spotlight */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-primary text-uppercase fw-bold small">
              Stay in Comfort
            </span>
            <h2 className="brand-font fw-bold mt-1">Luxury Hotels & Resorts</h2>
          </div>
          <Link to="/hotels" className="btn btn-outline-primary d-none d-md-flex align-items-center gap-1">
            <span>View All Hotels</span>
            <ChevronRight size={18} />
          </Link>
        </div>

        <div className="row g-4">
          {hotels.slice(0, 4).map((hotel) => (
            <div className="col-lg-3 col-md-6" key={hotel._id}>
              <HotelCard hotel={hotel} onBook={handleBookHotel} />
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-5 border-top">
        <div className="container">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-primary text-uppercase fw-bold small">
              Why TravelVista?
            </span>
            <h2 className="brand-font fw-bold mt-1">Seamless Travel Made Simple</h2>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100">
                <div className="mb-3 text-primary">
                  <Award size={40} className="mx-auto" />
                </div>
                <h5 className="fw-bold">Best Price & Value Guarantee</h5>
                <p className="text-muted small">
                  Direct partnership with top resorts and tour operators ensuring maximum comfort at unmatched transparent rates.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100">
                <div className="mb-3 text-primary">
                  <ShieldCheck size={40} className="mx-auto" />
                </div>
                <h5 className="fw-bold">100% Verified & Secure</h5>
                <p className="text-muted small">
                  All hotels, itinerary activities, and transfers are pre-inspected for safety, quality, and complete peace of mind.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100">
                <div className="mb-3 text-primary">
                  <Headphones size={40} className="mx-auto" />
                </div>
                <h5 className="fw-bold">24/7 Dedicated Support</h5>
                <p className="text-muted small">
                  Our professional travel concierge team is available around the clock before, during, and after your trip.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        type={modalType}
        availableHotels={hotels}
      />
    </div>
  );
}

export default Home;
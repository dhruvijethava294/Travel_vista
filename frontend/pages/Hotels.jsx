import { useEffect, useState } from "react";
import api from "../services/api";
import HotelCard from "../components/HotelCard";
import BookingModal from "../components/BookingModal";
import { mockHotels } from "../services/mockData";
import { Search, Building, MapPin, SlidersHorizontal, RotateCcw } from "lucide-react";

function Hotels() {
  const [hotels, setHotels] = useState(mockHotels);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [maxPrice, setMaxPrice] = useState(60000);
  const [sort, setSort] = useState("rating_desc");

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (location && location !== "all") params.location = location;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const res = await api.get("/hotels", { params });
      if (res.data && res.data.length > 0) {
        setHotels(res.data);
      } else {
        let filtered = [...mockHotels];
        if (search) {
          filtered = filtered.filter(
            (h) =>
              h.name.toLowerCase().includes(search.toLowerCase()) ||
              h.location.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (location && location !== "all") {
          filtered = filtered.filter(
            (h) => h.city.toLowerCase() === location.toLowerCase()
          );
        }
        if (maxPrice) {
          filtered = filtered.filter((h) => h.pricePerNight <= Number(maxPrice));
        }
        if (sort === "price_asc") filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
        else if (sort === "price_desc") filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
        else if (sort === "rating_desc") filtered.sort((a, b) => b.rating - a.rating);

        setHotels(filtered);
      }
    } catch (err) {
      setHotels(mockHotels);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [location, maxPrice, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHotels();
  };

  const handleReset = () => {
    setSearch("");
    setLocation("all");
    setMaxPrice(60000);
    setSort("rating_desc");
  };

  const handleBookHotel = (htl) => {
    setSelectedHotel(htl);
    setIsModalOpen(true);
  };

  const cities = ["Goa", "Manali", "Dubai", "Kerala", "Bali", "Paris", "Rajasthan", "Switzerland"];

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-2">
            🏨 Luxury Stays & Resorts
          </span>
          <h1 className="brand-font fw-bold">Find Your Ideal Stay</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Handpicked premium resorts, boutique villas, alpine chalets, and city hotels with world-class amenities and best price guarantees.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="row g-3 align-items-center">
              <div className="col-lg-4 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Search size={18} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search hotel name, location, amenities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary-custom">
                    Search
                  </button>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <select
                  className="form-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Max Price/Night:</span>
                  <strong className="text-primary">₹{Number(maxPrice).toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="5000"
                  max="60000"
                  step="2500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div className="col-lg-2 col-md-6">
                <select
                  className="form-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="rating_desc">Top Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading hotels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="card text-center p-5 border-0 shadow-sm rounded-4">
            <Building size={48} className="mx-auto text-muted mb-3" />
            <h4>No Hotels Found</h4>
            <p className="text-muted">Try adjusting your filters or search keywords.</p>
            <div>
              <button className="btn btn-primary-custom" onClick={handleReset}>
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {hotels.map((hotel) => (
              <div className="col-lg-3 col-md-6" key={hotel._id}>
                <HotelCard hotel={hotel} onBook={handleBookHotel} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedHotel}
        type="hotel"
      />
    </div>
  );
}

export default Hotels;
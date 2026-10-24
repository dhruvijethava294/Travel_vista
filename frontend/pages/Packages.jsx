import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import PackageCard from "../components/PackageCard";
import BookingModal from "../components/BookingModal";
import { mockPackages, mockHotels } from "../services/mockData";
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  MapPin,
} from "lucide-react";

function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState(mockPackages);
  const [hotels, setHotels] = useState(mockHotels);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 6;
  // Filters State
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [destination, setDestination] = useState(searchParams.get("destination") || "all");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || 150000);
  const [sort, setSort] = useState("newest");

  // Booking Modal
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (destination && destination !== "all") params.destination = destination;
      if (category && category !== "all") params.category = category;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const [pkgRes, hotelRes] = await Promise.allSettled([
        api.get("/packages", { params }),
        api.get("/hotels"),
      ]);

      if (pkgRes.status === "fulfilled" && pkgRes.value.data?.length > 0) {
        setPackages(pkgRes.value.data);
      } else {
        // Apply filter to mock data
        let filtered = [...mockPackages];
        if (search) {
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(search.toLowerCase()) ||
              p.destination.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (destination && destination !== "all") {
          filtered = filtered.filter(
            (p) => p.destination.toLowerCase() === destination.toLowerCase()
          );
        }
        if (category && category !== "all") {
          filtered = filtered.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
          );
        }
        if (maxPrice) {
          filtered = filtered.filter((p) => p.price <= Number(maxPrice));
        }
        if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
        else if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
        else if (sort === "rating_desc") filtered.sort((a, b) => b.rating - a.rating);

        setPackages(filtered);
      }

      if (hotelRes.status === "fulfilled" && hotelRes.value.data?.length > 0) {
        setHotels(hotelRes.value.data);
      } else {
        setHotels(mockHotels);
      }
    } catch (error) {
      setPackages(mockPackages);
      setHotels(mockHotels);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [destination, category, maxPrice, sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, destination, category, maxPrice, sort]);

  const totalPages = Math.ceil(packages.length / packagesPerPage) || 1;

  const startIndex = (currentPage - 1) * packagesPerPage;
  const currentPackages = packages.slice(
    startIndex,
    startIndex + packagesPerPage
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPackages();
  };

  const handleResetFilters = () => {
    setSearch("");
    setDestination("all");
    setCategory("all");
    setMaxPrice(150000);
    setSort("newest");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleOpenBooking = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const destinationsList = [
    "Goa",
    "Manali",
    "Dubai",
    "Kerala",
    "Bali",
    "Paris",
    "Rajasthan",
    "Switzerland",
  ];

  const categoriesList = [
    "All",
    "Beach",
    "Adventure",
    "Honeymoon",
    "Luxury",
    "Heritage",
    "Family",
  ];

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header Title */}
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-2">
            ✈️ Premium Holiday Packages
          </span>
          <h1 className="brand-font fw-bold">Explore All Tour Packages</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Hand-crafted itineraries with included sightseeing, verified hotels, comfortable transport, and unforgettable activities.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="row g-3 align-items-center">
              {/* Keyword Search */}
              <div className="col-lg-4 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Search size={18} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search package, city, activity..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary-custom">
                    Search
                  </button>
                </div>
              </div>

              {/* Destination Dropdown */}
              <div className="col-lg-3 col-md-6">
                <select
                  className="form-select"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="all">All Destinations</option>
                  {destinationsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Slider */}
              <div className="col-lg-3 col-md-6">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Max Budget:</span>
                  <strong className="text-primary">₹{Number(maxPrice).toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="10000"
                  max="150000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              {/* Sort Dropdown */}
              <div className="col-lg-2 col-md-6">
                <select
                  className="form-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="d-flex flex-wrap align-items-center gap-2 mt-3 pt-3 border-top">
              <span className="small text-muted fw-bold me-2">Category:</span>
              {categoriesList.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`btn btn-sm ${
                    category === cat || (cat === "All" && category === "all")
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  } rounded-pill px-3`}
                  onClick={() => setCategory(cat === "All" ? "all" : cat)}
                >
                  {cat}
                </button>
              ))}

              <button
                type="button"
                className="btn btn-sm btn-link text-muted ms-auto d-flex align-items-center gap-1 text-decoration-none"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Counter */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <p className="text-muted mb-0 small">
            Showing <strong>{packages.length}</strong> holiday packages available
            {packages.length > packagesPerPage && (
              <span> (Page {currentPage} of {totalPages})</span>
            )}
          </p>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading tour packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="card text-center p-5 border-0 shadow-sm rounded-4">
            <div className="mb-3 text-muted">
              <Search size={48} className="mx-auto" />
            </div>
            <h4>No Tour Packages Found</h4>
            <p className="text-muted">
              We couldn't find any packages matching your search criteria. Try adjusting your filters.
            </p>
            <div>
              <button className="btn btn-primary-custom" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {currentPackages.map((pkg) => (
                <div className="col-lg-4 col-md-6" key={pkg._id}>
                  <PackageCard packageData={pkg} onBook={handleOpenBooking} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav aria-label="Tour packages page navigation" className="mt-5">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <li
                      key={pageNum}
                      className={`page-item ${currentPage === pageNum ? "active" : ""}`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {pageNum}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      
                      
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>

      
      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedPackage}
        type="package"
        availableHotels={hotels}
      />
    </div>
  );
}

export default Packages;
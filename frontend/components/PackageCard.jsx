import { Link } from "react-router-dom";
import { Clock, MapPin, Star, Sparkles, CheckCircle2 } from "lucide-react";

function PackageCard({ packageData, onBook }) {
  if (!packageData) return null;

  return (
    <div className="travel-card">
      <div className="card-img-container">
        <img
          src={
            packageData.image ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
          }
          alt={packageData.title}
          loading="lazy"
        />
        <div className="card-badge-top-left d-flex align-items-center gap-1">
          <MapPin size={12} />
          <span>{packageData.destination}</span>
        </div>
        <div className="card-badge-top-right">
          {packageData.category || "Tour"}
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-direction-column justify-content-between flex-grow-1">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-1 text-muted small">
              <Clock size={14} />
              <span>{packageData.duration}</span>
            </div>
            <div className="rating-pill">
              <Star size={12} className="fill-warning" />
              <span>{packageData.rating || 4.8}</span>
            </div>
          </div>

          <h5 className="card-title fw-bold text-dark mb-2" style={{ minHeight: "48px" }}>
            {packageData.title}
          </h5>

          <p className="card-text text-muted small mb-3 text-truncate-2" style={{ minHeight: "40px" }}>
            {packageData.description?.slice(0, 95)}...
          </p>

          {packageData.placesToVisit && packageData.placesToVisit.length > 0 && (
            <div className="mb-3 d-flex flex-wrap gap-1">
              {packageData.placesToVisit.slice(0, 3).map((place, idx) => (
                <span key={idx} className="badge bg-light text-dark border small fw-normal">
                  📍 {place}
                </span>
              ))}
              {packageData.placesToVisit.length > 3 && (
                <span className="badge bg-light text-muted border small">
                  +{packageData.placesToVisit.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="pt-3 border-top mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="price-sub d-block">Starting from</span>
              <span className="price-tag">₹{packageData.price?.toLocaleString()}</span>
              <span className="small text-muted"> /person</span>
            </div>
            {packageData.includedHotels && packageData.includedHotels.length > 0 && (
              <span className="badge bg-info bg-opacity-10 text-primary small d-flex align-items-center gap-1">
                <CheckCircle2 size={12} /> Hotel Included
              </span>
            )}
          </div>

          <div className="d-grid gap-2 d-flex">
            <Link
              to={`/packages/${packageData._id}`}
              className="btn btn-outline-primary w-50 py-2 btn-sm fw-semibold"
            >
              Details
            </Link>
            <button
              className="btn btn-primary-custom w-50 py-2 btn-sm"
              onClick={() => onBook && onBook(packageData)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageCard;
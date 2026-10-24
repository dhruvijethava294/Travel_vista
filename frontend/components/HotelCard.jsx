import { Link } from "react-router-dom";
import { Star, MapPin, Clock, ShieldCheck, Bed } from "lucide-react";

function HotelCard({ hotel, onBook }) {
  if (!hotel) return null;

  const hotelId = hotel._id || "";
  const bedInfo =
    typeof hotel.roomSpecifications?.bedType === "string"
      ? hotel.roomSpecifications.bedType.split(" ")[0]
      : null;

  return (
    <div className="travel-card h-100 d-flex flex-column">
      {/* Hotel Image with Direct Link & Rating / Location Overlays */}
      <div className="card-img-container position-relative overflow-hidden">
        <Link to={`/hotels/${hotelId}`} className="d-block w-100 h-100">
          <img
            src={
              hotel.image ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
            }
            alt={hotel.name || "Hotel"}
            loading="lazy"
            className="w-100 h-100"
            style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
          />
        </Link>
        <div className="card-badge-top-left d-flex align-items-center gap-1">
          <MapPin size={12} />
          <span>{hotel.location || hotel.city || "Scenic Location"}</span>
        </div>
        <div className="card-badge-top-right d-flex align-items-center gap-1">
          <Star size={13} className="fill-warning text-warning" />
          <span className="fw-bold">{hotel.rating || 4.5}</span>
          <span className="opacity-75 small">({hotel.reviewsCount || 24})</span>
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column justify-content-between flex-grow-1">
        <div>
          {/* Room Category Pill */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-primary bg-opacity-10 text-primary small fw-semibold">
              {hotel.roomType || "Deluxe Suite"}
            </span>
            {bedInfo && (
              <span className="text-muted small d-inline-flex align-items-center gap-1">
                <Bed size={13} className="text-secondary" />
                <span>{bedInfo}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h5 className="card-title fw-bold text-dark mb-2">
            <Link
              to={`/hotels/${hotelId}`}
              className="text-dark text-decoration-none hover-primary"
            >
              {hotel.name}
            </Link>
          </h5>

          <p className="card-text text-muted small mb-3">
            {hotel.description
              ? `${hotel.description.slice(0, 90)}...`
              : "Luxury hotel accommodation with modern amenities."}
          </p>

          {/* New Fields: Check-in / Check-out Timings */}
          <div className="bg-light p-2 rounded-2 mb-2 d-flex align-items-center justify-content-between small text-muted border border-light-subtle">
            <span className="d-inline-flex align-items-center gap-1">
              <Clock size={13} className="text-primary" />
              <span>In: <strong>{hotel.checkInTime || "2:00 PM"}</strong></span>
            </span>
            <span>•</span>
            <span>Out: <strong>{hotel.checkOutTime || "11:00 AM"}</strong></span>
          </div>

          {/* New Field: Cancellation Policy Badge */}
          <div className="mb-3 d-flex align-items-center gap-1 small text-success">
            <ShieldCheck size={14} className="flex-shrink-0" />
            <span className="text-truncate" style={{ fontSize: "0.8rem" }}>
              {hotel.cancellationPolicy || "Free cancellation up to 48h"}
            </span>
          </div>

          {/* Amenities Badges */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-3">
              {hotel.amenities.slice(0, 3).map((amenity, i) => (
                <span
                  key={i}
                  className="badge bg-light text-secondary border small fw-normal"
                >
                  ✓ {amenity}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing, Availability and Navigation CTAs */}
        <div className="pt-3 border-top mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="price-sub d-block">Room per night</span>
              <span className="price-tag">₹{hotel.pricePerNight?.toLocaleString() || "5,000"}</span>
              <span className="small text-muted"> /night</span>
            </div>

            {/* New Field: Room Availability Counter */}
            <span
              className={`badge ${
                typeof hotel.availableRooms === "number" && hotel.availableRooms <= 5
                  ? "bg-danger bg-opacity-10 text-danger"
                  : "bg-success bg-opacity-10 text-success"
              } small px-2 py-1`}
            >
              {hotel.availableRooms != null
                ? `${hotel.availableRooms} rooms left`
                : "Available"}
            </span>
          </div>

          {/* Details & Book Now Action Buttons */}
          <div className="d-flex gap-2">
            <Link
              to={`/hotels/${hotelId}`}
              className="btn btn-outline-primary w-50 py-2 btn-sm fw-semibold d-flex align-items-center justify-content-center"
            >
              Details
            </Link>
            <button
              className="btn btn-primary-custom w-50 py-2 btn-sm fw-semibold"
              onClick={() => onBook && onBook(hotel)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;

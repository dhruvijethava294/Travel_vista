import { Star, MapPin, Wifi, Waves, Coffee, Utensils } from "lucide-react";

function HotelCard({ hotel, onBook }) {
  if (!hotel) return null;

  return (
    <div className="travel-card">
      <div className="card-img-container">
        <img
          src={
            hotel.image ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
          }
          alt={hotel.name}
          loading="lazy"
        />
        <div className="card-badge-top-left d-flex align-items-center gap-1">
          <MapPin size={12} />
          <span>{hotel.location}</span>
        </div>
        <div className="card-badge-top-right">
          ⭐ {hotel.rating || 4.5}
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column justify-content-between flex-grow-1">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title fw-bold text-dark mb-0">{hotel.name}</h5>
          </div>

          <p className="card-text text-muted small mb-3">
            {hotel.description?.slice(0, 95)}...
          </p>

          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-3">
              {hotel.amenities.slice(0, 4).map((amenity, i) => (
                <span key={i} className="badge bg-light text-secondary border small fw-normal">
                  ✓ {amenity}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-top mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="price-sub d-block">Room per night</span>
              <span className="price-tag">₹{hotel.pricePerNight?.toLocaleString()}</span>
              <span className="small text-muted"> /night</span>
            </div>
            <span className="badge bg-success bg-opacity-10 text-success small">
              Available
            </span>
          </div>

          <button
            className="btn btn-primary-custom w-100 py-2 btn-sm"
            onClick={() => onBook && onBook(hotel)}
          >
            Book Hotel Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { mockDestinations } from "../services/mockData";
import { MapPin, Calendar, Sparkles, ArrowRight, Video } from "lucide-react";

function Destinations() {
  const [destinations, setDestinations] = useState(mockDestinations);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const res = await api.get("/destinations");
        if (res.data && res.data.length > 0) {
          setDestinations(res.data);
        } else {
          setDestinations(mockDestinations);
        }
      } catch (err) {
        setDestinations(mockDestinations);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-2">
            🌍 Global Wonderlands
          </span>
          <h1 className="brand-font fw-bold">Explore Top Destinations</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            From tropical coastlines and snowy Himalayan peaks to European heritage and futuristic desert skylines.
          </p>
        </div>

        <div className="row g-4">
          {destinations.map((dest) => (
            <div className="col-lg-4 col-md-6" key={dest._id}>
              <div className="travel-card">
                <div className="card-img-container" style={{ height: "240px" }}>
                  <img src={dest.image} alt={dest.name} loading="lazy" />
                  <div className="card-badge-top-left">
                    📍 {dest.country}
                  </div>
                  {dest.bestTimeToVisit && (
                    <div className="card-badge-top-right d-flex align-items-center gap-1">
                      <Calendar size={12} />
                      <span>{dest.bestTimeToVisit}</span>
                    </div>
                  )}
                </div>

                <div className="card-body p-4 d-flex flex-column justify-content-between flex-grow-1">
                  <div>
                    <h4 className="fw-bold brand-font text-dark mb-2">{dest.name}</h4>
                    <p className="text-muted small mb-3">{dest.description}</p>

                    {dest.highlights && dest.highlights.length > 0 && (
                      <div className="mb-3">
                        <span className="text-muted small fw-bold d-block mb-1">
                          Key Highlights:
                        </span>
                        <div className="d-flex flex-wrap gap-1">
                          {dest.highlights.slice(0, 3).map((h, idx) => (
                            <span
                              key={idx}
                              className="badge bg-light text-dark border small fw-normal"
                            >
                              ✨ {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-top mt-auto d-flex justify-content-between align-items-center">
                    <Link
                      to={`/packages?destination=${dest.name}`}
                      className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    >
                      <span>View {dest.name} Packages</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Destinations;
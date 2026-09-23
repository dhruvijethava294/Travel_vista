import { useEffect, useState } from "react";
import api from "../services/api";
import { mockGalleryItems } from "../services/mockData";
import { Video, MapPin, PlayCircle } from "lucide-react";

function Videos() {
  const [videos, setVideos] = useState(mockGalleryItems.filter((i) => i.mediaType === "video"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await api.get("/gallery", { params: { mediaType: "video" } });
        if (res.data && res.data.length > 0) {
          setVideos(res.data);
        } else {
          setVideos(mockGalleryItems.filter((i) => i.mediaType === "video"));
        }
      } catch (err) {
        setVideos(mockGalleryItems.filter((i) => i.mediaType === "video"));
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold mb-2">
            🎥 Virtual Experiences
          </span>
          <h1 className="brand-font fw-bold">Destination Video Tours</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Immerse yourself in cinematic virtual tours, aerial drone flights, and travel documentaries before packing your bags.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="text-muted mt-2">Loading video tours...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="card text-center p-5 border-0 shadow-sm rounded-4">
            <Video size={48} className="mx-auto text-muted mb-3" />
            <h4>No Videos Available</h4>
            <p className="text-muted">Videos are being updated soon.</p>
          </div>
        ) : (
          <div className="row g-4">
            {videos.map((vid) => (
              <div className="col-lg-6" key={vid._id}>
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={vid.url}
                      title={vid.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary small">
                        {vid.category}
                      </span>
                      <span className="small text-muted d-flex align-items-center gap-1">
                        <MapPin size={13} /> {vid.destination}
                      </span>
                    </div>
                    <h5 className="fw-bold brand-font text-dark mb-2">{vid.title}</h5>
                    <p className="text-muted small mb-0">{vid.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Videos;
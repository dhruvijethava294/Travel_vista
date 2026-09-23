import { useEffect, useState } from "react";
import api from "../services/api";
import { mockGalleryItems } from "../services/mockData";
import { Image as ImageIcon, MapPin, X, ZoomIn } from "lucide-react";

function Gallery() {
  const [items, setItems] = useState(mockGalleryItems.filter((i) => i.mediaType === "image"));
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [activeModalImage, setActiveModalImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const params = { mediaType: "image" };
        if (category && category !== "All") params.category = category;
        const res = await api.get("/gallery", { params });

        if (res.data && res.data.length > 0) {
          setItems(res.data);
        } else {
          let filtered = mockGalleryItems.filter((i) => i.mediaType === "image");
          if (category && category !== "All") {
            filtered = filtered.filter((i) => i.category.toLowerCase() === category.toLowerCase());
          }
          setItems(filtered);
        }
      } catch (err) {
        let filtered = mockGalleryItems.filter((i) => i.mediaType === "image");
        if (category && category !== "All") {
          filtered = filtered.filter((i) => i.category.toLowerCase() === category.toLowerCase());
        }
        setItems(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [category]);

  const categories = ["All", "Beaches", "Mountains", "Heritage", "Luxury"];

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-2">
            📸 Visual Journey
          </span>
          <h1 className="brand-font fw-bold">TravelVista Photo Gallery</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Stunning snapshots from breathtaking destinations around the globe. Click on any image for full-screen inspection.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${
                category === cat ? "btn-primary" : "btn-outline-secondary"
              } rounded-pill px-4 py-2 fw-semibold`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading photo gallery...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="card text-center p-5 border-0 shadow-sm rounded-4">
            <ImageIcon size={48} className="mx-auto text-muted mb-3" />
            <h4>No Photos in this Category</h4>
            <p className="text-muted">Check out our other gallery categories.</p>
          </div>
        ) : (
          <div className="row g-4">
            {items.map((item) => (
              <div className="col-lg-4 col-md-6" key={item._id}>
                <div
                  className="travel-card position-relative overflow-hidden cursor-pointer"
                  style={{ height: "280px", cursor: "pointer" }}
                  onClick={() => setActiveModalImage(item)}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                  />
                  <div
                    className="position-absolute inset-0 d-flex flex-column justify-content-end p-3 text-white"
                    style={{
                      background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 70%)",
                      inset: 0,
                    }}
                  >
                    <span className="badge bg-warning text-dark align-self-start mb-1 small fw-bold">
                      {item.category}
                    </span>
                    <h6 className="fw-bold mb-1">{item.title}</h6>
                    <span className="small text-light opacity-90 d-flex align-items-center gap-1">
                      <MapPin size={12} /> {item.destination}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeModalImage && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.9)", zIndex: 1070 }}
          onClick={() => setActiveModalImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content bg-transparent border-0 text-white">
              <div className="text-end pe-3 pb-2">
                <button
                  className="btn btn-close btn-close-white"
                  onClick={() => setActiveModalImage(null)}
                ></button>
              </div>
              <div className="modal-body p-0 text-center">
                <img
                  src={activeModalImage.url}
                  alt={activeModalImage.title}
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxHeight: "75vh", objectFit: "contain" }}
                />
                <div className="mt-3">
                  <h4 className="fw-bold">{activeModalImage.title}</h4>
                  <p className="text-secondary small">
                    📍 {activeModalImage.destination} • Category: {activeModalImage.category}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
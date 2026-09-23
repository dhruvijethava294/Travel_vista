import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

function NotFound() {
  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center text-center">
      <div className="container">
        <div className="card shadow-sm border-0 rounded-4 p-5 bg-white max-w-700 mx-auto">
          <div className="text-primary mb-3">
            <Compass size={64} className="mx-auto" />
          </div>
          <h1 className="display-1 fw-bold text-dark brand-font">404</h1>
          <h3 className="fw-bold mb-3">Oops! You've Wandered Off the Map</h3>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "450px" }}>
            The destination or package page you are looking for might have been moved or doesn't exist.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-primary-custom d-flex align-items-center gap-2">
              <Home size={18} />
              <span>Back to Home</span>
            </Link>
            <Link to="/packages" className="btn btn-outline-secondary">
              Browse Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
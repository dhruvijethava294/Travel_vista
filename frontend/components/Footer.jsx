// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Component: Footer.jsx
// Description: Responsive footer with quick links, contact info,
// and MCA Academic Project credits.
// =========================================================================

import { Link } from "react-router-dom";
import { Compass, Mail, Phone, MapPin, Heart, GraduationCap } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand & Project Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Compass className="text-warning" size={32} />
              <h3 className="text-white mb-0 brand-font">
                Travel<span className="text-warning">Vista</span>
              </h3>
            </div>
            <p className="text-secondary small pe-lg-4">
              A comprehensive web-based Tourism Package Portal designed for exploring tour packages, viewing luxury hotels and scenic destinations, customized tour planning, and secure online reservations.
            </p>
            <div className="p-2 bg-secondary bg-opacity-25 rounded-3 d-inline-flex align-items-center gap-2 text-warning small">
              <GraduationCap size={18} />
              <span>MCA Academic Project • Full-Stack MERN Application</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="text-white mb-3">Quick Links</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/" className="text-secondary text-decoration-none hover-white">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/packages" className="text-secondary text-decoration-none">
                  Tour Packages
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/destinations" className="text-secondary text-decoration-none">
                  Destinations
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/hotels" className="text-secondary text-decoration-none">
                  Hotels & Resorts
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/plan-tour" className="text-secondary text-decoration-none text-warning">
                  Plan Custom Tour
                </Link>
              </li>
            </ul>
          </div>

          {/* Media & Support */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="text-white mb-3">Explore</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/gallery" className="text-secondary text-decoration-none">
                  Photo Gallery
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/videos" className="text-secondary text-decoration-none">
                  Virtual Tours
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-secondary text-decoration-none">
                  Contact & FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-secondary text-decoration-none">
                  User Login
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-secondary text-decoration-none">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white mb-3">Project Contact</h5>
            <ul className="list-unstyled small text-secondary">
              <li className="d-flex align-items-center gap-2 mb-2">
                <MapPin size={16} className="text-warning flex-shrink-0" />
                <span>Department of Computer Applications • MCA Project</span>
              </li>
              <li className="d-flex align-items-center gap-2 mb-2">
                <Mail size={16} className="text-warning flex-shrink-0" />
                <span>support@travelvista.com</span>
              </li>
              <li className="d-flex align-items-center gap-2 mb-2">
                <Phone size={16} className="text-warning flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
            <div className="mt-3 p-2 bg-secondary bg-opacity-10 rounded text-center small text-light">
              ⚡ Demo Credentials: <strong className="text-warning">admin@travelvista.com</strong> (Admin)
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} TravelVista Tourism Portal. MCA Academic Project.
          </p>
          <p className="mb-0 mt-2 mt-md-0 d-flex align-items-center gap-1">
            Built with <Heart size={14} className="text-danger fill-current" /> using React, Node.js, Express & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Compass,
  MapPin,
  Hotel,
  Package,
  Image,
  Video,
  CalendarCheck,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  PhoneCall,
} from "lucide-react";

function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand-custom" to="/" onClick={closeMenu}>
          <Compass className="text-warning" size={30} />
          <span>Travel</span>Vista
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 text-light"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navMenu">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/" onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/packages" onClick={closeMenu}>
                <Package size={16} className="me-1" />
                Packages
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/destinations" onClick={closeMenu}>
                <MapPin size={16} className="me-1" />
                Destinations
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/hotels" onClick={closeMenu}>
                <Hotel size={16} className="me-1" />
                Hotels
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/plan-tour" onClick={closeMenu}>
                <Compass size={16} className="me-1 text-warning" />
                Plan Tour
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/gallery" onClick={closeMenu}>
                <Image size={16} className="me-1" />
                Gallery
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/videos" onClick={closeMenu}>
                <Video size={16} className="me-1" />
                Videos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/contact" onClick={closeMenu}>
                <PhoneCall size={16} className="me-1" />
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Link
                  to="/my-bookings"
                  className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                  onClick={closeMenu}
                >
                  <CalendarCheck size={16} />
                  <span>My Bookings</span>
                </Link>

                <Link
                  to="/profile"
                  className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
                  onClick={closeMenu}
                >
                  <User size={16} />
                  <span>{user.name?.split(" ")[0]}</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="btn btn-sm btn-warning d-flex align-items-center gap-1 fw-bold text-dark"
                    onClick={closeMenu}
                  >
                    <ShieldCheck size={16} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/login"
                  className="btn btn-sm btn-outline-light px-3"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-sm btn-primary-custom px-3"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
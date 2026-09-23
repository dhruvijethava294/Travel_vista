import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Hotel,
  MapPin,
  CalendarCheck,
  Image,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

function AdminSidebar() {
  return (
    <div className="admin-sidebar d-flex flex-column justify-content-between h-100 rounded-3">
      <div>
        <div className="px-3 pb-3 mb-3 border-bottom border-secondary border-opacity-25">
          <h6 className="text-uppercase text-secondary fw-bold small mb-1 tracking-wider">
            Admin Console
          </h6>
          <span className="text-white fw-bold fs-5">Portal Control</span>
        </div>

        <nav className="nav flex-column gap-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active text-info" : ""}`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/packages"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active text-info" : ""}`
            }
          >
            <Package size={18} />
            <span>Tour Packages</span>
          </NavLink>

          <NavLink
            to="/admin/hotels"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active text-info" : ""}`
            }
          >
            <Hotel size={18} />
            <span>Hotels & Resorts</span>
          </NavLink>

          <NavLink
            to="/admin/destinations"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active text-info" : ""}`
            }
          >
            <MapPin size={18} />
            <span>Destinations</span>
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active text-info" : ""}`
            }
          >
            <CalendarCheck size={18} />
            <span>Bookings & Orders</span>
          </NavLink>

          <NavLink
            to="/admin/inquiries"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active text-info" : ""}`
            }
          >
            <MessageSquare size={18} />
            <span>Inquiries & Replies</span>
          </NavLink>

          <NavLink
            to="/admin/media"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active text-info" : ""}`
            }
          >
            <Image size={18} />
            <span>Photos & Videos</span>
          </NavLink>
        </nav>
      </div>

      <div className="pt-3 border-top border-secondary border-opacity-25 mt-4">
        <NavLink to="/" className="nav-link text-muted small d-flex align-items-center gap-2">
          <ArrowLeft size={16} />
          <span>Exit to Main Site</span>
        </NavLink>
      </div>
    </div>
  );
}

export default AdminSidebar;

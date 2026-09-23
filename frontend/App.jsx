import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// User Pages
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import Hotels from "./pages/Hotels";
import Destinations from "./pages/Destinations";
import PlanTour from "./pages/PlanTour";
import Gallery from "./pages/Gallery";
import Videos from "./pages/Videos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminPackage from "./pages/AdminPackage";
import AdminHotels from "./pages/AdminHotels";
import AdminDestinations from "./pages/AdminDestinations";
import AdminBookings from "./pages/AdminBookings";
import AdminInquiries from "./pages/AdminInquiries";
import AdminMedia from "./pages/AdminMedia";

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            {/* Public & Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id" element={<PackageDetails />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/plan-tour" element={<PlanTour />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Management Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/packages" element={<AdminPackage />} />
            <Route path="/admin/hotels" element={<AdminHotels />} />
            <Route path="/admin/destinations" element={<AdminDestinations />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/inquiries" element={<AdminInquiries />} />
            <Route path="/admin/media" element={<AdminMedia />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

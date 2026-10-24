import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Mail, Lock, Phone, MapPin, Compass, AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const { registerAccount } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      await registerAccount({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || "",
        address: data.address || "",
        role: "user",
      });

      setSuccessMsg("Account registered successfully! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setErrorMsg(error.message || "Registration failed. Please try again with a different email.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setValue("name", "Travel Explorer");
    setValue("email", `traveler${randomNum}@travelvista.com`);
    setValue("phone", "+91 98765 43210");
    setValue("address", "123 Palm Avenue, Bandra West, Mumbai");
    setValue("password", "password123");
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 bg-white">
              {/* Brand Logo */}
              <div className="text-center mb-4">
                <div className="d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-2">
                  <Compass size={36} />
                </div>
                <h3 className="brand-font fw-bold text-dark">Create Your Account</h3>
                <p className="text-muted small">Join thousands of travelers exploring the world with TravelVista</p>
              </div>

              {/* 1-Click Quick Fill Helper */}
              <div className="bg-light border rounded-3 p-3 mb-4 text-center">
                <span className="text-muted small fw-bold d-block mb-2">
                  🚀 Testing the Portal?
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-1"
                  onClick={handleQuickFill}
                >
                  <Sparkles size={14} /> Auto-Fill Registration Form
                </button>
              </div>

              {successMsg && (
                <div className="alert alert-success d-flex align-items-center gap-2 py-2 small mb-3">
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <User size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className={`form-control border-start-0 ${errors.name ? "is-invalid" : ""}`}
                      placeholder="e.g. Dhruvi Patel"
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>
                  {errors.name && <small className="text-danger">{errors.name.message}</small>}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Mail size={18} className="text-muted" />
                    </span>
                    <input
                      type="email"
                      className={`form-control border-start-0 ${errors.email ? "is-invalid" : ""}`}
                      placeholder="e.g. newuser@travelvista.com"
                      {...register("email", { required: "Email is required" })}
                    />
                  </div>
                  {errors.email && <small className="text-danger">{errors.email.message}</small>}
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Phone size={18} className="text-muted" />
                    </span>
                    <input
                      type="tel"
                      className="form-control border-start-0"
                      placeholder="e.g. +91 98765 43210"
                      {...register("phone")}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Residential / Street Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <MapPin size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className={`form-control border-start-0 ${errors.address ? "is-invalid" : ""}`}
                      placeholder="e.g. 123 Palm Avenue, Bandra West, Mumbai"
                      {...register("address", { required: "Address is required" })}
                    />
                  </div>
                  {errors.address && <small className="text-danger">{errors.address.message}</small>}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Password (min 6 characters)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Lock size={18} className="text-muted" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control border-start-0 border-end-0 ${errors.password ? "is-invalid" : ""}`}
                      placeholder="••••••••"
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                      })}
                    />
                    <button
                      type="button"
                      className="input-group-text bg-white border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <small className="text-danger">{errors.password.message}</small>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-3 fw-bold fs-6 mb-3"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Complete Registration"}
                </button>
              </form>

              <div className="text-center text-muted small mt-2">
                Already have an account?{" "}
                <Link to="/login" className="fw-bold text-primary text-decoration-none">
                  Login Here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
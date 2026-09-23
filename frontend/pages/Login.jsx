import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Lock, Mail, Compass, AlertCircle, Eye, EyeOff, ShieldCheck, User } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { loginAccount } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      const result = await loginAccount(data);

      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrorMsg(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setValue("email", "admin@travelvista.com");
    setValue("password", "admin123");
    try {
      setLoading(true);
      setErrorMsg("");
      await loginAccount({ email: "admin@travelvista.com", password: "admin123" });
      navigate("/admin");
    } catch (err) {
      setErrorMsg("Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoUser = async () => {
    setValue("email", "user@travelvista.com");
    setValue("password", "user123");
    try {
      setLoading(true);
      setErrorMsg("");
      await loginAccount({ email: "user@travelvista.com", password: "user123" });
      navigate("/");
    } catch (err) {
      setErrorMsg("User login failed");
    } finally {
      setLoading(false);
    }
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
                <h3 className="brand-font fw-bold text-dark">Welcome Back</h3>
                <p className="text-muted small">Sign in to manage your bookings and explore tours</p>
              </div>

              {/* Demo Credentials Helper Box */}
              <div className="bg-light border rounded-3 p-3 mb-4">
                <span className="text-muted small fw-bold d-block mb-2 text-uppercase">
                  ⚡ 1-Click Instant Demo Login:
                </span>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger w-50 d-flex align-items-center justify-content-center gap-1"
                    onClick={handleQuickDemoAdmin}
                    disabled={loading}
                  >
                    <ShieldCheck size={14} /> Admin Demo
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary w-50 d-flex align-items-center justify-content-center gap-1"
                    onClick={handleQuickDemoUser}
                    disabled={loading}
                  >
                    <User size={14} /> User Demo
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
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
                      placeholder="e.g. user@travelvista.com"
                      {...register("email", { required: "Email is required" })}
                    />
                  </div>
                  {errors.email && (
                    <small className="text-danger">{errors.email.message}</small>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label small fw-bold text-muted">Password</label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Lock size={18} className="text-muted" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control border-start-0 border-end-0 ${errors.password ? "is-invalid" : ""}`}
                      placeholder="••••••••"
                      {...register("password", { required: "Password is required" })}
                    />
                    <button
                      type="button"
                      className="input-group-text bg-white border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <small className="text-danger">{errors.password.message}</small>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-3 fw-bold fs-6 mb-3"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In to TravelVista"}
                </button>
              </form>

              <div className="text-center text-muted small mt-2">
                Don't have an account?{" "}
                <Link to="/register" className="fw-bold text-primary text-decoration-none">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
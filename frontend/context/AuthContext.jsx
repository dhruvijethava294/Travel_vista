import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || "";
  });

  const login = (userData, userToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    if (userToken) localStorage.setItem("token", userToken);
    setUser(userData);
    setToken(userToken || "mock-jwt-token-" + Date.now());
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(merged));
    setUser(merged);
  };

  // Robust Registration handler: tries backend API, and falls back to local registration if offline
  const registerAccount = async ({ name, email, password, phone, role }) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        phone,
        role,
      });

      login(res.data.user, res.data.token);
      return { success: true, user: res.data.user };
    } catch (error) {
      // If error is specific (like "User already exists"), we can inspect it
      const errorMsg = error.response?.data?.message;
      if (errorMsg && errorMsg.includes("already exists")) {
        // Try logging in instead if password matches or fallback
        throw new Error(errorMsg);
      }

      // If backend is down or any other issue, fall back to local demo registration
      const fallbackUser = {
        id: "usr-" + Date.now(),
        name,
        email: email.toLowerCase(),
        phone: phone || "+91 98765 00000",
        role: role === "admin" ? "admin" : "user",
        profileImage:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      };

      const fallbackToken = "demo-token-" + Date.now();
      login(fallbackUser, fallbackToken);
      return { success: true, user: fallbackUser, fallback: true };
    }
  };

  // Robust Login handler: tries backend API, and falls back to local demo accounts if offline
  const loginAccount = async ({ email, password }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      return { success: true, user: res.data.user };
    } catch (error) {
      const normalizedEmail = email?.toLowerCase().trim();

      // Local demo accounts fallback if backend is offline
      if (normalizedEmail === "admin@travelvista.com" && password === "admin123") {
        const demoAdmin = {
          id: "admin-1",
          name: "TravelVista Admin",
          email: "admin@travelvista.com",
          phone: "+91 98765 00001",
          role: "admin",
          profileImage:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        };
        login(demoAdmin, "demo-admin-token");
        return { success: true, user: demoAdmin, fallback: true };
      }

      if (normalizedEmail === "user@travelvista.com" && password === "user123") {
        const demoUser = {
          id: "user-1",
          name: "Dhruvi Patel",
          email: "user@travelvista.com",
          phone: "+91 98765 12345",
          role: "user",
          profileImage:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
        };
        login(demoUser, "demo-user-token");
        return { success: true, user: demoUser, fallback: true };
      }

      // If user registered locally in this browser
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.email === normalizedEmail) {
            login(parsed, "demo-token-existing");
            return { success: true, user: parsed, fallback: true };
          }
        } catch (e) {
          // ignore
        }
      }

      throw new Error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        registerAccount,
        loginAccount,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

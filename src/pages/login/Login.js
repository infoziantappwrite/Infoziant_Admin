import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Images/Logo.png";
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/authenticate`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.authenticated) {
          navigate("/jobs"); // Redirect if authenticated
        } else {
          setLoading(false); // Show login form if not authenticated
        }
      } catch (error) {
        setLoading(false);
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setMessage({ text: data.message || "Login successful!", type: "success" });

      setTimeout(() => {
        navigate("/jobs");
      }, 1500);
    } catch (error) {
      setMessage({ text: "Something went wrong", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="w-full max-w-md p-1 space-y-6 bg-white rounded-lg shadow-lg
             border-1 border-transparent
             bg-gradient-to-r from-blue-500 to-teal-500
             bg-origin-border
             bg-clip-padding
             relative"
      >
        <div className="bg-white rounded-md p-6">
          {message.text && (
            <div
              className={`p-3 mt-4 text-center text-sm font-semibold rounded-md ${
                message.type === "success"
                  ? "bg-green-600 text-white border border-green-700"
                  : "bg-red-500 text-white border border-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-center">
            <img src={logo} alt="SMi Admin Logo" className="w-48 h-18" />
          </div>

          <h2 className="text-xl font-semibold text-center text-gray-900">
            Sign in to your account
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white bg-gradient-to-r from-blue-600 to-teal-600 rounded-md hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Sign Me In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

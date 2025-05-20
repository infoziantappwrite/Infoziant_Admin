import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../Images/Logo.png";
import {
  FaUserCircle,
  FaBriefcase,
  FaFileAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL;

      const response = await fetch(`${baseURL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        navigate("/login"); // Redirect to login after logout
      } else {
        alert("Logout failed, please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed, please try again.");
    }
  };

  // Gradient text style for active & hover links

  return (
    <header className=" bg-white shadow-lg ">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-44 h-auto" />
        </div>

        {/* Right side navigation */}
        <nav className="flex items-center space-x-6">

        
          

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none"
              aria-label="User menu"
            >
              <FaUserCircle className="text-3xl text-gray-700 hover:text-blue-600 transition" />
            </button>

            {dropdownOpen && (
              <div className="absolute  right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg py-0 text-gray-800 z-[10]">
                <NavLink
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="border-b border-gray-300 px-4 py-2 hover:bg-gradient-to-r hover:from-blue-800 hover:to-teal-500 hover:text-white transition flex items-center gap-2"
                >
                  <FaUserCircle /> Profile
                </NavLink>

                <NavLink
                  to="/jobs"
                  onClick={() => setDropdownOpen(false)}
                  className="border-b border-gray-300 px-4 py-2 hover:bg-gradient-to-r hover:from-blue-800 hover:to-teal-500 hover:text-white transition flex items-center gap-2"
                >
                  <FaBriefcase /> Jobs
                </NavLink>

                <NavLink
                  to="/applications"
                  onClick={() => setDropdownOpen(false)}
                  className="border-b border-gray-300 px-4 py-2 hover:bg-gradient-to-r hover:from-blue-800 hover:to-teal-500 hover:text-white transition flex items-center gap-2"
                >
                  <FaFileAlt /> Applications
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gradient-to-r hover:bg-red-500 hover:text-white transition flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu toggle */}
        
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg px-6 py-4 space-y-4">
          <NavLink
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 hover:text-white px-4 py-2 rounded transition"
          >
            <FaBriefcase /> Jobs
          </NavLink>

          <NavLink
            to="/applications"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 hover:text-white px-4 py-2 rounded transition"
          >
            <FaFileAlt /> Applications
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 hover:text-white px-4 py-2 rounded transition"
          >
            <FaUserCircle /> Profile
          </NavLink>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 hover:text-white px-4 py-2 rounded transition w-full"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

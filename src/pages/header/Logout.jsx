import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwriteConfig"; // Ensure correct import path
import { useUser } from "../../contexts/UserContext";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useUser(); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await account.deleteSession("current"); // Logout from Appwrite
        setUser(null); // Clear user context
        setMessage("Logout successful! Redirecting...")
        navigate("/"); 

      } catch (error) {
        console.error("Logout failed:", error);
        setMessage("Logout failed. Please try again.");
      }
    };

    logoutUser();
  }, [navigate, setUser]);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-white">
      <p className="text-lg font-semibold">{message || "Logging out..."}</p>
    </div>
  );
};

export default Logout;

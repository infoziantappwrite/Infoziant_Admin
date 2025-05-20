import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
    const baseURL = process.env.REACT_APP_API_BASE_URL;

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseURL}/api/auth/profile`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
      } catch (err) {
        showNotification(err.message || "Error loading profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const showNotification = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  

  const handleChangePassword = async (e) => {
    e.preventDefault();
    showNotification("", "");
    if (!oldPassword) {
      showNotification("Old password is required.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification("Passwords do not match.", "error");
      return;
    }
    try {
      const res = await fetch(`${baseURL}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword,confirmPassword }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update password");
      }
      showNotification("Password updated successfully!", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangingPassword(false);
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900">
        No user logged in
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen  p-4">
      {/* Notification */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
            message.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      <div
        className="w-full max-w-3xl p-8 bg-white rounded-2xl
        border-4 border-gradient-to-r from-purple-400 via-pink-500 to-red-500
        shadow-lg
        grid gap-6 sm:grid-cols-1 "
        
      >
        {!editing ? (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Profile</h2>
            <div className="space-y-3 text-gray-800 text-lg">
              <p>
                <span className="font-semibold">User ID:</span> {user.username}
              </p>
              <p>
                <span className="font-semibold">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              
            </div>
            <div className="flex gap-4 mt-8">
             
              <button
                className="px-6 py-2 font-semibold rounded-md
               px-6 py-2 font-semibold rounded-md
                bg-gradient-to-r from-blue-800 to-teal-500
                text-white shadow-md hover:brightness-110 transition shadow-md hover:bg-gray-300 transition"
                onClick={() => setChangingPassword(!changingPassword)}
              >
                {changingPassword ? "Cancel Password Change" : "Change Password"}
              </button>
            </div>
          </>
        ) : (
          <form className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Edit Profile</h2>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Current Password (required)
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 font-semibold rounded-md
               
                bg-gradient-to-r from-blue-500 via-teal-500 to-green-300
                text-white shadow-md hover:brightness-110 transition
                text-white shadow-md hover:brightness-110 transition"
              >
                Save
              </button>
              <button
                type="button"
                className="px-6 py-3 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                onClick={() => {
                  setEditing(false);
                  setName(user.name);
                  setEmail(user.email);
                  setCurrentPassword("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {changingPassword && (
          <form onSubmit={handleChangePassword} className="space-y-6 mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Change Password</h2>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 font-semibold rounded-md
                bg-gradient-to-r  from-blue-800 to-teal-500 
                text-white shadow-md hover:brightness-110 transition"
              >
                Change Password
              </button>
              <button
                type="button"
                className="px-6 py-3 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                onClick={() => {
                  setChangingPassword(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;

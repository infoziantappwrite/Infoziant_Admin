import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../header/Loader";
import {
  CheckCircle,
  Download,
  Share2,
  PhoneCall,
  ArrowLeft,
  FileText,
  Eye,
} from "lucide-react";

const Detail = ({ label, value, color = "text-gray-800" }) => (
  <div>
    <p className="text-md font-bold text-gray-500 uppercase tracking-wide">{label}</p>
    <p className={`font-semibold test-sm mt-1 ${color}`}>{value}</p>
  </div>
);

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Pending");
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/applications/${applicationId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setApplication(data);
        setStatus(data.status);
      } catch (error) {
        console.error("Error fetching application details:", error);
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [applicationId, API_BASE]);

  const handleShare = () => {
    if (!application) return;
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this profile",
          text: "Here is the candidate's profile:",
          url: application.resumeUrl,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  const markAsViewed = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "Viewed" }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setStatus("Viewed");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return <Loader />;
  if (!application)
    return (
      <p className="text-center text-gray-500 mt-8">Application not found.</p>
    );

  return (
    <div className="p-6 min-h-screen text-gray-800">
  <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
    
    {/* Header */}
    <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-800 to-teal-600 text-white">
      <div className="p-3 bg-white bg-opacity-20 rounded-full">
        <FileText size={28} />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Application for <span className="capitalize">{application.jobtitle}</span></h1>
        <p className="text-sm opacity-80">{new Date(application.appliedAt).toLocaleString()}</p>
      </div>
    </div>

    {/* Applicant Info */}
    <div className="grid md:grid-cols-2 gap-6 px-6 py-8 bg-gray-50">
      <div>
        <h2 className="text-lg font-semibold text-blue-800 mb-1">{application.applicantName}</h2>
        <p className="text-md text-gray-600">{application.email}</p>
        <p className="text-md text-gray-600">{application.currentDesignation}</p>
      </div>
      <div className="space-y-1 text-md text-gray-700">
        <p><strong>Phone:</strong> {application.phone}</p>
        <p><strong>Gender:</strong> {application.gender}</p>
        <p><strong>Date of Birth:</strong> {application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString() : "N/A"}</p>
      </div>
    </div>

    {/* Details Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-6 py-6 border-t border-gray-200 bg-white text-sm text-gray-800">
      <Detail label="Experience" value={`${application.experience || "N/A"} years`} />
      <Detail label="Qualification" value={application.qualification || "N/A"} />
      <Detail label="Languages" value={application.languages || "N/A"} />
      <Detail label="Current CTC" value={application.currentCTC || "N/A"} />
      <Detail label="Expected CTC" value={application.expectedCTC || "N/A"} />
      <Detail label="Key Skills" value={application.keySkills?.join(", ") || "N/A"} />
      <Detail label="Current Address" value={application.currentAddress || "N/A"} />
      <Detail label="Permanent Address" value={application.permanentAddress || "N/A"} />
      <Detail label="Reason for Interest" value={application.whyInterested || "N/A"} />
      <Detail label="Resume Link" value={application.resume || "N/A"} />
      <Detail label="Status" value={status} color={status === "Viewed" ? "text-green-600" : "text-yellow-600"} />
    </div>

    {/* Action Buttons */}
    <div className="flex flex-wrap items-center gap-3 px-6 py-5 bg-gray-50 border-t border-gray-200">
      <button onClick={() => navigate("/applications")} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition">
        <ArrowLeft size={18} /> Back
      </button>

      {application.resumeUrl && (
        <>
          <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-800 to-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <Eye size={18} /> View Resume
          </a>

          <a href={application.resumeUrl} download
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <Download size={18} /> Download Resume
          </a>
        </>
      )}

      <button onClick={handleShare}
        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
        <Share2 size={18} /> Share
      </button>

      <a href={`tel:${application.phone}`}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
        <PhoneCall size={18} /> Call
      </a>

      {status !== "Viewed" && (
        <button onClick={markAsViewed}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
          <CheckCircle size={18} /> Mark as Viewed
        </button>
      )}
    </div>
  </div>
</div>

  );
};

export default ApplicationDetails;

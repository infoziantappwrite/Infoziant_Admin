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
          url: application.resumeUrl, // Assuming your API sends a resumeUrl field
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
      <p className="text-center text-gray-400 mt-8">Application not found.</p>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold flex items-center gap-3 text-cyan-400">
          <FileText size={28} />
          Job Application for <span className="capitalize">{application.jobtitle}</span>
        </h1>

        <div className="border-b border-gray-700 py-4 mt-6">
          <h2 className="text-xl font-semibold">{application.applicantName}</h2>
          <p className="text-gray-300">{application.email}</p>
          <p className="text-gray-300">{application.currentDesignation}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <p><strong>Phone:</strong> {application.phone}</p>
          <p><strong>Gender:</strong> {application.gender}</p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString() : "N/A"}
          </p>
          <p><strong>Experience:</strong> {application.experience || "N/A"} years</p>
          <p><strong>Qualification:</strong> {application.qualification || "N/A"}</p>
          <p><strong>Languages:</strong> {application.languages || "N/A"}</p>
          <p><strong>Current CTC:</strong> {application.currentCTC || "N/A"}</p>
          <p><strong>Expected CTC:</strong> {application.expectedCTC || "N/A"}</p>
          <p><strong>Key Skills:</strong> {application.keySkills?.join(", ") || "N/A"}</p>
          <p><strong>Current Address:</strong> {application.currentAddress || "N/A"}</p>
          <p><strong>Permanent Address:</strong> {application.permanentAddress || "N/A"}</p>
          <p><strong>Reason for Interest:</strong> {application.whyInterested || "N/A"}</p>
          <p><strong>Applied At:</strong> {new Date(application.appliedAt).toLocaleString()}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={
                status === "Viewed"
                  ? "text-green-400 font-semibold"
                  : "text-yellow-400 font-semibold"
              }
            >
              {status}
            </span>
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/applications")}
            className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <ArrowLeft size={18} />
            Back to Applications
          </button>

          {application.resumeUrl && (
            <>
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded flex items-center gap-2 transition"
              >
                <Eye size={18} />
                View Resume
              </a>

              <a
                href={application.resumeUrl}
                download
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 transition"
              >
                <Download size={18} />
                Download Resume
              </a>
            </>
          )}

          <button
            onClick={handleShare}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <Share2 size={18} />
            Share
          </button>

          <a
            href={`tel:${application.phone}`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <PhoneCall size={18} />
            Call
          </a>

          {status !== "Viewed" && (
            <button
              onClick={markAsViewed}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition"
            >
              <CheckCircle size={18} />
              Mark as Viewed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;

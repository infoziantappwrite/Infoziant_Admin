import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../header/Loader";

const JobDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/jobs/${id}`);
        if (!response.ok) throw new Error("Job not found");
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <Loader />;
  if (!job) return <p className="text-center text-red-500">Job not found</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-teal-500 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">{job.jobTitle}</h1>
        <p className="text-sm mt-1">{job.organizationName} • {job.Location}</p>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-8">
        {/* Left: Job Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="border-l-4 border-blue-800 bg-gray-50 p-5 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-2">Job Description</h2>
            <ul className="list-disc pl-5 space-y-1">
              {job.description?.split("\n").map((line, index) => (
                <li key={index}>{line.trim()}</li>
              ))}
            </ul>
          </div>

          {/* Details */}
          <div className="border-l-4 border-teal-500 bg-gray-50 p-5 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-2">Job Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Type:</strong> {job.employmentType}</p>
              <p><strong>Industry:</strong> {job.industry}</p>
              <p><strong>Location Type:</strong> {job.jobLocationType}</p>
              <p><strong>Working Hours:</strong> {job.workingHours}</p>
              <p><strong>Salary:</strong> {job.salaryRange}</p>
              <p><strong>Vacancy:</strong> {job.Vacancy}</p>
              <p><strong>Skills:</strong> {job.skills}</p>
              <p><strong>Qualifications:</strong> {job.qualifications}</p>
              <p><strong>Organization:</strong> {job.organizationName}</p>
              <p><strong>Location:</strong> {job.Location}</p>
            </div>
          </div>
        </div>

        {/* Right: Sticky Panel */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Organization Info */}
            <div className="bg-gray-50 p-5 border border-blue-800 rounded-md shadow">
              <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
              <p><strong>Posted By:</strong> {job.postedBy}</p>
              <p><strong>Date Posted:</strong> {new Date(job.datePosted).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(job.End_date).toLocaleDateString()}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`font-semibold ${job.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                  {job.status}
                </span>
              </p>
              <p><strong>Organization:</strong> {job.organizationName}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/jobs")}
                className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-md"
              >
                Back to Jobs
              </button>
              <button
                onClick={() => navigate(`/edit-job/${job._id}`)}
                className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md"
              >
                Edit Job
              </button>
              <button
                onClick={() => navigate(`/applications/${id}`)}
                className="bg-gradient-to-r from-blue-800 to-teal-500 text-white py-2 px-4 rounded-md"
              >
                View Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

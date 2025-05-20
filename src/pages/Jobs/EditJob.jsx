import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import Loader from "../header/Loader";

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/jobs/${id}`);
        const formattedDate = response.data.End_date
          ? response.data.End_date.split("T")[0]
          : "";
        setJob({ ...response.data, End_date: formattedDate });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job:", error);
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${baseUrl}/api/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // if your API uses cookies for session
      body: JSON.stringify(job),
    });

    if (!res.ok) {
      throw new Error("Failed to update job");
    }

    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      navigate(`/job-detail/${id}`);
    }, 3000);
  } catch (error) {
    console.error("Error updating job:", error);
    alert("Failed to update job.");
  }
};


  if (loading) return <Loader />;
  if (!job)
    return <p className="text-black text-center mt-4">Job not found!</p>;

  return (
    <div className=" min-h-screen text-black flex flex-col items-center py-6">
      {showConfirmation && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle size={24} />
          Job Updated Successfully!
        </div>
      )}
      <h2 className="text-3xl font-semibold text-blue-800  px-6 py-2 rounded  mb-2">
        Edit Job
      </h2>

     
       

        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-md w-full max-w-6xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Job Title", name: "jobTitle" },
              { label: "Organization Name", name: "organizationName" },
              { label: "Industry", name: "industry" },
              { label: "Location", name: "Location" },
              { label: "Salary Range", name: "salaryRange" },
              { label: "Qualification", name: "qualifications" },
              { label: "Skills Required", name: "skills" },
              { label: "Working Hours", name: "workingHours" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-2">{label} *</label>
                <input
                  type="text"
                  name={name}
                  value={job[name]}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Employment Type *</label>
              <select
                name="employmentType"
                value={job.employmentType}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Intern">Intern</option>
              </select>
            </div>

            {/* Job Location Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Job Location Type *</label>
              <select
                name="jobLocationType"
                value={job.jobLocationType}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                <option value="On-Site">On-Site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-medium mb-2">Application Deadline *</label>
              <input
                type="date"
                name="End_date"
                value={job.End_date}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <select
                name="status"
                value={job.status}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={job.description}
                onChange={handleChange}
                rows="2"
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Vacancy */}
            <div>
              <label className="block text-sm font-medium mb-2">Vacancy *</label>
              <input
                type="number"
                name="Vacancy"
                value={job.Vacancy}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-5 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      
    </div>
  );
};

export default EditJob;

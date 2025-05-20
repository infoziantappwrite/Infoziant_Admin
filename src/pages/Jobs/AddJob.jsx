import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const AddJob = () => {
  const navigate = useNavigate();
  const [currentUsername, setCurrentUsername] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const initialJobState = {
    jobTitle: "",
    organizationName: "",
    Vacancy: "",
    description: "",
    employmentType: "",
    industry: "",
    qualifications: "",
    End_date: "",
    skills: "",
    workingHours: "",
    jobLocationType: "",
    Location: "",
    salaryRange: "",
  };

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/profile`, {
          method: "GET",
          credentials: "include", // if using cookies/session
        });
        const data = await res.json();
        //console.log("User Data:", data);
        setCurrentUsername(data.name);

      } catch (error) {

        console.error("Error fetching user data:", error);
      }
    };
    getUser();
  }, [API_BASE]);

  const [job, setJob] = useState(initialJobState);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobToSubmit = {
        ...job,
        postedBy: currentUsername,
        status:"Active" // Ensure postedBy has correct user
      };


      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(jobToSubmit),
      });

      const data = await res.json();

      if (res.ok) {
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
         
        }, 3000);
      } else {
        console.error("Error:", data.error);
        alert("Failed to Post Job. Check console for details.");
      }
    } catch (error) {
      console.error("Error Posting Job:", error);
      alert("Failed to Post Job. Check console for details.");
    }
  };

  return (
    <div className=" text-black flex flex-col items-center py-6">
      {showConfirmation && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle size={24} />
          Job Posted Successfully!
        </div>
      )}

      <h2 className="text-3xl font-semibold text-blue-800  px-6 py-2 rounded  mb-4">
        Post a New Job
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-6 rounded-lg shadow-md w-full max-w-6xl border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={job.jobTitle}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>

          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Organization Name *</label>
            <input
              type="text"
              name="organizationName"
              value={job.organizationName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>

          {/* Vacancy */}
          <div>
            <label className="block text-sm font-medium mb-2">Vacancy *</label>
            <input
              type="text"
              name="Vacancy"
              value={job.Vacancy}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium mb-2">Description *</label>
              <p className="text-xs text-gray-500 mb-1">
                {job.description.length} / 1000
              </p>
            </div>
            <textarea
              name="description"
              value={job.description}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  handleChange(e);
                }
              }}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            ></textarea>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Employment Type *</label>
            <select
              name="employmentType"
              value={job.employmentType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            >
              <option value="">Select</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium mb-2">Industry *</label>
            <input
              type="text"
              name="industry"
              value={job.industry}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-medium mb-2">Qualifications *</label>
            <input
              type="text"
              name="qualifications"
              value={job.qualifications}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium mb-2">End Date *</label>
            <input
              type="date"
              name="End_date"
              value={job.End_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-2">Skills *</label>
            <input
              type="text"
              name="skills"
              value={job.skills}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>

          {/* Working Hours */}
          <div>
            <label className="block text-sm font-medium mb-2">Working Hours *</label>
            <input
              type="text"
              name="workingHours"
              value={job.workingHours}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>

          {/* Job Location Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Job Location Type *</label>
            <select
              name="jobLocationType"
              value={job.jobLocationType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            >
              <option value="">Select</option>
              <option value="On-Site">On-Site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <input
              type="text"
              name="Location"
              value={job.Location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Salary Range *</label>
            <input
              type="text"
              name="salaryRange"
              value={job.salaryRange}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
          >
            Back to Jobs
          </button>
          <button
            type="button"
            onClick={() => setJob(initialJobState)}
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
          >
            Clear
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>

  );
};

export default AddJob;

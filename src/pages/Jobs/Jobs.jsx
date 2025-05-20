import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Trash2,
  List,
  Plus,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Search,
  Edit,
} from "lucide-react";
import Loader from "../header/Loader";

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [filters, setFilters] = useState({ type: "", status: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMode, setDeleteMode] = useState("");
  const [jobToDelete, setJobToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  const jobsPerPage = 10;

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/jobs`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
     // console.log("Jobs Data:", data);
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);



  const handleDeleteClick = (id) => {
    setDeleteMode("single");
    setJobToDelete(id);
    setShowDeleteConfirm(true);
  };



  const confirmDelete = async () => {
    console.log("Deleting job with ID:", jobToDelete);
    setLoading(true);
    try {
      if (deleteMode === "single" && jobToDelete) {
        console.log("Deleting job with ID:", jobToDelete);
        const res = await fetch(`${API_BASE}/api/jobs/${jobToDelete}`, { method: "DELETE", credentials: "include", });
        if (!res.ok) throw new Error("Failed to delete job");
        setJobs((prev) => prev.filter((job) => job.id !== jobToDelete));
        setSelectedJobs((prev) => prev.filter((id) => id !== jobToDelete));
      } else if (deleteMode === "multiple") {
        await Promise.all(
          selectedJobs.map((jobId) => fetch(`/api/jobs/${jobId}`, { method: "DELETE" }))
        );
        setJobs((prev) => prev.filter((job) => !selectedJobs.includes(job.id)));
        setSelectedJobs([]);
      }
      setShowDeleteConfirm(false);
      setJobToDelete(null);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting jobs:", error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const filteredJobs = jobs.filter((job) =>
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filters.type ? job.employmentType === filters.type : true) &&
    (filters.status ? job.status === filters.status : true)
  );

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);


  if (loading) return <Loader />;

  return (
    <div className="p-6  min-h-screen text-gray-800">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-teal-500 bg-clip-text text-transparent flex items-center gap-2">
  <span className="text-blue-800">
    <List size={28} />
  </span>
  Job List
</h1>


        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search job position..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-Time</option>
            <option value="Part-time">Part-Time</option>
            <option value="Intern">Intern</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={() => navigate("/addjob")}
            className="bg-gradient-to-r from-blue-800  to-teal-500 text-white px-4 py-2 rounded-lg font-medium shadow hover:brightness-110 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Job
          </button>


        </div>
      </div>

      {currentJobs.length > 0 ? (
        <>
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="w-full text-sm text-center">
              <thead className="bg-gradient-to-r from-blue-800 to-teal-500 text-white">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Position</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 hidden sm:table-cell">Posted</th>
                  <th className="p-3 hidden sm:table-cell">Last Date</th>
                  <th className="p-3 hidden sm:table-cell">Vacancy</th>
                  <th className="p-3">Created By</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentJobs.map((job, index) => (
                  <tr key={job.id || index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{indexOfFirstJob + index + 1}</td>
                    <td className="p-3 font-medium">{job.jobTitle}</td>
                    <td className="p-3">{job.employmentType}</td>
                    <td className="p-3 hidden sm:table-cell">
                      {job.datePosted ? new Date(job.datePosted).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      {job.End_date ? new Date(job.End_date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-3 hidden sm:table-cell">{job.Vacancy}</td>
                    <td className="p-3">{job.postedBy || "Unknown"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${job.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="p-2 flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/job-detail/${job._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                       <button
                        onClick={() => navigate(`/edit-job/${job._id}`)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(job._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
              <ChevronsLeft />
            </button>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <ChevronLeft />
            </button>
            <span className="font-semibold">{currentPage}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              <ChevronRight />
            </button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
              <ChevronsRight />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">No jobs found.</p>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              {deleteMode === "single" ? "this job?" : `${selectedJobs.length} jobs?`}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;

import React, { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import {
  Eye,
  Trash2,
  List,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Search,
} from "lucide-react";
import Loader from "../header/Loader";

const Applications = () => {
  const navigate = useNavigate();
   const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  const appsPerPage = 10;

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/applications`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log("Applications data:", data);
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredByJobId = jobId
    ? applications.filter((app) => app.jobId === jobId)
    : applications;

  // Then filter by search term on jobtitle (case-insensitive)
  const filteredApps = filteredByJobId.filter((app) =>
    app.jobtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastApp = currentPage * appsPerPage;
  const indexOfFirstApp = indexOfLastApp - appsPerPage;
  const currentApps = filteredApps.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(filteredApps.length / appsPerPage);

  const handleDeleteClick = (id) => {
    setApplicationToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!applicationToDelete) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/applications/${applicationToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      setApplications((prev) =>
        prev.filter((app) => app._id !== applicationToDelete)
      );
    } catch (error) {
      console.error("Error deleting application:", error);
    }
    setLoading(false);
    setShowDeleteConfirm(false);
    setApplicationToDelete(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 min-h-screen text-gray-800">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-teal-500 bg-clip-text text-transparent flex items-center gap-2">
          <List size={28} className="text-blue-800" />
          Applications
        </h1>

        <div className="relative w-full md:w-72 z-[0] ">
          <input
            type="text"
            placeholder="Search by job tittle"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {currentApps.length > 0 ? (
        <>
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="w-full text-sm text-center">
              <thead className="bg-gradient-to-r from-blue-800 to-teal-500 text-white">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Job Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentApps.map((app, index) => (
                  <tr key={app._id || index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{indexOfFirstApp + index + 1}</td>
                    <td className="p-3 font-medium">{app.applicantName}</td>
                    <td className="p-3">{app.email}</td>
                    <td className="p-3">{app.phone}</td>
                    <td className="p-3">{app.jobtitle}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          app.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-2 flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/application/${app._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(app._id)}
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
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft />
            </button>
            <span className="font-semibold">{currentPage}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              <ChevronsRight />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">No applications found.</p>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this application?</p>
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

export default Applications;

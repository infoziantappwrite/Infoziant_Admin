import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Login from "./pages/login/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import Header from "./pages/header/Header";
import Profile from "./pages/header/Profile";
import AddJob from "./pages/Jobs/AddJob";
import Jobs from "./pages/Jobs/Jobs";
import JobDetails from "./pages/Jobs/JobDetails";
import EditJob from "./pages/Jobs/EditJob";
import Loader from "./pages/header/Loader";
import Applications from "./pages/Applications/Applications";
import ApplicationDetails from "./pages/Applications/ApplicationDetails";

function PagePlaceholder() {
  const { "*": page } = useParams();
  const pageName = page ? page.split("/")[0] : "";
  const displayName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className="p-8 text-3xl font-bold text-center">
      {displayName || "Page Not Found"}
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Login Route: no header */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes with Header */}
      <Route
        path="/*"
        element={
          <>
            <Header />
            <Routes>
              <Route
                path="jobs"
                element={
                  <ProtectedRoute>
                    <Jobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="applications"
                element={
                  <ProtectedRoute>
                    <Applications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="applications/:jobId"
                element={
                  <ProtectedRoute>
                    <Applications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="application/:applicationId"
                element={
                  <ProtectedRoute>
                    <ApplicationDetails />
                  </ProtectedRoute>
                }
              />


              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="addjob"
                element={
                  <ProtectedRoute>
                    <AddJob />
                  </ProtectedRoute>
                }
              />

              <Route
                path="job-detail/:id"
                element={
                  <ProtectedRoute>
                    <JobDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit-job/:id"
                element={
                  <ProtectedRoute>
                    <EditJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="loader"
                element={
                  <ProtectedRoute>
                    <Loader />
                  </ProtectedRoute>
                }
              />
              {/* Catch all */}
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <PagePlaceholder />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </>
        }
      />
    </Routes>
  );
}

export default App;

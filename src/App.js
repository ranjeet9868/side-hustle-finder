// src/App.js
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import DashboardLayout from "./DashboardLayout";
import DashboardHome from "./DashboardHome";
import JobPosting from "./JobPosting";
import JobList from "./JobList";
import ApplicationList from "./ApplicationList";
import MyJobResponses from "./MyJobResponses";
import Chat from "./Chat";
import EditJob from "./EditJob";

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/login"
        element={
          token ? (
            <Navigate to="/dashboard" />
          ) : (
            <AuthForm onAuthSuccess={setToken} />
          )
        }
      />
      {/* Dashboard layout with nested routes */}
      <Route
        path="/dashboard"
        element={token ? <DashboardLayout /> : <Navigate to="/login" />}
      >
        {/* index route -> DashboardHome */}
        <Route index element={<DashboardHome token={token} />} />
        <Route path="post-job" element={<JobPosting token={token} />} />
        <Route path="listings" element={<JobList token={token} />} />
        <Route
          path="applications"
          element={<ApplicationList token={token} />}
        />
        <Route
          path="view-responses"
          element={<MyJobResponses token={token} />}
        />
        <Route path="chat" element={<Chat token={token} />} />
        <Route path="edit-job/:jobId" element={<EditJob token={token} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

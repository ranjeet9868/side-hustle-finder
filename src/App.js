// src/App.js
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./pages/auth/AuthForm";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import JobList from "./pages/jobs/JobList";
import ApplicationList from "./pages/jobs/ApplicationList";
import MyJobResponses from "./pages/jobs/MyJobResponses";
import JobPosting from "./pages/jobs/JobPosting";
import EditJob from "./pages/jobs/EditJob";
import Chat from "./pages/chat/Chat";
import ChatList from "./pages/chat/ChatList";
import PosterPaymentPage from "./pages/payment/PosterPaymentPage";
import ShovelerPaymentPage from "./pages/payment/ShovelerPaymentPage";

export default function App() {
  // Initialize token from localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

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
            <AuthForm onAuthSuccess={handleAuthSuccess} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          token ? (
            <DashboardLayout token={token} setToken={setToken} />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
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
        <Route path="edit-job/:jobId" element={<EditJob token={token} />} />
        <Route path="chat" element={<Chat token={token} />} />
        <Route path="chatlist" element={<ChatList token={token} />} />
        <Route
          path="posterpayment"
          element={<PosterPaymentPage token={token} />}
        />
        <Route
          path="shovelerpayment"
          element={<ShovelerPaymentPage token={token} />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

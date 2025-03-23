// src/pages/jobs/ApplicationList/index.js
import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PostedJobs from "./PostedJobs";
import AppliedJobs from "./AppliedJobs";

export default function ApplicationList({ token }) {
  const navigate = useNavigate();
  // refresh counter to force re-fetch in child components
  const [refresh, setRefresh] = useState(0);

  // ----- Posted Jobs Actions -----
  const handleViewResponses = (jobId) => {
    navigate(`/dashboard/view-responses?jobId=${jobId}`);
  };

  const handleEdit = (jobId) => {
    navigate(`/dashboard/edit-job/${jobId}`);
  };

  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmed) return;
    try {
      const res = await fetch(`http://localhost:4000/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        const data = await res.json();
        alert("Error deleting job: " + data.error);
      } else {
        // Increase refresh count to trigger re-fetch in PostedJobs
        setRefresh((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the job.");
    }
  };

  // ----- Applied Jobs Actions -----
  const handleWithdraw = async (appId) => {
    const confirmed = window.confirm(
      "Are you sure you want to withdraw your application?"
    );
    if (!confirmed) return;
    try {
      const res = await fetch(`http://localhost:4000/applications/${appId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        const data = await res.json();
        alert("Error withdrawing application: " + data.error);
      } else {
        // Increase refresh count to trigger re-fetch in AppliedJobs
        setRefresh((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while withdrawing your application.");
    }
  };

  const handleShovelerPayment = (jobId, appId) => {
    navigate(`/dashboard/shovelerpayment?jobId=${jobId}&appId=${appId}`);
  };

  const handleChat = (jobId) => {
    navigate(`/dashboard/chat?jobId=${jobId}`);
  };

  const handleFinalize = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:4000/jobs/${jobId}/finalize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        alert("Error finalizing payment: " + (data.error || "Unknown error"));
        return;
      }
      await res.json();
      alert("Payment captured! You are now connected.");
      // Increase refresh count so that child components see updated job status
      setRefresh((prev) => prev + 1);
      navigate(`/dashboard/chat?jobId=${jobId}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Application Dashboard
      </Typography>

      {/* My Posted Jobs Section */}
      <PostedJobs
        token={token}
        refresh={refresh}
        onViewResponses={handleViewResponses}
        onEdit={handleEdit}
        onDelete={handleDeleteJob}
      />

      {/* Jobs I've Applied To Section */}
      <AppliedJobs
        token={token}
        refresh={refresh}
        onWithdraw={handleWithdraw}
        onPayment={handleShovelerPayment}
        onChat={handleChat}
        onFinalize={handleFinalize}
      />
    </Container>
  );
}

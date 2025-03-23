// src/pages/jobs/MyJobResponses/index.js
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Typography, List, Box } from "@mui/material";
import ResponseCard from "./ResponseCard";

export default function MyJobResponses({ token }) {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [responses, setResponses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!jobId) {
      setMessage("No jobId provided.");
      return;
    }
    fetchJob();
    fetchResponses();
  }, [jobId, token]);

  // Fetch the job details
  const fetchJob = () => {
    fetch(`http://localhost:4000/jobs/${jobId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch((err) => setMessage("Error fetching job: " + err.message));
  };

  // Fetch all applications (responses) for this job
  const fetchResponses = () => {
    fetch(`http://localhost:4000/jobs/${jobId}/applications`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setResponses(data))
      .catch((err) =>
        setMessage("Error fetching applications: " + err.message)
      );
  };

  // Accept application => set status = "accepted"
  const handleAccept = async (appId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/applications/${appId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ status: "accepted" }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        alert(
          "Error accepting application: " + (data.error || "Unknown error")
        );
        return;
      }
      alert("Application accepted!");
      // Re-fetch the responses so the UI updates
      fetchResponses();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Reject application => set status = "rejected"
  const handleReject = async (appId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/applications/${appId}/reject`,
        {
          method: "PUT",
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        alert(
          "Error rejecting application: " + (data.error || "Unknown error")
        );
        return;
      }
      alert("Application rejected!");
      // Re-fetch responses to show updated status
      fetchResponses();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Poster Payment => go to PosterPaymentPage
  const handlePayment = (appId) => {
    navigate(`/dashboard/posterpayment?jobId=${jobId}&appId=${appId}`);
  };

  // Finalize the job => capture both payments, set job.status = "finalized"
  const handleFinalize = async () => {
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

      // Re-fetch the job so job.status updates to "finalized"
      fetchJob();

      // Optionally navigate to chat
      navigate(`/dashboard/chat?jobId=${jobId}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Go to Chat page
  const handleChat = () => {
    navigate(`/dashboard/chat?jobId=${jobId}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      {message && (
        <Typography variant="body1" color="error" gutterBottom>
          {message}
        </Typography>
      )}

      {job && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Responses for: {job.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.description}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Category: {job.category} | Location: {job.city}, {job.province},{" "}
            {job.country}
          </Typography>
        </Box>
      )}

      {responses.length === 0 ? (
        <Typography variant="body1">No responses yet.</Typography>
      ) : (
        <List>
          {responses.map((response) => (
            <ResponseCard
              key={response._id}
              response={response}
              job={job} // pass job to the card
              onAccept={handleAccept}
              onReject={handleReject}
              onPayment={handlePayment}
              onFinalize={handleFinalize}
              onChat={handleChat}
            />
          ))}
        </List>
      )}
    </Container>
  );
}

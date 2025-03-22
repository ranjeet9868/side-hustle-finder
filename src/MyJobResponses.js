// src/MyJobResponses.js
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Box,
} from "@mui/material";

export default function MyJobResponses({ token }) {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!jobId) {
      setMessage("No jobId provided.");
      return;
    }
    fetchJob();
    fetchApplications();
  }, [jobId, token]);

  // ---------------------------
  // Fetch job details
  // ---------------------------
  const fetchJob = () => {
    fetch(`http://localhost:4000/jobs/${jobId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch((err) => setMessage("Error fetching job: " + err.message));
  };

  // ---------------------------
  // Fetch all applications (including accepted or previously rejected)
  // ---------------------------
  const fetchApplications = () => {
    fetch(`http://localhost:4000/jobs/${jobId}/applications`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
      })
      .catch((err) =>
        setMessage("Error fetching applications: " + err.message)
      );
  };

  // ---------------------------
  // Accept => set status to "accepted"
  // ---------------------------
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
      // Re-fetch to see updated statuses
      fetchApplications();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // ---------------------------
  // Reject => physically DELETE the application from DB
  // so it disappears from both poster & applicant views
  // ---------------------------
  const handleReject = async (appId) => {
    try {
      const res = await fetch(`http://localhost:4000/applications/${appId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(
          "Error rejecting (deleting) application: " +
            (data.error || "Unknown error")
        );
        return;
      }
      // Remove from local state so the UI updates instantly
      setApplications((prev) => prev.filter((app) => app._id !== appId));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // ---------------------------
  // Poster Payment => go to "posterpayment" route
  // ---------------------------
  const handlePayment = (appId) => {
    navigate(`/posterpayment?jobId=${jobId}&appId=${appId}`);
  };

  // ---------------------------
  // Chat => navigate to chat screen
  // ---------------------------
  const handleChat = () => {
    navigate(`/dashboard/chat?jobId=${jobId}`);
  };

  // ---------------------------
  // Render the correct action buttons
  // ---------------------------
  const renderApplicationActions = (app) => {
    const { status } = app;

    switch (status) {
      case "pending":
        return (
          <Box>
            <Button
              variant="outlined"
              color="success"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => handleAccept(app._id)}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleReject(app._id)}
            >
              Reject
            </Button>
          </Box>
        );

      case "accepted":
        // If poster hasn't paid => show Pay + Reject
        if (!job?.posterPaymentIntentId) {
          return (
            <Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1, mb: 1 }}
                onClick={() => handlePayment(app._id)}
              >
                Pay $1 to Connect
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleReject(app._id)}
              >
                Reject
              </Button>
            </Box>
          );
        } else {
          // Poster has paid => show chat
          return (
            <Button variant="contained" color="primary" onClick={handleChat}>
              Accepted! Chat and Connect
            </Button>
          );
        }

      default:
        // e.g. "rejected", if we haven't physically deleted it
        return null;
    }
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

      {applications.length === 0 ? (
        <Typography variant="body1">No responses yet.</Typography>
      ) : (
        <List>
          {applications.map((app) => (
            <React.Fragment key={app._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={app.applicant?.email || "Unknown Applicant"}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Quoted Price: ${app.quotedPrice}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Status: {app.status} | Attempt: {app.attempt || 1}
                      </Typography>
                    </>
                  }
                />
                {renderApplicationActions(app)}
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
}

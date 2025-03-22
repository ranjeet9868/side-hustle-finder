// src/ApplicationList.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function ApplicationList({ token }) {
  const navigate = useNavigate();

  // Section 1: Jobs you posted
  const [postedJobs, setPostedJobs] = useState([]);
  // For each posted job, store its responses (applications) in a dictionary:
  // jobResponses[jobId] = array of application objects
  const [jobResponses, setJobResponses] = useState({});

  // Section 2: Jobs you've applied to (as applicant)
  const [myApps, setMyApps] = useState([]);

  // ---------------------------
  // Fetch: My Posted Jobs
  // ---------------------------
  const fetchMyJobs = () => {
    fetch("http://localhost:4000/myjobs", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((jobs) => {
        setPostedJobs(jobs);
        // For each posted job, fetch its responses
        jobs.forEach((job) => {
          fetch(`http://localhost:4000/jobs/${job._id}/applications`, {
            headers: { Authorization: "Bearer " + token },
          })
            .then((res) => res.json())
            .then((apps) => {
              setJobResponses((prev) => ({
                ...prev,
                [job._id]: apps,
              }));
            })
            .catch(console.error);
        });
      })
      .catch(console.error);
  };

  // ---------------------------
  // Fetch: My Applications (as applicant)
  // ---------------------------
  const fetchMyApplications = () => {
    fetch("http://localhost:4000/myapplications", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((apps) => setMyApps(apps))
      .catch(console.error);
  };

  useEffect(() => {
    fetchMyJobs();
    fetchMyApplications();
  }, [token]);

  // ---------------------------
  // DELETE a posted job (by poster)
  // ---------------------------
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
      if (res.ok) {
        setPostedJobs((prev) => prev.filter((job) => job._id !== jobId));
        setJobResponses((prev) => {
          const updated = { ...prev };
          delete updated[jobId];
          return updated;
        });
      } else {
        const data = await res.json();
        alert("Error deleting job: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the job.");
    }
  };

  // Navigate to the Edit Job page
  const handleEdit = (jobId) => {
    navigate(`/dashboard/edit-job/${jobId}`);
  };

  // Navigate to the "View Responses" page for a posted job
  const handleViewResponses = (jobId) => {
    navigate(`/dashboard/view-responses?jobId=${jobId}`);
  };

  // ---------------------------
  // Withdraw (or Delete) an application (as applicant)
  // ---------------------------
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
      if (res.ok) {
        fetchMyApplications();
      } else {
        const data = await res.json();
        alert("Error withdrawing application: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while withdrawing your application.");
    }
  };

  // Navigate to the Shoveler Payment page for accepted applications
  const handleShovelerPayment = (jobId, appId) => {
    navigate(`/shovelerpayment?jobId=${jobId}&appId=${appId}`);
  };

  // Navigate to the Chat page (if both payments are complete)
  const handleChat = (jobId) => {
    navigate(`/dashboard/chat?jobId=${jobId}`);
  };

  // ---------------------------
  // Render actions for applicant's applications (Section 2)
  // ---------------------------
  const renderApplicantActions = (app) => {
    switch (app.status) {
      case "pending":
        return (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleWithdraw(app._id)}
          >
            Withdraw Application
          </Button>
        );
      case "rejected":
        return (
          <Box>
            <Typography variant="body2" color="error">
              Your application was rejected.
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleWithdraw(app._id)}
            >
              Delete Application
            </Button>
          </Box>
        );
      case "accepted":
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleShovelerPayment(app.job._id, app._id)}
          >
            Accepted! Pay $1 to Connect
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* SECTION 1: My Posted Jobs */}
      <Typography variant="h5" gutterBottom>
        My Posted Jobs
      </Typography>
      {postedJobs.length === 0 ? (
        <Typography variant="body1">
          You haven't posted any jobs yet.
        </Typography>
      ) : (
        <List>
          {postedJobs.map((job) => (
            <React.Fragment key={job._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={job.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {job.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Category: {job.category} | Location: {job.city},{" "}
                        {job.province}, {job.country}
                      </Typography>
                    </Box>
                  }
                />
                {jobResponses[job._id] && jobResponses[job._id].length > 0 ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleViewResponses(job._id)}
                  >
                    View Responses
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(job._id)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteJob(job._id)}
                >
                  Delete
                </Button>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      {/* SECTION 2: Jobs I've Applied To */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Jobs I've Applied To
        </Typography>
        {myApps.length === 0 ? (
          <Typography variant="body1">
            You haven't applied to any jobs yet.
          </Typography>
        ) : (
          <List>
            {myApps.map((app) => {
              const job = app.job;
              if (!job) return null;
              return (
                <React.Fragment key={app._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={job.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {job.description}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Category: {job.category} | Location: {job.city},{" "}
                            {job.province}, {job.country}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            <strong>Status:</strong> {app.status} |{" "}
                            <strong>Attempt:</strong> {app.attempt || 1}
                          </Typography>
                        </Box>
                      }
                    />
                    {renderApplicantActions(app)}
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Container>
  );
}

// src/pages/jobs/ApplicationList/PostedJobs.js
import React, { useState, useEffect, useCallback } from "react";
import { List, Typography } from "@mui/material";
import JobCard from "./JobCard";
import { getMyJobsWithResponses } from "../../../services/jobService";

export default function PostedJobs({
  token,
  onViewResponses,
  onEdit,
  onDelete,
  refresh,
}) {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = useCallback(() => {
    getMyJobsWithResponses(token)
      .then((data) => setJobs(data))
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, refresh]);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Typography variant="h5" gutterBottom>
        My Posted Jobs
      </Typography>
      {jobs.length === 0 ? (
        <Typography variant="body1">
          You haven't posted any jobs yet.
        </Typography>
      ) : (
        <List>
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onViewResponses={onViewResponses}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </List>
      )}
    </div>
  );
}

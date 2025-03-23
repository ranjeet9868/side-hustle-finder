// src/pages/jobs/ApplicationList/AppliedJobs.js
import React, { useEffect, useState, useCallback } from "react";
import { List, Typography } from "@mui/material";
import ApplicationCard from "./ApplicationCard";
import { getMyApplications } from "../../../services/applicationService";

export default function AppliedJobs({
  token,
  onWithdraw,
  onPayment,
  onChat,
  onFinalize,
  refresh,
}) {
  const [applications, setApplications] = useState([]);

  const fetchApplications = useCallback(() => {
    getMyApplications(token)
      .then((data) => setApplications(data))
      .catch((err) => console.error("Error fetching applications:", err));
  }, [token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications, refresh]);

  const handleWithdrawLocal = async (appId) => {
    await onWithdraw(appId);
    fetchApplications();
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Typography variant="h5" gutterBottom>
        Jobs I've Applied To
      </Typography>
      {applications.length === 0 ? (
        <Typography variant="body1">
          You haven't applied to any jobs yet.
        </Typography>
      ) : (
        <List>
          {applications.map((app) => {
            if (!app.job) return null; // Skip if job is missing
            return (
              <ApplicationCard
                key={app._id}
                application={app}
                onWithdraw={handleWithdrawLocal}
                onPayment={onPayment}
                onChat={onChat}
                onFinalize={onFinalize}
              />
            );
          })}
        </List>
      )}
    </div>
  );
}

// src/pages/jobs/ApplicationList/ApplicationCard.js
import React from "react";
import {
  ListItem,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import ApplicationActions from "../../../components/ApplicationActions";

export default function ApplicationCard({
  application,
  onWithdraw,
  onPayment,
  onChat,
  onFinalize,
}) {
  // Extract the job from the application, so we can pass it down
  const job = application.job;

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary="Applicant" // Hides personal info
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary">
                Quoted Price: ${application.quotedPrice}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Status: {application.status} | Attempt:{" "}
                {application.attempt || 1}
              </Typography>
            </Box>
          }
        />
        {/* Pass 'job' into ApplicationActions */}
        <ApplicationActions
          application={application}
          job={job}
          onWithdraw={onWithdraw}
          onPayment={onPayment}
          onChat={onChat}
          onFinalize={onFinalize}
        />
      </ListItem>
      <Divider component="li" />
    </>
  );
}

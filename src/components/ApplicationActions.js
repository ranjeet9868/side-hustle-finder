// src/components/ApplicationActions.js
import React from "react";
import { Button, Box, Typography } from "@mui/material";

export default function ApplicationActions({
  application,
  job,
  onWithdraw,
  onPayment,
  onChat,
  onFinalize,
}) {
  const { status } = application;

  // PENDING
  if (status === "pending") {
    return (
      <Button
        variant="contained"
        color="error"
        onClick={() => onWithdraw(application._id)}
      >
        Withdraw Application
      </Button>
    );
  }

  // REJECTED
  if (status === "rejected") {
    return (
      <Box>
        <Typography variant="body2" color="error">
          Your application was rejected.
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => onWithdraw(application._id)}
        >
          Delete Application
        </Button>
      </Box>
    );
  }

  // ACCEPTED
  if (status === "accepted") {
    // If the job is already finalized, show "Chat now"
    if (job?.status === "finalized") {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => onChat(job._id)}
        >
          Job is finalized! Chat now
        </Button>
      );
    }

    // If the job is not finalized, check who has paid
    if (!job?.shovelerPaymentIntentId) {
      // Applicant hasn't paid yet
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => onPayment(job._id, application._id)}
        >
          Accepted! Pay $1 to Connect
        </Button>
      );
    } else if (job?.shovelerPaymentIntentId && !job?.posterPaymentIntentId) {
      // Applicant paid, but poster hasn't
      return (
        <Typography variant="body2" color="primary">
          The other party will contact you within 24 hours or your money back.
        </Typography>
      );
    } else if (job?.shovelerPaymentIntentId && job?.posterPaymentIntentId) {
      // Both have paid but job is not yet finalized => show "Finalize" button
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => onFinalize(job._id)}
        >
          You are now connected! Chat now
        </Button>
      );
    }
  }

  return null;
}

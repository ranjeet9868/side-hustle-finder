import React from "react";
import {
  ListItem,
  ListItemText,
  Button,
  Divider,
  Box,
  Typography,
} from "@mui/material";

export default function ResponseCard({
  response,
  job,
  onAccept,
  onReject,
  onPayment,
  onFinalize,
  onChat,
}) {
  const { status, quotedPrice, attempt, _id } = response;

  const renderActions = () => {
    if (status === "pending") {
      return (
        <Box>
          <Button
            variant="outlined"
            color="success"
            sx={{ mr: 1, mb: 1 }}
            onClick={() => onAccept(_id)}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onReject(_id)}
          >
            Reject
          </Button>
        </Box>
      );
    }
    if (status === "accepted") {
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
      if (!job?.posterPaymentIntentId) {
        return (
          <Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => onPayment(_id)}
            >
              Pay $1 to Connect
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => onReject(_id)}
            >
              Reject
            </Button>
          </Box>
        );
      } else if (job?.posterPaymentIntentId && !job?.shovelerPaymentIntentId) {
        return (
          <Typography variant="body2" color="primary">
            The other party will contact you within 24 hours or your money back.
          </Typography>
        );
      } else if (job?.posterPaymentIntentId && job?.shovelerPaymentIntentId) {
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
  };

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary="Applicant"
          secondary={
            <>
              <Typography variant="body2" color="text.secondary">
                Quoted Price: ${quotedPrice}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Status: {status} | Attempt: {attempt || 1}
              </Typography>
            </>
          }
        />
        {renderActions()}
      </ListItem>
      <Divider component="li" />
    </>
  );
}

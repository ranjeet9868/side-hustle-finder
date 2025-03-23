// src/pages/jobs/JobList/JobCard.js
import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";

export default function JobCard({
  job,
  token,
  isOwnJob,
  hasApplied,
  applyingJobId,
  quotedPrice,
  onViewDetails,
  onOpenApply,
  onSubmitApply,
  onCancelApply,
  setQuotedPrice,
}) {
  const jobId = job._id;

  return (
    <Card
      sx={{
        width: 300,
        height: 480,
        boxShadow: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {job.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Category:</strong> {job.category}
        </Typography>
        <Typography variant="body2">
          <strong>Location:</strong> {job.city}, {job.province}, {job.country}
        </Typography>
        <Typography variant="body2">
          <strong>Budget:</strong> {job.budget}
        </Typography>
        <Typography variant="body2">
          <strong>Schedule:</strong> {job.schedule}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <em>Posted on {new Date(job.createdAt).toLocaleDateString()}</em>
        </Typography>
        {isOwnJob && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            This job was posted by you.
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "center", pb: 2 }}>
        {isOwnJob ? (
          <Button variant="outlined" onClick={onViewDetails}>
            View Details
          </Button>
        ) : hasApplied ? (
          <>
            <Button variant="outlined" onClick={onViewDetails}>
              View Details
            </Button>
            <Button variant="contained" disabled>
              Applied!
            </Button>
          </>
        ) : (
          <>
            {applyingJobId === jobId ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <TextField
                  type="number"
                  label="Your Quote"
                  size="small"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="contained" onClick={onSubmitApply}>
                    Submit Quote
                  </Button>
                  <Button variant="text" onClick={onCancelApply}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Button variant="contained" onClick={onOpenApply}>
                Apply
              </Button>
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
}

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    city: PropTypes.string,
    province: PropTypes.string,
    country: PropTypes.string,
    budget: PropTypes.string,
    schedule: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  token: PropTypes.string.isRequired,
  isOwnJob: PropTypes.bool.isRequired,
  hasApplied: PropTypes.bool.isRequired,
  applyingJobId: PropTypes.string,
  quotedPrice: PropTypes.string,
  onViewDetails: PropTypes.func.isRequired,
  onOpenApply: PropTypes.func.isRequired,
  onSubmitApply: PropTypes.func.isRequired,
  onCancelApply: PropTypes.func.isRequired,
  setQuotedPrice: PropTypes.func.isRequired,
};

// src/pages/jobs/ApplicationList/JobCard.js
import React from "react";
import PropTypes from "prop-types";
import {
  ListItem,
  ListItemText,
  Button,
  Divider,
  Box,
  Typography,
} from "@mui/material";

// A presentational component to render a job card with actions
export default function JobCard({ job, onViewResponses, onEdit, onDelete }) {
  const hasResponses = job.responses && job.responses.length > 0;

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={job.title}
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary">
                {job.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Category: {job.category} | Location: {job.city}, {job.province},{" "}
                {job.country}
              </Typography>
            </Box>
          }
        />
        {hasResponses ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onViewResponses(job._id)}
          >
            View Responses
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onEdit(job._id)}
          >
            Edit
          </Button>
        )}
        <Button
          variant="contained"
          color="error"
          onClick={() => onDelete(job._id)}
        >
          Delete
        </Button>
      </ListItem>
      <Divider component="li" />
    </>
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
    responses: PropTypes.array,
  }).isRequired,
  onViewResponses: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

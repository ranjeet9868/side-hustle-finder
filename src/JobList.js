// src/JobList.js
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const filterableFields = [
  { label: "Title", value: "title" },
  { label: "Category", value: "category" },
  { label: "City", value: "city" },
  { label: "Province", value: "province" },
  { label: "Country", value: "country" },
  { label: "Budget", value: "budget" },
  { label: "Schedule", value: "schedule" },
];

export default function JobList({ token }) {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState([]);
  const [myApplications, setMyApplications] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [quotedPrice, setQuotedPrice] = useState("");
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    fetch("http://localhost:4000/user", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((user) => setCurrentUser(user))
      .catch(console.error);
  }, [token]);

  // Fetch all jobs
  useEffect(() => {
    fetch("http://localhost:4000/jobs", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then(setJobs)
      .catch(console.error);
  }, [token]);

  // Fetch user's applications (as applicant)
  useEffect(() => {
    fetch("http://localhost:4000/myapplications", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((apps) => {
        const dict = {};
        apps.forEach((app) => {
          if (app.job?._id) {
            dict[app.job._id] = app;
          }
        });
        setMyApplications(dict);
      })
      .catch(console.error);
  }, [token]);

  // FILTER LOGIC
  const addFilter = () => {
    setFilters((prev) => [...prev, { field: "title", value: "" }]);
  };

  const removeFilter = (index) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFilter = (index, newField, newValue) => {
    setFilters((prev) =>
      prev.map((f, i) =>
        i === index
          ? { field: newField ?? f.field, value: newValue ?? f.value }
          : f
      )
    );
  };

  const clearAllFilters = () => {
    setFilters([]);
  };

  const getFilteredJobs = () => {
    if (filters.length === 0) return jobs;
    return jobs.filter((job) =>
      filters.every((f) => {
        const jobFieldValue = (job[f.field] || "").toString().toLowerCase();
        return jobFieldValue.includes(f.value.toLowerCase());
      })
    );
  };

  // SWIPER HANDLERS
  const handleViewDetails = (jobId) => {
    // Navigate to details page (or my applications page if needed)
    navigate(`/dashboard/applications?jobId=${jobId}`);
  };

  // For non-owners: open the apply form (inline) to enter a quote price
  const handleOpenApply = (jobId) => {
    setApplyingJobId(jobId);
    setQuotedPrice("");
  };

  // Submit the application with the entered quoted price
  const handleSubmitApply = async () => {
    if (!applyingJobId || !quotedPrice) return;
    try {
      const res = await fetch(
        `http://localhost:4000/jobs/${applyingJobId}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ quotedPrice }),
        }
      );
      const data = await res.json();
      if (res.ok && data.application) {
        // Update local applications state
        setMyApplications((prev) => ({
          ...prev,
          [applyingJobId]: data.application,
        }));
        alert("Applied successfully with quote: $" + quotedPrice);
        setApplyingJobId(null);
        setQuotedPrice("");
      } else {
        alert("Error applying: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error applying: " + err.message);
    }
  };

  // Cancel the apply form
  const handleCancelApply = () => {
    setApplyingJobId(null);
    setQuotedPrice("");
  };

  const hasApplied = (jobId) => {
    return myApplications[jobId] !== undefined;
  };

  const filteredJobs = getFilteredJobs();

  // Check if logged-in user is the poster of a job
  const isOwnJob = (job) => {
    return currentUser && job.poster && currentUser._id === job.poster._id;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Available Jobs
      </Typography>

      {/* FILTER SECTION */}
      <Box sx={{ p: 2, mb: 2, border: "1px solid #ccc", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          {filters.map((filter, index) => (
            <React.Fragment key={index}>
              <Grid item xs={4} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Field</InputLabel>
                  <Select
                    label="Field"
                    value={filter.field}
                    onChange={(e) => updateFilter(index, e.target.value, null)}
                  >
                    {filterableFields.map((f) => (
                      <MenuItem key={f.value} value={f.value}>
                        {f.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={7}>
                <TextField
                  label="Value"
                  fullWidth
                  value={filter.value}
                  onChange={(e) => updateFilter(index, null, e.target.value)}
                />
              </Grid>
              <Grid item xs={2} sm={2}>
                <IconButton color="error" onClick={() => removeFilter(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="outlined" onClick={addFilter}>
            + Add Filter
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      {/* SWIPER SECTION */}
      <Box sx={{ height: 500 }}>
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          navigation
          pagination={{ clickable: true }}
          effect="coverflow"
          grabCursor
          slidesPerView={1}
          centeredSlides
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          spaceBetween={30}
          style={{ height: "500px" }}
        >
          {filteredJobs.map((job) => {
            const jobId = job._id;
            const ownJob = isOwnJob(job);
            const applied = hasApplied(jobId);
            return (
              <SwiperSlide
                key={jobId}
                style={{ display: "flex", justifyContent: "center" }}
              >
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
                      <strong>Location:</strong> {job.city}, {job.province},{" "}
                      {job.country}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Budget:</strong> {job.budget}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Schedule:</strong> {job.schedule}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <em>
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </em>
                    </Typography>
                    {ownJob && (
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
                    {ownJob ? (
                      <Button
                        variant="outlined"
                        onClick={() => handleViewDetails(jobId)}
                      >
                        View Details
                      </Button>
                    ) : applied ? (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() => handleViewDetails(jobId)}
                        >
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
                              <Button
                                variant="contained"
                                onClick={handleSubmitApply}
                              >
                                Submit Quote
                              </Button>
                              <Button
                                variant="text"
                                onClick={handleCancelApply}
                              >
                                Cancel
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => handleOpenApply(jobId)}
                          >
                            Apply
                          </Button>
                        )}
                      </>
                    )}
                  </CardActions>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Use filters above to narrow down jobs, then swipe or use arrows to
        browse.
      </Typography>
    </Container>
  );
}

// src/pages/jobs/JobList/index.js
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import { Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

import FilterSection from "./FilterSection";
import JobCard from "./JobCard";

import { getAllJobs } from "../../../services/jobService";
import { getMyApplications } from "../../../services/applicationService";
import { getCurrentUser } from "../../../services/userService";

import {
  Button,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Define which fields can be filtered
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

  // 1. Fetch current user using service
  useEffect(() => {
    getCurrentUser(token)
      .then((user) => setCurrentUser(user))
      .catch(console.error);
  }, [token]);

  // 2. Fetch all jobs using service
  useEffect(() => {
    getAllJobs(token).then(setJobs).catch(console.error);
  }, [token]);

  // 3. Fetch user's applications using service
  useEffect(() => {
    getMyApplications(token)
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

  // ---------- Filter Logic ----------
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

  // ---------- Apply Logic ----------
  const handleOpenApply = (jobId) => {
    setApplyingJobId(jobId);
    setQuotedPrice("");
  };

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

  const handleCancelApply = () => {
    setApplyingJobId(null);
    setQuotedPrice("");
  };

  const handleViewDetails = (jobId) => {
    navigate(`/dashboard/applications?jobId=${jobId}`);
  };

  // ---------- Utility Helpers ----------
  const hasApplied = (jobId) => {
    return myApplications[jobId] !== undefined;
  };

  const isOwnJob = (job) => {
    return currentUser && job.poster && currentUser._id === job.poster._id;
  };

  const filteredJobs = getFilteredJobs();

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
            return (
              <SwiperSlide
                key={jobId}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <JobCard
                  job={job}
                  token={token}
                  isOwnJob={isOwnJob(job)}
                  hasApplied={hasApplied(jobId)}
                  applyingJobId={applyingJobId}
                  quotedPrice={quotedPrice}
                  onViewDetails={() => handleViewDetails(jobId)}
                  onOpenApply={() => handleOpenApply(jobId)}
                  onSubmitApply={handleSubmitApply}
                  onCancelApply={handleCancelApply}
                  setQuotedPrice={setQuotedPrice}
                />
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

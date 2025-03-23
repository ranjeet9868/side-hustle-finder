// src/pages/jobs/EditJob/index.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditJobForm from "./EditJobForm";
import { getJob, updateJob } from "../../../services/jobService";

const categories = [
  "Snow Shoveling",
  "Lawn Care & Gardening",
  "House Cleaning & Organizing",
  "Handyman Services",
  "Pet Services",
  "Babysitting & Elderly Care",
  "Tutoring & Tech Support",
  "Moving & Delivery Help",
  "Errand Running",
];

export default function EditJob({ token }) {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // Combine all job fields into a single state object
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    category: categories[0],
    city: "",
    province: "",
    country: "",
    nearby: "",
    budget: "",
    schedule: "",
  });
  const [message, setMessage] = useState("");

  // Fetch job data on mount
  useEffect(() => {
    getJob(jobId, token)
      .then((data) => {
        setJobData({
          title: data.title,
          description: data.description,
          category: data.category,
          city: data.city,
          province: data.province,
          country: data.country,
          nearby: data.nearby,
          budget: data.budget,
          schedule: data.schedule,
        });
      })
      .catch((err) => setMessage("Error fetching job: " + err.message));
  }, [jobId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await updateJob(jobId, jobData, token);
      setMessage("Job updated successfully!");
      navigate("/dashboard/applications");
    } catch (err) {
      setMessage("Error updating job: " + err.message);
    }
  };

  // Handler to update individual fields
  const handleInputChange = (field, value) => {
    setJobData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <EditJobForm
      jobData={jobData}
      categories={categories}
      message={message}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  );
}

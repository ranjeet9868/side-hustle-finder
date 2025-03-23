// src/pages/jobs/JobPosting/index.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobPostingForm from "./JobPostingForm";

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

export default function JobPosting({ token }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [nearby, setNearby] = useState("");
  const [budget, setBudget] = useState("");
  const [schedule, setSchedule] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        category,
        city,
        province,
        country,
        nearby,
        budget,
        schedule,
      };

      console.log("Posting job with payload:", payload);

      const res = await fetch("http://localhost:4000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.job) {
        setMessage("Job posted successfully!");
        // Reset fields
        setTitle("");
        setDescription("");
        setCategory(categories[0]);
        setCity("");
        setProvince("");
        setCountry("");
        setNearby("");
        setBudget("");
        setSchedule("");
        // Optionally navigate to a different page (e.g., listings or dashboard)
        navigate("/dashboard/listings");
      } else {
        setMessage("Error posting job");
      }
    } catch (err) {
      setMessage("Error posting job: " + err.message);
    }
  };

  return (
    <JobPostingForm
      title={title}
      description={description}
      category={category}
      city={city}
      province={province}
      country={country}
      nearby={nearby}
      budget={budget}
      schedule={schedule}
      categories={categories}
      message={message}
      onTitleChange={setTitle}
      onDescriptionChange={setDescription}
      onCategoryChange={setCategory}
      onCityChange={setCity}
      onProvinceChange={setProvince}
      onCountryChange={setCountry}
      onNearbyChange={setNearby}
      onBudgetChange={setBudget}
      onScheduleChange={setSchedule}
      onSubmit={handleSubmit}
    />
  );
}

// src/pages/jobs/JobPosting/JobPostingForm.js
import React from "react";

export default function JobPostingForm({
  title,
  description,
  category,
  city,
  province,
  country,
  nearby,
  budget,
  schedule,
  categories,
  message,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onCityChange,
  onProvinceChange,
  onCountryChange,
  onNearbyChange,
  onBudgetChange,
  onScheduleChange,
  onSubmit,
}) {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Post a Job</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form onSubmit={onSubmit}>
        {/* Title */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
              style={{ width: "100%", marginLeft: 5 }}
            />
          </label>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              required
              rows={3}
              style={{ width: "100%", marginLeft: 5 }}
            />
          </label>
        </div>

        {/* Category */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Category:
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              required
              style={{ marginLeft: 5 }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* City */}
        <div style={{ marginBottom: 10 }}>
          <label>
            City:
            <input
              type="text"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              required
              style={{ width: "100%", marginLeft: 5 }}
            />
          </label>
        </div>

        {/* Province */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Province:
            <input
              type="text"
              value={province}
              onChange={(e) => onProvinceChange(e.target.value)}
              required
              style={{ width: "100%", marginLeft: 5 }}
            />
          </label>
        </div>

        {/* Country */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Country:
            <input
              type="text"
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
              required
              style={{ width: "100%", marginLeft: 5 }}
            />
          </label>
        </div>

        {/* Nearby */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Nearby:
            <input
              type="text"
              value={nearby}
              onChange={(e) => onNearbyChange(e.target.value)}
              required
              style={{ width: "100%", marginLeft: 5 }}
            />
          </label>
        </div>

        {/* Budget */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Budget:
            <input
              type="text"
              value={budget}
              onChange={(e) => onBudgetChange(e.target.value)}
              required
              style={{ width: "100%", marginLeft: 5 }}
            />
          </label>
        </div>

        {/* Schedule */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Schedule (Days/Times):
            <input
              type="text"
              value={schedule}
              onChange={(e) => onScheduleChange(e.target.value)}
              required
              style={{ width: "100%", marginLeft: 5 }}
            />
          </label>
        </div>

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

// src/pages/jobs/EditJob/EditJobForm.js
import React from "react";
import PropTypes from "prop-types";

export default function EditJobForm({
  jobData,
  categories,
  message,
  onChange,
  onSubmit,
}) {
  const {
    title,
    description,
    category,
    city,
    province,
    country,
    nearby,
    budget,
    schedule,
  } = jobData;

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Edit Job</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form onSubmit={onSubmit}>
        {/* Title */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => handleInputChange("title", e.target.value)}
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
              onChange={(e) => handleInputChange("description", e.target.value)}
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
              onChange={(e) => handleInputChange("category", e.target.value)}
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
              onChange={(e) => handleInputChange("city", e.target.value)}
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
              onChange={(e) => handleInputChange("province", e.target.value)}
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
              onChange={(e) => handleInputChange("country", e.target.value)}
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
              onChange={(e) => handleInputChange("nearby", e.target.value)}
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
              onChange={(e) => handleInputChange("budget", e.target.value)}
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
              onChange={(e) => handleInputChange("schedule", e.target.value)}
              required
              style={{ width: "100%", marginLeft: 5 }}
            />
          </label>
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

EditJobForm.propTypes = {
  jobData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    city: PropTypes.string,
    province: PropTypes.string,
    country: PropTypes.string,
    nearby: PropTypes.string,
    budget: PropTypes.string,
    schedule: PropTypes.string,
  }).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  message: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

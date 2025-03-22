// src/EditJob.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Example categories; adjust to match your actual categories
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

  // Fetch the existing job data on mount
  useEffect(() => {
    fetch(`http://localhost:4000/jobs/${jobId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage("Error fetching job: " + data.error);
        } else {
          // Populate all fields from the fetched job
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category);
          setCity(data.city);
          setProvince(data.province);
          setCountry(data.country);
          setNearby(data.nearby);
          setBudget(data.budget);
          setSchedule(data.schedule);
        }
      })
      .catch((err) => {
        setMessage("Error: " + err.message);
      });
  }, [jobId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Build the payload with all fields
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

      const res = await fetch(`http://localhost:4000/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Job updated successfully!");
        // Optionally redirect back to your "My Posted Jobs" page
        navigate("/dashboard/applications");
      } else {
        setMessage("Error updating job: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setMessage("Error updating job: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Edit Job</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
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
              onChange={(e) => setCategory(e.target.value)}
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
              onChange={(e) => setCity(e.target.value)}
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
              onChange={(e) => setProvince(e.target.value)}
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
              onChange={(e) => setCountry(e.target.value)}
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
              onChange={(e) => setNearby(e.target.value)}
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
              onChange={(e) => setBudget(e.target.value)}
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
              onChange={(e) => setSchedule(e.target.value)}
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

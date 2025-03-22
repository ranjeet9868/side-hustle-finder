// src/JobPosting.js
import React, { useState } from "react";

export default function JobPosting({ token }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Snow Shoveling");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [nearby, setNearby] = useState("");
  const [budget, setBudget] = useState("");
  const [schedule, setSchedule] = useState(""); // new field
  const [message, setMessage] = useState("");

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
        schedule, // include schedule
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
        setCategory("Snow Shoveling");
        setCity("");
        setProvince("");
        setCountry("");
        setNearby("");
        setBudget("");
        setSchedule("");
      } else {
        setMessage("Error posting job");
      }
    } catch (err) {
      setMessage("Error posting job: " + err.message);
    }
  };

  return (
    <div>
      <h2>Post a Job</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            City:
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Province:
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Country:
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Nearby:
            <input
              type="text"
              value={nearby}
              onChange={(e) => setNearby(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Budget:
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Schedule (Days/Times):
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

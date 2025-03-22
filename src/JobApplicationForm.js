import React, { useState } from "react";

export default function JobApplicationForm({
  token,
  jobId,
  onApplied,
  onCancel,
}) {
  const [quotedPrice, setQuotedPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:4000/jobs/${jobId}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ quotedPrice: Number(quotedPrice) }),
    });
    const data = await res.json();
    console.log("Application created:", data);

    if (res.ok && data.application) {
      onApplied(data.application);
    } else {
      alert(data.error || "Error creating application");
    }
    setQuotedPrice("");
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}
    >
      <h3>Apply for Job</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Quoted Price:
          <input
            type="number"
            value={quotedPrice}
            onChange={(e) => setQuotedPrice(e.target.value)}
            required
          />
        </label>
        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          Apply
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{ marginLeft: "0.5rem" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

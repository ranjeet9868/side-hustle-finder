// src/PaymentCapturePage.js
import React, { useState } from "react";

function PaymentCapturePage() {
  const [posterId, setPosterId] = useState("");
  const [shovelerId, setShovelerId] = useState("");
  const [status, setStatus] = useState("");

  // Utility function to capture a PaymentIntent by calling the backend
  async function capturePayment(paymentIntentId) {
    const res = await fetch("http://localhost:4000/capture-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId }),
    });
    if (!res.ok) {
      throw new Error(
        "Capture failed for PaymentIntent ID: " + paymentIntentId
      );
    }
    return res.json();
  }

  // Handle capturing payments for both poster and shoveler
  async function handleCapture() {
    try {
      setStatus("Capturing payments...");
      const posterResult = await capturePayment(posterId);
      const shovelerResult = await capturePayment(shovelerId);
      setStatus(
        `Capture successful! Poster status: ${posterResult.status}, Shoveler status: ${shovelerResult.status}`
      );
    } catch (error) {
      setStatus("Capture failed: " + error.message);
    }
  }

  return (
    <div style={{ margin: "20px" }}>
      <h1>Capture Payment</h1>
      <div>
        <label>
          Poster PaymentIntent ID:
          <input
            type="text"
            value={posterId}
            onChange={(e) => setPosterId(e.target.value)}
            style={{ marginLeft: "10px", width: "300px" }}
          />
        </label>
      </div>
      <div style={{ marginTop: "10px" }}>
        <label>
          Shoveler PaymentIntent ID:
          <input
            type="text"
            value={shovelerId}
            onChange={(e) => setShovelerId(e.target.value)}
            style={{ marginLeft: "10px", width: "300px" }}
          />
        </label>
      </div>
      <button
        onClick={handleCapture}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Capture Payments
      </button>
      <p style={{ marginTop: "20px" }}>{status}</p>
    </div>
  );
}

export default PaymentCapturePage;

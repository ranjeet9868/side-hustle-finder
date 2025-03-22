// src/PaymentProcess.js
import React, { useState, useEffect, useCallback } from "react";
import PaymentForm from "./PaymentForm";

// Utility function to capture a PaymentIntent
async function capturePayment(paymentIntentId) {
  const res = await fetch("http://localhost:4000/capture-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentIntentId }),
  });
  if (!res.ok) {
    throw new Error("Failed to capture payment");
  }
  return res.json();
}

function PaymentProcess() {
  const [posterPaymentId, setPosterPaymentId] = useState(null);
  const [shovelerPaymentId, setShovelerPaymentId] = useState(null);

  // Called when the poster completes their payment
  const handlePosterPaymentSuccess = (paymentIntentId) => {
    setPosterPaymentId(paymentIntentId);
  };

  // Called when the shoveler completes their payment
  const handleShovelerPaymentSuccess = (paymentIntentId) => {
    setShovelerPaymentId(paymentIntentId);
  };

  // Once we have both PaymentIntent IDs, capture them
  const handleAllPaymentsCompleted = useCallback(async () => {
    try {
      // Capture both payments in parallel
      const [posterResult, shovelerResult] = await Promise.all([
        capturePayment(posterPaymentId),
        capturePayment(shovelerPaymentId),
      ]);
      console.log("Poster capture result:", posterResult);
      console.log("Shoveler capture result:", shovelerResult);
      alert("Both payments captured! Users can now connect.");
    } catch (error) {
      console.error("Error capturing payments:", error);
    }
  }, [posterPaymentId, shovelerPaymentId]);

  // Watch for both PaymentIntent IDs to be set
  useEffect(() => {
    if (posterPaymentId && shovelerPaymentId) {
      handleAllPaymentsCompleted();
    }
  }, [posterPaymentId, shovelerPaymentId, handleAllPaymentsCompleted]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Poster Payment</h2>
      <PaymentForm onPaymentSuccess={handlePosterPaymentSuccess} />

      <h2>Shoveler Payment</h2>
      <PaymentForm onPaymentSuccess={handleShovelerPaymentSuccess} />
    </div>
  );
}

export default PaymentProcess;

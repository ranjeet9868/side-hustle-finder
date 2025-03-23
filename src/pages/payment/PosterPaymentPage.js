// src/pages/payment/PosterPaymentPage.js
import React, { useState } from "react";
import PaymentForm from "../../PaymentForm";
import { useSearchParams, useNavigate } from "react-router-dom";

function PosterPaymentPage({ token }) {
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const jobId = searchParams.get("jobId");
  const appId = searchParams.get("appId");

  const handlePaymentSuccess = async (intentId) => {
    setPaymentIntentId(intentId);
    alert("Poster payment authorized! PaymentIntent: " + intentId);

    if (!token) {
      alert("No token found. Please log in again.");
      return navigate("/");
    }
    if (!jobId) {
      alert("No jobId found. Cannot update job with PaymentIntent.");
      return navigate("/");
    }

    try {
      // Attach the PaymentIntent ID to the job (poster side)
      const res = await fetch(
        `http://localhost:4000/jobs/${jobId}/update-poster-intent`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ paymentIntentId: intentId }),
        }
      );
      if (!res.ok) {
        alert("Error updating job with Poster PaymentIntent!");
        return;
      }
      const data = await res.json();
      console.log("Updated job with Poster PaymentIntent:", data);

      // After successful payment, navigate to the poster's "View Responses" page
      // so the poster can see the job’s applications/responses.
      navigate(`/dashboard/view-responses?jobId=${jobId}`);
    } catch (err) {
      console.error(err);
      alert("Error updating job with PaymentIntent: " + err.message);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>Poster Payment Page</h1>
      <p>
        This is where the poster pays $1 for job <strong>{jobId}</strong>,
        application <strong>{appId}</strong>.
      </p>
      <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
      {paymentIntentId && (
        <p>
          PaymentIntent ID: <strong>{paymentIntentId}</strong>
        </p>
      )}
    </div>
  );
}

export default PosterPaymentPage;

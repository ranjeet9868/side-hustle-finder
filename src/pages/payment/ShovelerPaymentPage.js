// src/pages/payment/ShovelerPaymentPage.js
import React, { useState } from "react";
import PaymentForm from "../../PaymentForm";
import { useSearchParams, useNavigate } from "react-router-dom";

function ShovelerPaymentPage({ token }) {
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const jobId = searchParams.get("jobId");
  const appId = searchParams.get("appId");

  const handlePaymentSuccess = async (intentId) => {
    setPaymentIntentId(intentId);
    alert("Shoveler payment authorized! PaymentIntent: " + intentId);

    if (!token) {
      alert("No token found. Please log in again.");
      return navigate("/");
    }
    if (!jobId) {
      alert("No jobId found. Cannot update job with PaymentIntent.");
      return navigate("/");
    }

    try {
      // Attach the PaymentIntent ID to the job (shoveler side)
      const res = await fetch(
        `http://localhost:4000/jobs/${jobId}/update-shoveler-intent`,
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
        alert("Error updating job with Shoveler PaymentIntent!");
        return;
      }
      const data = await res.json();
      console.log("Updated job with Shoveler PaymentIntent:", data);

      // After successful payment, navigate the applicant to "My Applications" page
      // so they can see the job they just paid for in their list.
      navigate("/dashboard/applications");
    } catch (err) {
      console.error(err);
      alert("Error updating job with PaymentIntent: " + err.message);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>Shoveler Payment Page</h1>
      <p>
        This is where the shoveler pays $1 for job <strong>{jobId}</strong>,
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

export default ShovelerPaymentPage;

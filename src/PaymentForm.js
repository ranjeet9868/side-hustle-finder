import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function PaymentForm({ onPaymentSuccess, currency = "usd" }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Create a PaymentIntent on your backend
      const res = await fetch("http://localhost:4000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });
      const data = await res.json();
      const { clientSecret, paymentIntentId } = data;

      // Confirm the card payment (this authorizes the funds)
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === "requires_capture") {
          onPaymentSuccess(paymentIntentId);
        }
        setProcessing(false);
      }
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "400px", margin: "20px auto" }}
    >
      <CardElement options={{ hidePostalCode: true }} />
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        {processing ? "Processing..." : "Pay $1"}
      </button>
    </form>
  );
}

export default PaymentForm;

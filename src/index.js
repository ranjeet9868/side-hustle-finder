// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import App from "./App";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51R3PLrLUNYmhvJIJunqNAErDnKRBWVBPvnwT7UuDUZsAnu7jyH2LHnG1irJ1HVDjfIlSHytb2LhtXvUwBNxsv6W900dy4cTj9e"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </BrowserRouter>
  </React.StrictMode>
);

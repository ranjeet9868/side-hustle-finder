// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// POST /create-payment-intent
router.post("/create-payment-intent", paymentController.createPaymentIntent);

// POST /capture-payment
router.post("/capture-payment", paymentController.capturePayment);

// POST /confirm-payment-intent
router.post("/confirm-payment-intent", paymentController.confirmPaymentIntent);

module.exports = router;

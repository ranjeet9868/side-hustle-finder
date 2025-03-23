// controllers/paymentController.js
const stripe = require("stripe")(
  "sk_test_51R3PLrLUNYmhvJIJNEY5Pem55ZQSsnfjAhDamz15qXb1MyTq8ca5Qy9ixK7aadcXNSf3XaaVIsTHKgGJNvvi9zPx00ZKgdmMT0"
);

exports.createPaymentIntent = async (req, res) => {
  const { currency = "usd" } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100,
      currency,
      capture_method: "manual",
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.capturePayment = async (req, res) => {
  const { paymentIntentId } = req.body;
  try {
    const capturedPayment = await stripe.paymentIntents.capture(
      paymentIntentId
    );
    res.json(capturedPayment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// confirm-payment-intent
exports.confirmPaymentIntent = async (req, res) => {
  const { paymentIntentId } = req.body;
  try {
    const confirmedPayment = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method: "pm_card_visa",
        return_url: "http://localhost:3000",
      }
    );
    res.json({ message: "PaymentIntent confirmed", confirmedPayment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

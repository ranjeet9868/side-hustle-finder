// backend/index.js
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/shoveling-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const express = require("express");
const cors = require("cors");
const app = express();

// We keep stripe, SECRET_KEY, etc. if needed in controllers or separate config
const cron = require("node-cron");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
const ChatMessage = require("./models/ChatMessage");
const Job = require("./models/Job");

// Middleware
app.use(cors());
app.use(express.json());

// =============== MOUNT ALL ROUTES ===============

// 1) user routes
const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);
// This means POST /register => userRoutes, POST /login => userRoutes, etc.

// 2) payment routes
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/", paymentRoutes);
// e.g. /create-payment-intent, /capture-payment, /confirm-payment-intent

// 3) job routes
const jobRoutes = require("./routes/jobRoutes");
app.use("/jobs", jobRoutes);

// 4) application routes
const applicationRoutes = require("./routes/applicationRoutes");
app.use("/applications", applicationRoutes);

// 5) chat routes (optional)
const chatRoutes = require("./routes/chatRoutes");
app.use("/chat", chatRoutes);

// 6) activeChats router (already existing)
const activeChatsRouter = require("./routes/activeChats");
app.use("/active-chats", activeChatsRouter);

// =============== CRON JOB ===============
cron.schedule("0 * * * *", async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const oldJobs = await Job.find({
    matchedApplication: null,
    createdAt: { $lt: cutoff },
  });
  for (const job of oldJobs) {
    if (job.posterPaymentIntentId) {
      // cancel stripe paymentIntent
    }
    if (job.shovelerPaymentIntentId) {
      // cancel stripe paymentIntent
    }
    await job.remove();
  }
  console.log(
    "Cleanup found:",
    oldJobs.length,
    "unmatched jobs older than 24 hours"
  );
});

// =============== SOCKET.IO SETUP ===============
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", async (jobId) => {
    const job = await Job.findById(jobId);
    if (
      job &&
      job.posterPaymentIntentId &&
      job.shovelerPaymentIntentId &&
      job.matchedApplication
    ) {
      socket.join(jobId);
      socket.emit("joinSuccess", `Joined room ${jobId}`);
    } else {
      socket.emit("joinError", "Chat not unlocked. Matching not complete.");
    }
  });

  socket.on("chatMessage", async ({ jobId, message, sender }) => {
    try {
      const newMsg = await ChatMessage.create({ job: jobId, sender, message });
      io.to(jobId).emit("chatMessage", newMsg.message);
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  });
});

// =============== ERROR HANDLING ===============
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// =============== START SERVER ===============
server.listen(4000, () => console.log(`Server running on port 4000`));

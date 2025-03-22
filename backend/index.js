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
const stripe = require("stripe")(
  "sk_test_51R3PLrLUNYmhvJIJNEY5Pem55ZQSsnfjAhDamz15qXb1MyTq8ca5Qy9ixK7aadcXNSf3XaaVIsTHKgGJNvvi9zPx00ZKgdmMT0"
);
const jwt = require("jsonwebtoken");
const SECRET_KEY = "my_super_secret_key";

const app = express();
app.use(cors());
app.use(express.json());

// Registration route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await require("./models/User").create({ email, password });
    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const User = require("./models/User");
  const user = await User.findOne({ email });
  if (!user || user.password !== password)
    return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1d" });
  res.json({ token });
});

// User info route
app.get("/user", require("./middleware/auth"), async (req, res) => {
  const User = require("./models/User");
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

// Protected test route
app.get("/protected", require("./middleware/auth"), (req, res) => {
  res.json({ message: `Protected route, your user ID is ${req.userId}` });
});

// Create PaymentIntent route
app.post("/create-payment-intent", async (req, res) => {
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
});

// Capture PaymentIntent route
app.post("/capture-payment", async (req, res) => {
  const { paymentIntentId } = req.body;
  try {
    const capturedPayment = await stripe.paymentIntents.capture(
      paymentIntentId
    );
    res.json(capturedPayment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const Job = require("./models/Job");
// Job creation route: updated to include all required fields
// Job creation route: includes poster field from req.userId and the new 'budget' field
app.post("/jobs", require("./middleware/auth"), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      city,
      province,
      country,
      nearby,
      budget,
      schedule, // new field
    } = req.body;

    const job = await Job.create({
      title,
      description,
      category,
      city,
      province,
      country,
      nearby,
      budget,
      schedule, // pass schedule to Mongoose
      poster: req.userId,
    });

    res.json({ message: "Job created", job });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET single job route (populated with poster)
app.get("/jobs/:id", require("./middleware/auth"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("poster", "email");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a job's payment info route
app.put("/jobs/:id/payment", require("./middleware/auth"), async (req, res) => {
  const { posterPaymentIntentId, shovelerPaymentIntentId } = req.body;
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { posterPaymentIntentId, shovelerPaymentIntentId },
      { new: true }
    );
    res.json({ message: "Payment info updated", job });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get jobs route (populated with poster email)
app.get("/jobs", require("./middleware/auth"), async (req, res) => {
  try {
    const jobs = await Job.find().populate("poster", "email");
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Shoveler applies to a job route
app.post("/jobs/:id/apply", require("./middleware/auth"), async (req, res) => {
  const Application = require("./models/Application");
  const { quotedPrice } = req.body;
  try {
    let application = await Application.findOne({
      job: req.params.id,
      applicant: req.userId,
    });
    if (application) {
      // If the application is rejected, allow re-application by updating attempt
      if (application.status === "rejected") {
        application.attempt = (application.attempt || 1) + 1;
        application.status = "pending";
        application.quotedPrice = quotedPrice;
        await application.save();
        console.log("Re-applied, new attempt:", application.attempt);
      } else {
        return res
          .status(400)
          .json({ error: "You have already applied for this job" });
      }
    } else {
      application = await Application.create({
        job: req.params.id,
        applicant: req.userId,
        quotedPrice,
        status: "pending",
        attempt: 1,
      });
      console.log("New application created, attempt:", application.attempt);
    }
    res.json({ message: "Applied to job", application });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all applications for a job route
app.get(
  "/jobs/:id/applications",
  require("./middleware/auth"),
  async (req, res) => {
    const Application = require("./models/Application");
    try {
      const applications = await Application.find({
        job: req.params.id,
      }).populate("applicant", "email");
      res.json(applications);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Update an application's status route
app.put(
  "/applications/:id/status",
  require("./middleware/auth"),
  async (req, res) => {
    const Application = require("./models/Application");
    const { status } = req.body;
    try {
      const updatedApplication = await Application.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      res.json({
        message: "Application status updated",
        application: updatedApplication,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

app.get("/myjobs", require("./middleware/auth"), async (req, res) => {
  try {
    const jobs = await Job.find({ poster: req.userId }).populate(
      "poster",
      "email"
    );
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/jobs/:id/match", require("./middleware/auth"), async (req, res) => {
  const { applicationId } = req.body;
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { matchedApplication: applicationId },
      { new: true }
    );
    res.json({ message: "Job matched", job });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Payment routes for poster and shoveler
app.post(
  "/jobs/:id/pay-poster",
  require("./middleware/auth"),
  async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 100,
        currency: "usd",
        capture_method: "manual",
      });
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        { posterPaymentIntentId: paymentIntent.id },
        { new: true }
      );
      res.json({
        message: "Poster PaymentIntent created",
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        job,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }
);

app.post(
  "/jobs/:id/pay-shoveler",
  require("./middleware/auth"),
  async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100,
      currency: "usd",
      capture_method: "manual",
    });
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { shovelerPaymentIntentId: paymentIntent.id },
      { new: true }
    );
    res.json({
      message: "Shoveler PaymentIntent created",
      paymentIntentId: paymentIntent.id,
      job,
    });
  }
);

// Confirm PaymentIntent route
app.post("/confirm-payment-intent", async (req, res) => {
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
});

// Cron job to clean up unmatched jobs older than 24 hours
const cron = require("node-cron");
cron.schedule("0 * * * *", async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const oldJobs = await Job.find({
    matchedApplication: null,
    createdAt: { $lt: cutoff },
  });
  for (const job of oldJobs) {
    if (job.posterPaymentIntentId) {
      await stripe.paymentIntents.cancel(job.posterPaymentIntentId);
    }
    if (job.shovelerPaymentIntentId) {
      await stripe.paymentIntents.cancel(job.shovelerPaymentIntentId);
    }
    await job.remove();
  }
  console.log(
    "Cleanup found:",
    oldJobs.length,
    "unmatched jobs older than 24 hours"
  );
});

app.post(
  "/jobs/:id/finalize",
  require("./middleware/auth"),
  async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    try {
      const capPoster = await stripe.paymentIntents.capture(
        job.posterPaymentIntentId
      );
      const capShoveler = await stripe.paymentIntents.capture(
        job.shovelerPaymentIntentId
      );
      job.status = "finalized";
      await job.save();
      res.json({ message: "Job finalized", capPoster, capShoveler });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

app.get("/myfinalizedjobs", require("./middleware/auth"), async (req, res) => {
  try {
    const jobs = await Job.find({
      poster: req.userId,
      status: "finalized",
    }).populate("poster", "email");
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const requireAuth = require("./middleware/auth");

app.delete("/jobs/:id", requireAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    // Ensure only the poster can delete
    if (job.poster.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this job" });
    }
    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/myapplications", require("./middleware/auth"), async (req, res) => {
  const Application = require("./models/Application");
  try {
    const applications = await Application.find({
      applicant: req.userId,
    }).populate("job");
    res.json(applications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete(
  "/applications/:id",
  require("./middleware/auth"),
  async (req, res) => {
    const Application = require("./models/Application");
    const Job = require("./models/Job");

    try {
      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // If the application is rejected, only allow deletion by the applicant
      if (application.status === "rejected") {
        if (application.applicant.toString() !== req.userId) {
          return res.status(403).json({
            error: "Only the applicant can delete a rejected application",
          });
        }
      } else {
        // For non-rejected applications, allow deletion by either the applicant or the job poster
        const job = await Job.findById(application.job);
        if (!job) {
          return res
            .status(404)
            .json({ error: "No job found for this application" });
        }
        const isApplicant = application.applicant.toString() === req.userId;
        const isPoster = job.poster.toString() === req.userId;
        if (!isApplicant && !isPoster) {
          return res.status(403).json({
            error:
              "Only the applicant or job poster can delete this application",
          });
        }
      }

      await Application.findByIdAndDelete(req.params.id);
      res.json({ message: "Application deleted" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Attach the PaymentIntent to the job (update-poster-intent)
app.put(
  "/jobs/:id/update-poster-intent",
  require("./middleware/auth"),
  async (req, res) => {
    const { paymentIntentId } = req.body;
    try {
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        { posterPaymentIntentId: paymentIntentId },
        { new: true }
      );
      if (!job) return res.status(404).json({ error: "Job not found" });
      res.json({ message: "Updated posterPaymentIntentId", job });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Attach the PaymentIntent to the job for the shoveler
app.put(
  "/jobs/:id/update-shoveler-intent",
  require("./middleware/auth"),
  async (req, res) => {
    const { paymentIntentId } = req.body;
    try {
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        { shovelerPaymentIntentId: paymentIntentId },
        { new: true }
      );
      if (!job) return res.status(404).json({ error: "Job not found" });
      res.json({ message: "Updated shovelerPaymentIntentId", job });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all chat messages for a job
app.get("/chat/:jobId", require("./middleware/auth"), async (req, res) => {
  const ChatMessage = require("./models/ChatMessage");
  try {
    const messages = await ChatMessage.find({ job: req.params.jobId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /jobs/:id to update all fields
app.put("/jobs/:id", requireAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Ensure only the original poster can edit
    if (job.poster.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized to edit this job" });
    }

    // Update fields from req.body (only if they exist, else keep old)
    job.title = req.body.title || job.title;
    job.description = req.body.description || job.description;
    job.category = req.body.category || job.category;
    job.city = req.body.city || job.city;
    job.province = req.body.province || job.province;
    job.country = req.body.country || job.country;
    job.nearby = req.body.nearby || job.nearby;
    job.budget = req.body.budget || job.budget;
    job.schedule = req.body.schedule || job.schedule;

    // Force posted date to "now" so it appears updated
    job.createdAt = new Date();

    await job.save();
    res.json({ message: "Job updated", job });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route for poster to reject an application (update its status to "rejected")
app.put(
  "/applications/:id/reject",
  require("./middleware/auth"),
  async (req, res) => {
    const Application = require("./models/Application");
    try {
      const updatedApplication = await Application.findByIdAndUpdate(
        req.params.id,
        { status: "rejected" },
        { new: true }
      );
      res.json({
        message: "Application rejected",
        application: updatedApplication,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Socket.IO setup with chat functionality and joinRoom check
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const ChatMessage = require("./models/ChatMessage");

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

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

server.listen(4000, () => console.log(`Server running on port 4000`));

// controllers/jobController.js
const Job = require("../models/Job");
const Application = require("../models/Application");
const stripe = require("stripe")(
  "sk_test_51R3PLrLUNYmhvJIJNEY5Pem55ZQSsnfjAhDamz15qXb1MyTq8ca5Qy9ixK7aadcXNSf3XaaVIsTHKgGJNvvi9zPx00ZKgdmMT0"
);

// POST /jobs
exports.createJob = async (req, res) => {
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
      schedule,
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
      schedule,
      poster: req.userId,
    });

    res.json({ message: "Job created", job });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("poster", "email");
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("poster", "email");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /jobs/:id/payment
exports.updateJobPayment = async (req, res) => {
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
};

// POST /jobs/:id/apply
// controllers/jobController.js
exports.applyToJob = async (req, res) => {
  const { quotedPrice } = req.body;
  try {
    // 1. Find the job
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // 2. Prevent user from applying to their own job
    if (job.poster.toString() === req.userId) {
      return res.status(400).json({
        error: "You cannot apply to your own job",
      });
    }

    // 3. Check if the user already has an application for this job
    let application = await Application.findOne({
      job: req.params.id,
      applicant: req.userId,
    });

    // 4. If application exists and was previously rejected, allow re-apply
    if (application) {
      if (application.status === "rejected") {
        application.attempt = (application.attempt || 1) + 1;
        application.status = "pending";
        application.quotedPrice = quotedPrice;
        await application.save();
        console.log("Re-applied, new attempt:", application.attempt);
      } else {
        // Otherwise, user already applied
        return res
          .status(400)
          .json({ error: "You have already applied for this job" });
      }
    } else {
      // 5. Create a new application
      application = await Application.create({
        job: req.params.id,
        applicant: req.userId,
        quotedPrice,
        status: "pending",
        attempt: 1,
      });
      console.log("New application created, attempt:", application.attempt);
    }

    // 6. Return success
    res.json({ message: "Applied to job", application });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /jobs/:id/applications
exports.getJobApplications = async (req, res) => {
  const Application = require("../models/Application");
  try {
    const applications = await Application.find({
      job: req.params.id,
    }).populate("applicant", "email");
    res.json(applications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /jobs/:id/match
exports.matchJob = async (req, res) => {
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
};

// POST /jobs/:id/pay-poster
exports.payPoster = async (req, res) => {
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
};

// POST /jobs/:id/pay-shoveler
exports.payShoveler = async (req, res) => {
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
};

// POST /jobs/:id/finalize
exports.finalizeJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  if (job.status === "finalized") {
    return res.status(400).json({ error: "Job is already finalized" });
  }
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
};

// GET /myjobs
exports.getMyJobs = async (req, res) => {
  try {
    console.log("Logged-in user:", req.userId);
    const jobs = await Job.find({ poster: req.userId }).populate(
      "poster",
      "email"
    );
    jobs.forEach((job) => {
      console.log("Job poster:", job.poster);
    });
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /myfinalizedjobs
exports.getMyFinalizedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      poster: req.userId,
      status: "finalized",
    }).populate("poster", "email");
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
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
};

// PUT /jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.poster.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized to edit this job" });
    }
    job.title = req.body.title || job.title;
    job.description = req.body.description || job.description;
    job.category = req.body.category || job.category;
    job.city = req.body.city || job.city;
    job.province = req.body.province || job.province;
    job.country = req.body.country || job.country;
    job.nearby = req.body.nearby || job.nearby;
    job.budget = req.body.budget || job.budget;
    job.schedule = req.body.schedule || job.schedule;
    job.createdAt = new Date(); // Force posted date to "now"
    await job.save();
    res.json({ message: "Job updated", job });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /jobs/:id/update-poster-intent
exports.updatePosterIntent = async (req, res) => {
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
};

// PUT /jobs/:id/update-shoveler-intent
exports.updateShovelerIntent = async (req, res) => {
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
};

// controllers/jobController.js (excerpt)
exports.getMyJobsWithResponses = async (req, res) => {
  try {
    // 1. Find all jobs for the logged-in user (the poster)
    const jobs = await Job.find({ poster: req.userId });

    // 2. For each job, fetch non-rejected applications
    //    and attach them as "responses"
    const enrichedJobs = [];
    for (const job of jobs) {
      const apps = await Application.find({
        job: job._id,
        status: { $ne: "rejected" },
      });
      const jobObj = job.toObject(); // convert Mongoose doc to plain object
      jobObj.responses = apps;
      enrichedJobs.push(jobObj);
    }

    res.json(enrichedJobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

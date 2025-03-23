// routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const requireAuth = require("../middleware/auth");

// POST /jobs
router.post("/", requireAuth, jobController.createJob);

// GET /jobs
router.get("/", requireAuth, jobController.getAllJobs);

// GET /jobs/:id
router.get("/:id", requireAuth, jobController.getJobById);

// PUT /jobs/:id/payment
router.put("/:id/payment", requireAuth, jobController.updateJobPayment);

// POST /jobs/:id/apply
router.post("/:id/apply", requireAuth, jobController.applyToJob);

// GET /jobs/:id/applications
router.get("/:id/applications", requireAuth, jobController.getJobApplications);

// PUT /jobs/:id/match
router.put("/:id/match", requireAuth, jobController.matchJob);

// POST /jobs/:id/pay-poster
router.post("/:id/pay-poster", requireAuth, jobController.payPoster);

// POST /jobs/:id/pay-shoveler
router.post("/:id/pay-shoveler", requireAuth, jobController.payShoveler);

// POST /jobs/:id/finalize
router.post("/:id/finalize", requireAuth, jobController.finalizeJob);

// GET /myjobs
router.get("/myjobs/all", requireAuth, jobController.getMyJobs);

// GET /myfinalizedjobs
router.get("/myjobs/finalized", requireAuth, jobController.getMyFinalizedJobs);

// DELETE /jobs/:id
router.delete("/:id", requireAuth, jobController.deleteJob);

// PUT /jobs/:id
router.put("/:id", requireAuth, jobController.updateJob);

// PUT /jobs/:id/update-poster-intent
router.put(
  "/:id/update-poster-intent",
  requireAuth,
  jobController.updatePosterIntent
);

// PUT /jobs/:id/update-shoveler-intent
router.put(
  "/:id/update-shoveler-intent",
  requireAuth,
  jobController.updateShovelerIntent
);

// GET /jobs/myjobs/responses
router.get(
  "/myjobs/responses",
  requireAuth,
  jobController.getMyJobsWithResponses
);

module.exports = router;

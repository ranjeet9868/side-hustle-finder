// backend/routes/activeChats.js
const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const Job = require("../models/Job");
const Application = require("../models/Application");

// GET /active-chats
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.userId; // from JWT

    // 1. Find all jobs with matchedApplication not null
    // 2. Populate 'matchedApplication' and 'poster'
    let jobs = await Job.find({
      matchedApplication: { $ne: null },
    })
      .populate("matchedApplication")
      .populate("poster", "email"); // get poster's email

    // 3. Filter to keep only those where the current user is:
    //    - the poster, OR
    //    - the applicant in matchedApplication
    const filtered = [];
    for (const job of jobs) {
      const isPoster = job.poster && job.poster._id.toString() === userId;
      const isApplicant =
        job.matchedApplication &&
        job.matchedApplication.applicant &&
        job.matchedApplication.applicant.toString() === userId;
      if (isPoster || isApplicant) {
        filtered.push(job);
      }
    }

    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

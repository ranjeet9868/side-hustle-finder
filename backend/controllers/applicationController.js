// controllers/applicationController.js
const Application = require("../models/Application");
const Job = require("../models/Job");

// PUT /applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ error: "Application not found" });
    }
    // If accepted, update job.matchedApplication
    if (status === "accepted") {
      const job = await Job.findById(updatedApplication.job);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      job.matchedApplication = updatedApplication._id;
      await job.save();
    }
    res.json({
      message: "Application status updated",
      application: updatedApplication,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /applications/:id/reject
exports.rejectApplication = async (req, res) => {
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
};

// GET /myapplications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.userId,
    }).populate("job");
    res.json(applications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /applications/:id
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    // If the application is rejected, only applicant can delete
    if (application.status === "rejected") {
      if (application.applicant.toString() !== req.userId) {
        return res.status(403).json({
          error: "Only the applicant can delete a rejected application",
        });
      }
    } else {
      // For non-rejected apps, allow applicant or job poster
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
          error: "Only the applicant or job poster can delete this application",
        });
      }
    }
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

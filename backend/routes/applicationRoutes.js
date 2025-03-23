// routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const requireAuth = require("../middleware/auth");

// PUT /applications/:id/status
router.put(
  "/:id/status",
  requireAuth,
  applicationController.updateApplicationStatus
);

// PUT /applications/:id/reject
router.put("/:id/reject", requireAuth, applicationController.rejectApplication);

// GET /myapplications
router.get(
  "/myapplications",
  requireAuth,
  applicationController.getMyApplications
);

// DELETE /applications/:id
router.delete("/:id", requireAuth, applicationController.deleteApplication);

module.exports = router;

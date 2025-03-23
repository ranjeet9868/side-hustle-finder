// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const requireAuth = require("../middleware/auth");

// GET /chat/:jobId
router.get("/:jobId", requireAuth, chatController.getChatMessages);

module.exports = router;

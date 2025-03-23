// controllers/chatController.js
const ChatMessage = require("../models/ChatMessage");

// GET /chat/:jobId
exports.getChatMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ job: req.params.jobId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

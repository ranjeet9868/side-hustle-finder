// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const requireAuth = require("../middleware/auth");

// POST /register
router.post("/register", userController.register);

// POST /login
router.post("/login", userController.login);

// GET /user (protected)
router.get("/user", requireAuth, userController.getUserInfo);

// GET /protected (protected test)
router.get("/protected", requireAuth, userController.protectedTest);

module.exports = router;

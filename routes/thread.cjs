const express = require("express");
const router = express.Router();
const {
  getThreads,
  getSingleThread,
  updateThread,
  createThread,
} = require("../controllers/threadController.cjs");

// GET every takes
router.get("/", getThreads);

// GET one take
router.get("/:id", getSingleThread);

// PATCH one take
router.patch("/:id", updateThread);

// POST one take
router.post("/", createThread);

module.exports = router;

const express = require("express");
const router = express.Router();

// GET every threads
router.get("/", (req, res) => {
  res.json({ msg: "get all threads" });
});

// GET one thread
router.get("/:id", (req, res) => {
  res.json({ msg: "get one thread" });
});

// PATCH one take
router.patch("/:id", (req, res) => {
  res.json({ msg: "update thread" });
});

module.exports = router;

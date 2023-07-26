const Thread = require("../models/threadModel.cjs");
const mongoose = require("mongoose");

// GET every threads
const getThreads = async (req, res) => {
  const threads = await Thread.find({});
  if (!threads) {
    return res.status(204);
  }
  res.status(200).json(threads);
};

// GET one thread
const getSingleThread = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such thread" });
  }
  const thread = await Thread.findById(id);
  if (!thread) {
    return res.status(404).json({ error: "No such thread" });
  }

  res.status(200).json(thread);
};

// PATCH one thread
const updateThread = async (req, res) => {
  const { id } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such thread" });
  }
  const thread = await Thread.findOneAndUpdate({ _id: id }, ...req.body);
  if (!thread) {
    return res.status(404).json({ error: "No such thread" });
  }
  res.status(200).json(thread);
};

// Create thread
const createThread = async (req, res) => {
  const { opName, subject, comment, image } = req.body;
  try {
    const thread = await Thread.create({
      opName,
      subject,
      comment,
      image,
    });
    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getThreads, getSingleThread, updateThread, createThread };

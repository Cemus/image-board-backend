const mongoose = require("mongoose");
const { Thread, Reply } = require("../models/threadModel.cjs");

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

// POST thread
const createThread = async (req, res) => {
  const { opName, subject, comment, image } = req.body;
  try {
    const thread = await Thread.create({
      opName,
      subject,
      comment,
      image,
      replies: [],
    });
    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// PATCH reply
const createReply = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "bad ID" });
  }
  try {
    const newReply = await Reply.create({
      ...req.body,
      date: Date.now(),
    });
    await newReply.save();
    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({ error: "No such thread" });
    }
    thread.replies.push(newReply);

    await thread.save();
    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    console.log(error.message);
    console.log(error.stack);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getThreads,
  getSingleThread,
  createThread,
  createReply,
};

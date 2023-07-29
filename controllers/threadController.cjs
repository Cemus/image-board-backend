const { validateImageType } = require("../utils/validateImageType.cjs");
const { getImageMetadata } = require("../utils/getImageMetadata.cjs");
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

//GET images
const getImage = async (req, res) => {
  fs.readFile(directory_name, function (err, content) {
    if (err) {
      res.writeHead(400);
      console.log(err);
      res.end("No such image");
    } else {
      //specify the content type in the response will be an image
      res.writeHead(200);
      res.end(content);
    }
  });
};

// POST thread
const createThread = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file has been downloaded." });
  }
  const imagePath = req.file.path;
  const result = await validateImageType(imagePath);
  if (!result.ok) {
    console.error(result.error);
    return res.status(400).json({ error: "Invalid file format." });
  }
  const metadata = await getImageMetadata(imagePath);
  const { width, height } = metadata;
  try {
    const { opName, subject, comment } = req.body;
    const { size } = req.file;
    const thread = await Thread.create({
      opName,
      subject,
      comment,
      image: imagePath,
      imageWidth: width,
      imageheight: height,
      imageSize: Math.floor(size / 1000),
      replies: [],
    });
    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

// PATCH reply
const createReply = async (req, res) => {
  let imagePath = null;
  let width = 0;
  let height = 0;
  if (req.file) {
    imagePath = req.file.path;
    const result = await validateImageType(imagePath);
    if (!result.ok) {
      console.error(result.error);
      return res.status(400).json({ error: "Invalid file format." });
    }
    const metadata = await getImageMetadata(imagePath);
    width = metadata.width;
    height = metadata.height;
    console.log(width);
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "bad ID" });
  }
  try {
    const { name, comment } = req.body;
    const { size } = req.file;
    const newReply = await Reply.create({
      name,
      comment,
      image: imagePath,
      imageWidth: width,
      imageHeight: height,
      imageSize: Math.floor(size / 1000),
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
    console.log("final catch");
    console.log(error);
    console.log(error.message);
    console.log(error.stack);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getThreads,
  getSingleThread,
  createThread,
  createReply,
  getImage,
};

const { validateImageType } = require("../utils/validateImageType.cjs");
const { getImageMetadata } = require("../utils/getImageMetadata.cjs");
const mongoose = require("mongoose");
const { Thread, Reply } = require("../models/threadModel.cjs");
const fs = require("fs");
const { idFormat } = require("../utils/idFormat.cjs");
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
  const thread = await Thread.findById(id).populate("replies");
  if (!thread) {
    return res.status(404).json({ error: "No such thread" });
  }

  res.status(200).json(thread);
};

//GET images
const getImage = async (req, res) => {
  const { imagePath } = req.params;
  fs.readFile(imagePath, async function (err, imageBuffer) {
    if (err) {
      res.writeHead(400);
      console.log(err);
      res.end("No such image");
    } else {
      try {
        if (imagePath.endsWith(".jpg") || imagePath.endsWith(".jpeg")) {
          const jpegBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 85 })
            .toBuffer();
          const webpBuffer = await sharp(jpegBuffer).webp().toBuffer();

          res.setHeader("Content-Type", "image/webp");
          res.writeHead(200);
          res.end(webpBuffer);
        } else {
          res.writeHead(200);
          res.end(imageBuffer);
        }
      } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end("Failed to process the image.");
      }
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
      imageHeight: height,
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
  //Image
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
  }
  size = req.file ? req.file.size : 0;
  // Test ID
  const { id } = req.params;
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "bad ID" });
  }
  //Creation de la réponse
  const { name, comment } = req.body;
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

  newReply.formatedId = idFormat(newReply._id);
  await newReply.save();

  //Le thread
  const thread = await Thread.findById(id);
  if (!thread) {
    return res.status(404).json({ error: "No such thread" });
  }
  //La reponse est-elle une réponse à quelqu'un ?
  try {
    const regex = /(\d{8})/g;
    if (regex.test(comment)) {
      const matches = comment.match(regex);
      for (const match of matches) {
        const parentReply = await Reply.findOne({
          formatedId: match,
        });
        if (parentReply) {
          parentReply.replies.push(newReply.formatedId);
          await parentReply.save();
        } else {
          console.log(
            `Aucun commentaire parent trouvé pour la référence ${match}`
          );
        }
      }
    }

    thread.replies.push(newReply);

    await thread.save();
    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
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

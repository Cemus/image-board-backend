const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const replySchema = new Schema(
  {
    formatedId: {
      type: String,
    },
    name: {
      type: String,
      required: false,
      default: "Anonymous",
    },
    comment: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    imageWidth: {
      type: Number,
      required: false,
    },
    imageHeight: {
      type: Number,
      required: false,
    },
    imageSize: {
      type: Number,
      required: false,
    },
    replies: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const threadSchema = new Schema(
  {
    opName: {
      type: String,
      required: false,
      default: "Anonymous",
    },
    subject: {
      type: String,
      required: false,
    },
    comment: {
      type: String,
      required: false,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    imageWidth: {
      type: Number,
      required: false,
    },
    imageHeight: {
      type: Number,
      required: false,
    },
    imageSize: {
      type: Number,
      required: false,
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

const Thread = mongoose.model("Thread", threadSchema);
const Reply = mongoose.model("Reply", replySchema);

module.exports = { Thread, Reply };

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const replySchema = new Schema(
  {
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
    replies: [replySchema],
  },
  { timestamps: true }
);

const Thread = mongoose.model("Thread", threadSchema);
const Reply = mongoose.model("Reply", replySchema);

module.exports = { Thread, Reply };

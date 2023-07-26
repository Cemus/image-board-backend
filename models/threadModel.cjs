const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thread", threadSchema);

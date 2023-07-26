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

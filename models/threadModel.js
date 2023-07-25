const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const threadSchema = new Schema(
  {
    subject: {
      type: String,
      required: false,
    },
    comment: {
      type: String,
      required: true,
    },
    image: {
      type: File,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thread", threadSchema);

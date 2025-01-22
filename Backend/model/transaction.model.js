const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  captainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "captain",
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  transactionId: {
    type: String,
  },
  date: {
    type: String,
    default: new Date().toLocaleString(),
  },
  description: {
    type: String,
  },
});

const transaction = mongoose.model("transaction", transactionSchema);

module.exports = transaction;

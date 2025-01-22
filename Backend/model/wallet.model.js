const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  captainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "captain",
  },
  balance: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "INR",
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
    },
  ],
  createdOn: {
    type: String,
    default: new Date().toLocaleString(),
  },
});

const wallet = mongoose.model("wallet", walletSchema);

module.exports = wallet;

const mongoose = require("mongoose");

const blackListingTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // TTL in seconds (1 hour)
  },
});

const BlackListingToken = mongoose.model(
  "BlackListingToken",
  blackListingTokenSchema
);

module.exports = BlackListingToken;

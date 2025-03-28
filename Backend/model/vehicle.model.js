const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  vehicleName: {
    type: String,
    required: true,
  },
  baseFare: {
    type: Number,
    required: true,
  },
  discountedFare: {
    type: Number,
    required: true,
  },
  perKmRate: {
    type: Number,
    required: true,
  },
  perMinuteRate: {
    type: Number,
    required: true,
  },
  vehicleImage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
});

const vehicle = mongoose.model("vehicle", vehicleSchema);

module.exports = vehicle;
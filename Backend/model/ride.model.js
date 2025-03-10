const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "captain",
  },
  pickup: {
    type: String,
    required: true,
  },
  pickupLatLng: {
    ltd: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  destination: {
    type: String,
    required: true,
  },
  destinationLatLng: {
    ltd: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  vehicleRequired: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  captainFare: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending",
  },
  duration: {
    type: Number,
  }, // in seconds
  distance: {
    type: Number,
  }, // in meters
  paymentDetails: {
    status: {
      type: Number,
      default: 0,
    },
    paymentId: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
    },
    isCaptainPaid: {
      type: Number,
      default: 0,
    },
    isWalletPayment: {
      type: Number,
      default: 0,
    },
    isUserReturnRideAmountPaid: {
      type: Number,
      default: 0,
    },
    isUserReturnRideAmountPaid:{
      type: Number,
      default: 0,
    }
  },
  orderId: {
    type: String,
  },
  signature: {
    type: String,
  },
  otp: {
    type: Number,
    select: false,
    required: true,
  },
  createOn: {
    type: String,
    default: new Date().toLocaleString(),
  },
});

const rideModel = mongoose.model("ride", rideSchema);

module.exports = rideModel;

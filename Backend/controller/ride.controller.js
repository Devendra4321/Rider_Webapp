const rideService = require("../services/ride.service");
const rideModel = require("../model/ride.model");
const mapService = require("../services/map.service");
const { sendMessageToSocketId } = require("../socket");
const captainModel = require("../model/captain.model");
const razorpay = require("../razorpay.config");
const crypto = require("crypto");

module.exports.createRide = async (req, res, next) => {
  const { pickup, destination, vehicleType, paymentMethod } = req.body;

  if (!pickup || !destination || !vehicleType) {
    res.status(400).json({
      statusCode: 400,
      message: "All information required",
    });
  }

  const fare = await rideService.getFare(pickup, destination);

  try {
    const ride = new rideModel({
      user: req.user._id,
      pickup,
      destination,
      otp: rideService.getOtp(6),
      paymentDetails: {
        paymentMethod: paymentMethod,
      },
      fare: fare[vehicleType], // minus 10% of fare
      captainFare: (fare[vehicleType] * 0.9).toFixed(2), // minus 10% of fare
    });

    await ride.save();

    res.status(201).json({
      statusCode: 201,
      message: "Ride created",
      ride: ride,
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

module.exports.confirm = async (req, res, next) => {
  const { rideId } = req.body;

  if (!rideId) {
    res.status(400).json({
      statusCode: 400,
      message: "Ride id required",
    });
  }

  try {
    const rideAcceptStatus = await rideModel.findOneAndUpdate(
      { _id: rideId },
      { status: "accepted", captain: req.captain._id }
    );

    const ride = await rideModel
      .findOne({
        _id: rideId,
      })
      .populate("user")
      .populate("captain")
      .select("+otp");

    if (!ride) {
      res.status(400).json({
        statusCode: 400,
        message: "Ride not found",
      });
    }

    //send notification to user ride accepted
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    res.status(200).json({
      statusCode: 200,
      message: "Ride accepted by captain",
      ride: ride,
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

module.exports.startRide = async (req, res, next) => {
  const { rideId, otp } = req.body;

  if (!rideId || !otp) {
    return res.status(400).json({
      statusCode: 400,
      message: "Ride id and OTP are required",
    });
  }

  try {
    const ride = await rideModel
      .findOne({
        _id: rideId,
      })
      .populate("user")
      .populate("captain")
      .select("+otp");

    if (!ride) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not found",
      });
    }

    if (ride.status !== "accepted") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not accepted by any captain",
      });
    }

    if (ride.otp !== otp) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid OTP",
      });
    }

    await rideModel.findOneAndUpdate(
      {
        _id: rideId,
      },
      {
        status: "ongoing",
      }
    );

    // Send notification to user ride started
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Ride started by captain",
      ride: ride,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error" });
  }
};

module.exports.endRide = async (req, res, next) => {
  const { rideId } = req.body;

  if (!rideId) {
    return res.status(400).json({
      statusCode: 400,
      message: "Ride id is required",
    });
  }

  try {
    const ride = await rideModel
      .findOne({
        _id: rideId,
      })
      .populate("user")
      .populate("captain");

    if (!ride) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not found",
      });
    }

    if (ride.status !== "ongoing") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not started by any captain",
      });
    }

    await rideModel.findOneAndUpdate(
      {
        _id: rideId,
      },
      {
        status: "completed",
      }
    );

    await captainModel.findOneAndUpdate(
      {
        _id: req.captain.id,
      },
      {
        // todaysEarn: (req.captain.todaysEarn + ride.captainFare).toFixed(2),
        totalEarning: (req.captain.totalEarning + ride.captainFare).toFixed(2),
      }
    );

    const rides = await rideModel
      .findOne({
        _id: rideId,
      })
      .populate("user")
      .populate("captain");

    // Send notification to user ride completed
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Ride completed by captain",
      ride: rides,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error" });
  }
};

module.exports.cancelUserRide = async (req, res, next) => {
  const { rideId } = req.body;

  if (!rideId) {
    return res.status(400).json({
      statusCode: 400,
      message: "Ride id is required",
    });
  }

  try {
    const ride = await rideModel
      .findOne({
        _id: rideId,
      })
      .populate("user")
      .populate("captain");

    if (!ride) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not found",
      });
    }

    if (ride.status == "ongoing") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride cannot cancel after start ride",
      });
    }

    if (ride.status == "completed") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride already completed",
      });
    }

    if (ride.status == "cancelled") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride already cancelled",
      });
    }

    // if (ride.status == "accepted") {
    await rideModel.findOneAndUpdate(
      {
        _id: rideId,
        status: "accepted",
      },
      {
        status: "cancelled",
      }
    );

    // Send notification to captain to ride cancelled
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-user-cancelled",
      data: ride,
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Ride cancelled by user",
      ride: ride,
    });
    // }
  } catch (error) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error" });
  }
};

module.exports.sendNotification = async (req, res, next) => {
  const { rideId } = req.body;

  try {
    const ride = await rideModel.findOne({ _id: rideId }).populate("user");

    if (!ride) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not found",
      });
    }

    if (
      ride.status == "accepted" ||
      ride.status == "ongoing" ||
      ride.status == "completed" ||
      ride.status == "cancelled"
    ) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride already accepted or ongoing or completed or cancelled",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Notification sent to captains",
    });

    const pickupCoordinates = await mapService.getCoordinates(ride.pickup);

    console.log(pickupCoordinates);

    const captainInRadius = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.latitude,
      pickupCoordinates.longitude,
      3
    );

    console.log(captainInRadius);

    ride.otp = "";

    //send ride to captain in radius
    captainInRadius.map((captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: ride,
      });
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

module.exports.upadatePaymentStatus = async (req, res, next) => {
  const { rideId } = req.body;

  if (!rideId) {
    return res.status(400).json({
      statusCode: 400,
      message: "Ride id is required",
    });
  }

  try {
    const ride = await rideModel.findOne({ _id: rideId });

    if (ride.paymentDetails.status == 1) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride payment status alredy updated",
      });
    }

    const updatedRide = await rideModel.findByIdAndUpdate(
      rideId,
      {
        paymentDetails: {
          paymentMethod: ride.paymentDetails.paymentMethod,
          status: 1,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Payment status updated",
      ride: updatedRide,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error" });
  }
};

module.exports.paymentInit = async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({
      statusCode: 400,
      message: "Amount required",
    });
  }

  try {
    const options = {
      amount: Number(amount * 10),
      currency: "INR",
      receipt: `receipt# ${crypto.randomBytes(10).toString("hex")}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(400).json({
        statusCode: 400,
        message: "Payment order not created",
      });
    }

    res.status(200).json({
      statusCode: 200,
      order,
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

module.exports.paymentVerify = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      statusCode: 400,
      message: "All information required",
    });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.ROZARPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = generatedSignature === razorpay_signature;

  if (isAuthentic) {
    res.status(200).json({
      statusCode: 200,
      message: "Payment successful",
      razorpay_payment_id,
    });
    // res.redirect(
    //   `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
    // );
  } else {
    res.status(400).json({
      statusCode: 400,
      message: "Payment failed",
    });
  }
};

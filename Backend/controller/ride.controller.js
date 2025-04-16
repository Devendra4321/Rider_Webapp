const rideService = require("../services/ride.service");
const rideModel = require("../model/ride.model");
const mapService = require("../services/map.service");
const {
  sendMessageToSocketId,
  sendMessageToBothSocketId,
} = require("../socket");
const captainModel = require("../model/captain.model");
const razorpay = require("../razorpay.config");
const crypto = require("crypto");
const transporter = require("../mail.config");
const couponModel = require("../model/coupon.model");
const vehicleModel = require("../model/vehicle.model");
const reviewModel = require("../model/review.model");

module.exports.createRide = async (req, res, next) => {
  const { pickup, destination, vehicleType, paymentMethod, couponCode, totalDiscountedFare } = req.body;

  if (!pickup || !destination || !vehicleType || !paymentMethod) {
    res.status(400).json({
      statusCode: 400,
      message: "All information required",
    });
  }

  const fare = await rideService.getFare(pickup, destination);
  
  const selectedVehicle = fare.find(vehicle => vehicle.vehicleType === vehicleType);
  
  const pickupLatLng = await mapService.getCoordinates(pickup);

  const destinationLatLng = await mapService.getCoordinates(destination);

  const coupon = await couponModel.findOne({
    code: couponCode,
  });

  try {
    const ride = new rideModel({
      user: req.user._id,
      pickup,
      pickupLatLng: {
        ltd: pickupLatLng.latitude,
        lng: pickupLatLng.longitude,
      },
      destination,
      destinationLatLng: {
        ltd: destinationLatLng.latitude,
        lng: destinationLatLng.longitude,
      },
      otp: rideService.getOtp(6),
      paymentDetails: {
        paymentMethod: paymentMethod,
      },
      vehicleRequired: vehicleType,
      fare: selectedVehicle.discountedFare,
      captainFare: (selectedVehicle.discountedFare * 0.9).toFixed(2), // minus 10% of fare
    });

    ride.couponDetails.coupon = coupon?._id;
    if(coupon){
      ride.couponDetails.totalDiscountedFare = totalDiscountedFare;
      ride.couponDetails.couponApplied = 1;
    }else{
      ride.couponDetails.totalDiscountedFare = fare[vehicleType];
    }
    await ride.save();

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: req.user.email,
      subject: "Rider app Ride Created Successfully",
      html: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
  <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;">Rider App</span></h1>
  <p style="font-size: 16px; color: #555;">Hello <strong>${
    req.user.fullname.firstname
  }</strong>,</p>
  <p style="font-size: 16px; color: #555;">You have successfully generated a ride. Below are your ride details:</p>
  <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="font-size: 16px; color: #555;"><strong>Ride ID:</strong> ${
      ride.id
    }</p>
    <p style="font-size: 16px; color: #555;"><strong>Pickup Location:</strong> ${
      ride.pickup
    }</p>
    <p style="font-size: 16px; color: #555;"><strong>Drop Location:</strong> ${
      ride.destination
    }</p>
    <p style="font-size: 16px; color: #555;"><strong>Estimated Fare:</strong> ${
      ride.fare
    }</p>
  </div>
  <p style="font-size: 14px; color: #666;">If you need any modifications or assistance, please reach out to our support team.</p>
  <p style="font-size: 14px; color: #666; text-align: center;">
    Need help? Contact us at <a href="mailto:support@riderapp.com" style="color: #007BFF; text-decoration: none;">support@riderapp.com</a>
  </p>
  <footer style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Rider App. All rights reserved.</p>
    <p style="margin: 0;">
      <a href="#" style="color: #007BFF; text-decoration: none;">Terms of Service</a> |
      <a href="#" style="color: #007BFF; text-decoration: none;">Privacy Policy</a>
    </p>
  </footer>
</div>
      `,
    });

    res.status(201).json({
      statusCode: 201,
      message: "Ride created",
      ride: ride,
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal server error", error: error.message });
  }
};

module.exports.confirm = async (req, res, next) => {
  const { rideId } = req.body;
  const id = req.captain._id;

  if (!rideId) {
    return res.status(400).json({
      statusCode: 400,
      message: "Ride id required",
    });
  }

  try {
    const oldRide = await rideModel.findOne({ _id: rideId });

    if (oldRide && oldRide.status == "accepted") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride is already accepted by another captain",
      });
    }

    const rideAcceptStatus = await rideModel.findOneAndUpdate(
      { _id: rideId },
      { status: "accepted", captain: id }
    );

    const ride = await rideModel
      .findOne({ _id: rideId })
      .populate("user")
      .populate("captain")
      .select("+otp");

    if (!ride) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not found",
      });
    }

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: ride.user.email,
      subject: "Rider app Ride Accepted By Captain Successfully",
      html: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
  <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;">Rider App</span></h1>
  <p style="font-size: 16px; color: #555;">Hello <strong>${
    ride.user.fullname.firstname
  }</strong>,</p>
  <p style="font-size: 16px; color: #555;">Your ride has been confirmed! Below are your ride details:</p>
  <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="font-size: 16px; color: #555;"><strong>Ride ID:</strong> ${
      ride.id
    }</p>
    <p style="font-size: 16px; color: #555;"><strong>Pickup Location:</strong> ${
      ride.pickup
    }</p>
    <p style="font-size: 16px; color: #555;"><strong>Drop-off Location:</strong> ${
      ride.destination
    }</p>
    <p style="font-size: 16px; color: #555;"><strong>Estimated Fare:</strong> ${
      ride.fare
    }</p>
  </div>
  <p style="font-size: 16px; color: #555;">Your assigned captain details:</p>
  <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="font-size: 16px; color: #555;"><strong>Captain Name:</strong> ${
      req.captain.fullname.firstname
    } ${req.captain.fullname.lastname}</p>
    <p style="font-size: 16px; color: #555;"><strong>Vehicle Number:</strong> ${
      req.captain.vehicle.plate
    }</p>
  </div>
  <p style="font-size: 14px; color: #666;">If you need any modifications or assistance, please reach out to our support team.</p>
  <p style="font-size: 14px; color: #666; text-align: center;">
    Need help? Contact us at <a href="mailto:support@riderapp.com" style="color: #007BFF; text-decoration: none;">support@riderapp.com</a>
  </p>
  <footer style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Rider App. All rights reserved.</p>
    <p style="margin: 0;">
      <a href="#" style="color: #007BFF; text-decoration: none;">Terms of Service</a> |
      <a href="#" style="color: #007BFF; text-decoration: none;">Privacy Policy</a>
    </p>
  </footer>
</div>
      `,
    });

    // Send notification to user about ride acceptance
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Ride accepted by captain",
      ride: ride,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
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
    const exRide = await rideModel
      .findOne({
        _id: rideId,
      })
      .populate("user")
      .populate("captain")
      .select("+otp");

    if (!exRide) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not found",
      });
    }

    if (exRide.status !== "accepted") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not accepted by any captain",
      });
    }

    if (exRide.otp !== otp) {
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

    const ride = await rideModel
      .findOne({
        _id: rideId,
      })
      .populate("user")
      .populate("captain")
      .select("+otp");

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: ride.user.email,
      subject: "Rider app Ride Started Successfully",
      html: `
  <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
    <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;">Rider App</span></h1>
    <p style="font-size: 16px; color: #555;">Hello <strong>${
      ride.user.fullname.firstname
    }</strong>,</p>
    <p style="font-size: 16px; color: #555;">Your ride has been started! Below are your ride details:</p>
    <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="font-size: 16px; color: #555;"><strong>Ride ID:</strong> ${
        ride.id
      }</p>
      <p style="font-size: 16px; color: #555;"><strong>Pickup Location:</strong> ${
        ride.pickup
      }</p>
      <p style="font-size: 16px; color: #555;"><strong>Drop-off Location:</strong> ${
        ride.destination
      }</p>
      <p style="font-size: 16px; color: #555;"><strong>Estimated Fare:</strong> ${
        ride.fare
      }</p>
    </div>
    <p style="font-size: 16px; color: #555;">Your assigned captain details:</p>
    <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="font-size: 16px; color: #555;"><strong>Captain Name:</strong> ${
        ride.captain.fullname.firstname
      } ${ride.captain.fullname.lastname}</p>
      <p style="font-size: 16px; color: #555;"><strong>Vehicle Number:</strong> ${
        ride.captain.vehicle.plate
      }</p>
    </div>
    <p style="font-size: 14px; color: #666;">If you need any modifications or assistance, please reach out to our support team.</p>
    <p style="font-size: 14px; color: #666; text-align: center;">
      Need help? Contact us at <a href="mailto:support@riderapp.com" style="color: #007BFF; text-decoration: none;">support@riderapp.com</a>
    </p>
    <footer style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} Rider App. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="#" style="color: #007BFF; text-decoration: none;">Terms of Service</a> |
        <a href="#" style="color: #007BFF; text-decoration: none;">Privacy Policy</a>
      </p>
    </footer>
  </div>
        `,
    });

    // Send notification to user and captain ride started
    sendMessageToBothSocketId(ride.user.socketId, ride.captain.socketId, {
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
      },
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

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: rides.user.email,
      subject: "Rider app Ride Completed Successfully",
      html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
      <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;">Rider App</span></h1>
      <p style="font-size: 16px; color: #555;">Hello <strong>${
        rides.user.fullname.firstname
      }</strong>,</p>
      <p style="font-size: 16px; color: #555;">Your ride has been completed! Below are your ride details:</p>
      <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="font-size: 16px; color: #555;"><strong>Ride ID:</strong> ${
          rides.id
        }</p>
        <p style="font-size: 16px; color: #555;"><strong>Pickup Location:</strong> ${
          rides.pickup
        }</p>
        <p style="font-size: 16px; color: #555;"><strong>Drop-off Location:</strong> ${
          rides.destination
        }</p>
        <p style="font-size: 16px; color: #555;"><strong>Estimated Fare:</strong> ${
          rides.fare
        }</p>
      </div>
      <p style="font-size: 16px; color: #555;">Your assigned captain details:</p>
      <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="font-size: 16px; color: #555;"><strong>Captain Name:</strong> ${
          rides.captain.fullname.firstname
        } ${rides.captain.fullname.lastname}</p>
        <p style="font-size: 16px; color: #555;"><strong>Vehicle Number:</strong> ${
          rides.captain.vehicle.plate
        }</p>
      </div>
      <p style="font-size: 14px; color: #666;">If you need any modifications or assistance, please reach out to our support team.</p>
      <p style="font-size: 14px; color: #666; text-align: center;">
        Need help? Contact us at <a href="mailto:support@riderapp.com" style="color: #007BFF; text-decoration: none;">support@riderapp.com</a>
      </p>
      <footer style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Rider App. All rights reserved.</p>
        <p style="margin: 0;">
          <a href="#" style="color: #007BFF; text-decoration: none;">Terms of Service</a> |
          <a href="#" style="color: #007BFF; text-decoration: none;">Privacy Policy</a>
        </p>
      </footer>
    </div>
          `,
    });

    // Send notification to user and captain ride completed
    sendMessageToBothSocketId(ride.user.socketId, ride.captain.socketId, {
      event: "ride-ended",
      data: rides,
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
    const existingRide = await rideModel
      .findOne({
        _id: rideId,
      })
      .populate("user")
      .populate("captain");

    if (!existingRide) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not found",
      });
    }

    if (existingRide.status == "ongoing") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride cannot cancel after start ride",
      });
    }

    if (existingRide.status == "completed") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride already completed",
      });
    }

    if (existingRide.status == "cancelled") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride already cancelled",
      });
    }

    // if (ride.status == "accepted") {
    const ride = await rideModel.findOneAndUpdate(
      {
        _id: rideId,
        status: "accepted",
      },
      {
        status: "cancelled",
      },
      { new: true }
    ).populate("user")
    .populate("captain");

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: ride.user.email,
      subject: "Rider app Ride Cancelled By User Successfully",
      html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
      <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;">Rider App</span></h1>
      <p style="font-size: 16px; color: #555;">Hello <strong>${
        ride.user.fullname.firstname
      }</strong>,</p>
      <p style="font-size: 16px; color: #555;">Your ride has been cancelled! Below are your ride details:</p>
      <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="font-size: 16px; color: #555;"><strong>Ride ID:</strong> ${
          ride.id
        }</p>
        <p style="font-size: 16px; color: #555;"><strong>Pickup Location:</strong> ${
          ride.pickup
        }</p>
        <p style="font-size: 16px; color: #555;"><strong>Drop-off Location:</strong> ${
          ride.destination
        }</p>
        <p style="font-size: 16px; color: #555;"><strong>Estimated Fare:</strong> ${
          ride.fare
        }</p>
      </div>
      <p style="font-size: 16px; color: #555;">Your assigned captain details:</p>
      <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="font-size: 16px; color: #555;"><strong>Captain Name:</strong> ${
          ride.captain.fullname.firstname
        } ${ride.captain.fullname.lastname}</p>
        <p style="font-size: 16px; color: #555;"><strong>Vehicle Number:</strong> ${
          ride.captain.vehicle.plate
        }</p>
      </div>
      <p style="font-size: 14px; color: #666;">If you need any modifications or assistance, please reach out to our support team.</p>
      <p style="font-size: 14px; color: #666; text-align: center;">
        Need help? Contact us at <a href="mailto:support@riderapp.com" style="color: #007BFF; text-decoration: none;">support@riderapp.com</a>
      </p>
      <footer style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Rider App. All rights reserved.</p>
        <p style="margin: 0;">
          <a href="#" style="color: #007BFF; text-decoration: none;">Terms of Service</a> |
          <a href="#" style="color: #007BFF; text-decoration: none;">Privacy Policy</a>
        </p>
      </footer>
    </div>
          `,
    });

    // Send notification to user and captain to ride cancelled
    sendMessageToBothSocketId(ride.user.socketId, ride.captain.socketId, {
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
      .json({ statusCode: 500, message: error.message });
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

    const captainInRadiusStatus = captainInRadius.filter(
      (captain) =>
        captain.status == 2 &&
        captain.isOnline == true &&
        ride.vehicleRequired == captain.vehicle.vehicleType
    );

    console.log(captainInRadiusStatus);

    ride.otp = "";

    //send ride to captain in radius
    captainInRadiusStatus.map((captain) => {
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
  const { rideId, paymentId } = req.body;

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
          paymentId: paymentId,
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
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.error,
    });
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
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: req.user.email,
      subject: "Rider app Payment Successfully Verified",
      html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
  <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;">Rider App</span></h1>
  <p style="font-size: 16px; color: #555;">Hello <strong>${
    req.user.fullname.firstname
  }</strong>,</p>
  <p style="font-size: 16px; color: #555;">Your payment has been successfully <span style="color: #4CAF50;">verified</span>. Below are your transaction details:</p>
  <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="font-size: 16px; color: #555;"><strong>Order ID:</strong> ${razorpay_order_id}</p>
    <p style="font-size: 16px; color: #555;"><strong>Payment Id:</strong> ${razorpay_payment_id}</p>
    <p style="font-size: 16px; color: #555;"><strong>Payment Status:</strong> <span style="color: #4CAF50;">Confirmed</span></p>
  </div>
  <p style="font-size: 14px; color: #666;">If you have any questions or concerns regarding your payment, please reach out to our support team.</p>
  <p style="font-size: 14px; color: #666; text-align: center;">
    Need help? Contact us at <a href="mailto:support@riderapp.com" style="color: #007BFF; text-decoration: none;">support@riderapp.com</a>
  </p>
  <footer style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Rider App. All rights reserved.</p>
    <p style="margin: 0;">
      <a href="#" style="color: #007BFF; text-decoration: none;">Terms of Service</a> |
      <a href="#" style="color: #007BFF; text-decoration: none;">Privacy Policy</a>
    </p>
  </footer>
</div>
          `,
    });

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

module.exports.getRideById = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      statusCode: 400,
      message: "Ride ID is required",
    });
  }

  try {
    const ride = await rideModel
      .findById(id)
      .select("+otp")
      .populate("user")
      .populate("captain");

    if (!ride) {
      return res.status(404).json({
        statusCode: 404,
        message: "Ride not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Ride details retrieved successfully",
      ride: ride,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

module.exports.getVehiclePrices = async (req, res, next) => {
  const { pickup, destination } = req.body;

  if (!pickup || !destination) {
    res.status(400).json({
      statusCode: 400,
      message: "All information required",
    });
  }

  try {
    const fare = await rideService.getFare(pickup, destination);

    if (!fare) {
      res.status(400).json({
        statusCode: 400,
        message: "Vehicles prices are not calculated",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Vehicle prices fetched",
      data: fare,
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

module.exports.getAllVehicleNames = async (req, res, next) => {
  try {
    const vehicles = await vehicleModel.find({ isActive: true });

    if(vehicles.length === 0){
      return res.status(400).json({
        statusCode: 400,
        message: "Vehicles not found",
      });
    }

    const vehicleNames = vehicles.map(vehicle => vehicle.vehicleName);
    
    res.status(200).json({ statusCode: 200, vehicles: vehicleNames });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};

module.exports.addRideReview = async (req, res, next) => {
  try {
    const { ride, overallRating, vehicleRating, onTimeRating, driverBehaviourRating, comment } = req.body;

    if(!ride || !overallRating) {
      return res.status(400).json({
        statusCode: 400,
        message: "All information required",
      });
    }

    const existingRide = await rideModel.findById(ride);

    if(!existingRide) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not found",
      });
    }

    if(existingRide.status !== "completed") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride not completed",
      });
    }

    if(req.user.id !== existingRide.user.toString()) {
      return res.status(400).json({
        statusCode: 400,
        message: "You are not authorized to add review",
      });
    }

    const existingReview = await reviewModel.findOne({ ride: existingRide._id });

    if(existingReview) {
      return res.status(400).json({
        statusCode: 400,
        message: "Review already added",
      });
    }

    const review = new reviewModel({
      overallRating,
      vehicleRating,
      onTimeRating,
      driverBehaviourRating,
      comment,
      ride: existingRide._id,
      captain: existingRide.captain,
    });

    await review.save();

    await existingRide.updateOne({
      $push: {
        rideReview: review._id,
      },
    }, { new: true });

    await reviewModel.calculateAverageRatings(existingRide.captain);

    res.status(201).json({
      statusCode: 201,
      message: "Review added successfully",
      review,
    });   
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });   
  }
};
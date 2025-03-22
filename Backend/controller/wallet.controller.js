const walletModel = require("../model/wallet.model");
const transactionModel = require("../model/transaction.model");
const rideModel = require("../model/ride.model");
const captainModel = require("../model/captain.model");
const razorpay = require("../razorpay.config");
const crypto = require("crypto");
const transporter = require("../mail.config");

module.exports.getCaptainWallet = async (req, res, next) => {
  try {
    const wallet = await walletModel.findOne({ captainId: req.captain._id });

    if (!wallet) {
      return res.status(404).json({
        statusCode: 404,
        message: "Captain wallet not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Captain wallet found",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports.debitInCaptainWallet = async (req, res, next) => {
  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid input data",
      });
    }

    const ride = await rideModel.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        statusCode: 404,
        message: "Ride not found",
      });
    }

    if (ride.status !== "completed") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride is not completed yet",
      });
    }

    if (
      ride.paymentDetails.paymentMethod !== "cash" ||
      ride.paymentDetails.status !== 1
    ) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride payment method is not cash or payment is already done",
      });
    }

    if (ride.paymentDetails.isCaptainPaid !== 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride amount is already paid to captain",
      });
    }

    const amount = ride.fare - ride.captainFare;

    const wallet = await walletModel.findOne({ captainId: req.captain._id });

    if (!wallet) {
      return res.status(404).json({
        statusCode: 404,
        message: "Captain wallet not found",
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        statusCode: 400,
        message: "Insufficient balance",
      });
    }

    const balance = wallet.balance - amount;
    wallet.balance = balance.toFixed(2);

    const transaction = new transactionModel({
      captainId: req.captain._id,
      rideId: ride._id,
      amount: amount.toFixed(2),
      transactionType: "debit",
      description: "Ride amount debited from captain wallet",
    });

    await transaction.save();

    ride.paymentDetails.isCaptainPaid = 1;
    await ride.save();

    wallet.transactions.push(transaction._id);
    await wallet.save();

    res.status(200).json({
      statusCode: 200,
      message: "Amount debited successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports.creditInCaptainWallet = async (req, res, next) => {
  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid input data",
      });
    }

    const ride = await rideModel.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        statusCode: 404,
        message: "Ride not found",
      });
    }

    if (ride.status !== "completed") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride is not completed yet",
      });
    }

    if (
      (ride.paymentDetails.paymentMethod !== "online" &&
        ride.paymentDetails.paymentMethod !== "wallet") ||
      ride.paymentDetails.status !== 1
    ) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "Ride payment method is not online or wallet, or payment is not done",
      });
    }

    if (ride.paymentDetails.isCaptainPaid !== 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride amount is already paid to captain",
      });
    }

    const amount = ride.captainFare;

    const wallet = await walletModel.findOne({ captainId: req.captain._id });

    if (!wallet) {
      return res.status(404).json({
        statusCode: 404,
        message: "Captain wallet not found",
      });
    }

    const balance = wallet.balance + amount;
    wallet.balance = balance.toFixed(2);

    const transaction = new transactionModel({
      captainId: req.captain._id,
      rideId: ride._id,
      amount: amount.toFixed(2),
      transactionType: "credit",
      description: "Ride amount credited in captain wallet",
    });

    await transaction.save();

    wallet.transactions.push(transaction._id);
    ride.paymentDetails.isCaptainPaid = 1;

    await ride.save();
    await wallet.save();

    res.status(200).json({
      statusCode: 200,
      message: "Amount credited successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports.withdrawInCaptainWallet = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        statusCode: 400,
        message: "Enter amount to withdraw",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid amount",
      });
    }

    const wallet = await walletModel.findOne({ captainId: req.captain._id });

    if (!wallet) {
      return res.status(404).json({
        statusCode: 404,
        message: "Captain wallet not found",
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        statusCode: 400,
        message: "Insufficient balance",
      });
    }

    const balance = wallet.balance - amount;
    wallet.balance = balance.toFixed(2);

    if (balance < 500) {
      return res.status(400).json({
        statusCode: 400,
        message: "Minimum wallet balance of 500 Rs must be maintained",
      });
    }

    const transaction = new transactionModel({
      captainId: req.captain._id,
      amount: amount.toFixed(2),
      transactionType: "debit",
      description: "Amount withdrawn from captain wallet",
    });

    await transaction.save();

    wallet.transactions.push(transaction._id);
    await wallet.save();

    res.status(200).json({
      statusCode: 200,
      message: "Amount withdrawn successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports.AddInCaptainWallet = async (req, res, next) => {
  try {
    const { amount, transactionId } = req.body;

    if (!amount || !transactionId) {
      return res.status(400).json({
        statusCode: 400,
        message: "Enter valid information",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid amount",
      });
    }

    const wallet = await walletModel.findOne({ captainId: req.captain._id });

    if (!wallet) {
      return res.status(404).json({
        statusCode: 404,
        message: "Captain wallet not found",
      });
    }

    const balance = wallet.balance + amount;
    wallet.balance = balance.toFixed(2);

    const transaction = new transactionModel({
      captainId: req.captain._id,
      amount: amount.toFixed(2),
      transactionType: "credit",
      transactionId: transactionId,
      description: "Amount added in captain wallet",
    });

    await transaction.save();

    wallet.transactions.push(transaction._id);
    await wallet.save();

    res.status(200).json({
      statusCode: 200,
      message: "Amount added successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports.getAllCaptainWalletTransactions = async (req, res, next) => {
  try {
    const { page = 1, perPage = 5 } = req.body;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(perPage, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(pageSize) ||
      pageNumber <= 0 ||
      pageSize <= 0
    ) {
      return res.status(400).json({
        statuscode: 400,
        message:
          "Invalid pagination parameters. 'page' and 'perPage' must be positive integers.",
      });
    }

    const wallet = await walletModel.findOne({ captainId: req.captain._id });

    if (!wallet) {
      return res.status(404).json({
        statusCode: 404,
        message: "Captain wallet not found",
      });
    }

    const transactions = await transactionModel
      .find({ _id: { $in: wallet.transactions } })
      .populate("rideId")
      .sort({ _id: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalTransactions = await transactionModel
      .find({ _id: { $in: wallet.transactions } })
      .countDocuments();

    const totalPages = Math.ceil(totalTransactions / pageSize);

    res.status(200).json({
      statusCode: 200,
      message: "Captain wallet transactions",
      data: {
        totalTransactions,
        totalPages,
        transactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
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
    console.log(error.message);

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
      to: req.captain.email,
      subject: "Rider app Payment Successfully Verified",
      html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
  <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;">Rider App</span></h1>
  <p style="font-size: 16px; color: #555;">Hello <strong>${
    req.captain.fullname.firstname
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

module.exports.getUserWallet = async (req, res, next) => {
  try {
    const wallet = await walletModel.findOne({ userId: req.user._id });

    if (!wallet) {
      return res.status(404).json({
        statusCode: 404,
        message: "User wallet not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "User wallet found",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports.debitInUserWallet = async (req, res, next) => {
  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid input data",
      });
    }

    const ride = await rideModel.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        statusCode: 404,
        message: "Ride not found",
      });
    }

    if (ride.status !== "pending") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride is not in pending state",
      });
    }

    if (
      ride.paymentDetails.paymentMethod == "cash" ||
      ride.paymentDetails.paymentMethod == "online"
    ) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride payment method is either cash or online",
      });
    }

    if (ride.paymentDetails.status !== 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride amount is already paid from wallet",
      });
    }

    const wallet = await walletModel.findOne({ userId: req.user._id });

    if (!wallet) {
      return res.status(404).json({
        statusCode: 404,
        message: "User wallet not found",
      });
    }

    if (wallet.balance < ride.fare || wallet.balance < ride.couponDetails.totalDiscountedFare || wallet.balance <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Insufficient balance",
      });
    }

    if(ride.couponDetails.couponApplied === 1){
      wallet.balance = wallet.balance - ride.couponDetails.totalDiscountedFare;
      wallet.balance = wallet.balance.toFixed(2);
      amount = ride.couponDetails.totalDiscountedFare.toFixed(2);
    } else{
      wallet.balance = wallet.balance - ride.fare;
      wallet.balance = wallet.balance.toFixed(2);
      amount = ride.fare.toFixed(2);
    }

    const transaction = new transactionModel({
      userId: req.user._id,
      rideId: ride._id,
      amount: amount,
      transactionType: "debit",
      description: "Ride amount debited from user wallet",
    });

    await transaction.save();

    // ride.paymentDetails.isWalletPayment = 1;
    // await ride.save();

    wallet.transactions.push(transaction._id);
    await wallet.save();

    res.status(200).json({
      statusCode: 200,
      message: "Amount debited successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports.creditInUserWallet = async (req, res, next) => {
  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid input data",
      });
    }

    const ride = await rideModel.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        statusCode: 404,
        message: "Ride not found",
      });
    }

    if (ride.status !== "cancelled") {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride is not in cancelled state",
      });
    }

    if (
      (ride.paymentDetails.paymentMethod !== "online" &&
        ride.paymentDetails.paymentMethod !== "wallet") ||
      ride.paymentDetails.status !== 1
    ) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "Ride payment method is not online or wallet, or payment is not done",
      });
    }

    if (ride.paymentDetails.isUserReturnRideAmountPaid == 1) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride amount is already return to user wallet",
      });
    }

    const wallet = await walletModel.findOne({ userId: req.user._id });

    if (!wallet) {
      return res.status(404).json({
        statusCode: 404,
        message: "User wallet not found",
      });
    }

    if(ride.couponDetails.couponApplied === 1){
      wallet.balance = wallet.balance + ride.couponDetails.totalDiscountedFare;
      wallet.balance = wallet.balance.toFixed(2);
      amount = ride.couponDetails.totalDiscountedFare.toFixed(2);
    } else{
      wallet.balance = wallet.balance + ride.fare;
      wallet.balance = wallet.balance.toFixed(2);
      amount = ride.fare.toFixed(2);
    }

    const transaction = new transactionModel({
      userId: req.user._id,
      rideId: ride._id,
      amount: amount,
      transactionType: "credit",
      description: "Ride amount credited in user wallet",
    });

    await transaction.save();

    wallet.transactions.push(transaction._id);
    ride.paymentDetails.isUserReturnRideAmountPaid = 1;

    await ride.save();
    await wallet.save();

    res.status(200).json({
      statusCode: 200,
      message: "Amount credited successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports.AddInUserWallet = async (req, res, next) => {
  try {
    const { amount, transactionId } = req.body;

    if (!amount || !transactionId) {
      return res.status(400).json({
        statusCode: 400,
        message: "Enter valid information",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid amount",
      });
    }

    const wallet = await walletModel.findOne({ userId: req.user._id });

    if (!wallet) {
      return res.status(404).json({
        statusCode: 404,
        message: "User wallet not found",
      });
    }

    const balance = wallet.balance + amount;
    wallet.balance = balance.toFixed(2);

    const transaction = new transactionModel({
      userId: req.user._id,
      amount: amount.toFixed(2),
      transactionType: "credit",
      transactionId: transactionId,
      description: "Amount added in user wallet",
    });

    await transaction.save();

    wallet.transactions.push(transaction._id);
    await wallet.save();

    res.status(200).json({
      statusCode: 200,
      message: "Amount added successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports.getAllUserWalletTransactions = async (req, res, next) => {
  try {
    const { page = 1, perPage = 5 } = req.body;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(perPage, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(pageSize) ||
      pageNumber <= 0 ||
      pageSize <= 0
    ) {
      return res.status(400).json({
        statuscode: 400,
        message:
          "Invalid pagination parameters. 'page' and 'perPage' must be positive integers.",
      });
    }

    const wallet = await walletModel.findOne({ userId: req.user._id });

    if (!wallet) {
      return res.status(404).json({
        statusCode: 404,
        message: "User wallet not found",
      });
    }

    const transactions = await transactionModel
      .find({ _id: { $in: wallet.transactions } })
      .populate("rideId")
      .sort({ _id: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalTransactions = await transactionModel
      .find({ _id: { $in: wallet.transactions } })
      .countDocuments();

    const totalPages = Math.ceil(totalTransactions / pageSize);

    res.status(200).json({
      statusCode: 200,
      message: "User wallet transactions",
      data: {
        totalTransactions,
        totalPages,
        transactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

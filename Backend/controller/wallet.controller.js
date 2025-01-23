const walletModel = require("../model/wallet.model");
const transactionModel = require("../model/transaction.model");
const rideModel = require("../model/ride.model");
const captainModel = require("../model/captain.model");

module.exports.createCaptainWallet = async (req, res, next) => {
  try {
    const captain = await captainModel.findById(req.captain._id);

    if (captain.isDeleted == 1) {
      return res.status(400).json({
        statusCode: 400,
        message: "Captain is deleted",
      });
    }

    const walletDb = await walletModel.findOne({ captainId: req.captain._id });

    if (walletDb) {
      return res.status(400).json({
        statusCode: 400,
        message: "Captain wallet already exists",
      });
    }

    const wallet = new walletModel({
      captainId: req.captain._id,
    });

    await wallet.save();

    res.status(201).json({
      statusCode: 201,
      message: "Captain wallet created successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

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
      ride.paymentDetails.status !== 0
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
      ride.paymentDetails.paymentMethod !== "online" ||
      ride.paymentDetails.status !== 1
    ) {
      return res.status(400).json({
        statusCode: 400,
        message: "Ride payment method is not online or payment is not done",
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
      .sort({ date: -1 })
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

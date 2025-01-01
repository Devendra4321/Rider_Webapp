const userModel = require("../model/user.model");
const blackListTokenModel = require("../model/blackListingToken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const captainModel = require("../model/captain.model");
const adminModel = require("../model/admin.model");

module.exports.authUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const bToken = await blackListTokenModel.findOne({ token });

  if (bToken) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const bToken = await blackListTokenModel.findOne({ token });

  if (bToken) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);

    req.captain = captain;

    return next();
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
};

module.exports.authAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const bToken = await blackListTokenModel.findOne({ token });

  if (bToken) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminModel.findById(decoded._id);

    req.admin = admin;

    return next();
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
};

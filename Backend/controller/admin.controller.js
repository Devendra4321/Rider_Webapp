const adminModel = require("../model/admin.model");
const captainModel = require("../model/captain.model");
const userModel = require("../model/user.model");
const blackListTokenModel = require("../model/blackListingToken.model");
const rideModel = require("../model/ride.model");

module.exports.addAdmin = async (req, res, next) => {
  const authAdmin = req.admin;

  if (authAdmin.type == "admin" || authAdmin.type == "subadmin") {
    return res.status(403).json({
      statuscode: 403,
      message: "You are not authorized to perform this action",
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      statuscode: 400,
      message: "Please provide email and password",
    });
  }

  const adminExists = await adminModel.findOne({ email });

  if (adminExists) {
    return res.status(400).json({
      statuscode: 400,
      message: "Admin already exists",
    });
  }

  const hashPassword = await adminModel.hashPassword(password);

  const admin = await adminModel.create({
    email,
    password: hashPassword,
  });

  await admin.save();

  const token = admin.generateAuthToken();

  res.status(201).json({
    statuscode: 201,
    message: "Admin created successfully",
    token,
  });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ statuscode: 400, message: "Please provide email and password" });
  }

  const admin = await adminModel.findOne({ email });

  if (!admin) {
    return res.status(404).json({
      statuscode: 404,
      message: "Admin not found",
    });
  }

  if (admin.isDeleted == 1) {
    return res.status(404).json({
      statuscode: 404,
      message: "Admin is deleted",
    });
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      statuscode: 401,
      message: "Invalid credentials",
    });
  }

  const token = admin.generateAuthToken();

  res.status(200).json({
    statuscode: 200,
    message: "Admin logged in successfully",
    token,
  });
};

module.exports.getAllAdmins = async (req, res, next) => {
  const { page = 1, perPage = 5, isDeleted } = req.body;
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

  if (typeof isDeleted !== "boolean") {
    return res.status(400).json({
      statuscode: 400,
      message: "Invalid 'isDeleted' parameter. It must be a boolean value.",
    });
  }

  const admins = await adminModel
    .find({ isDeleted })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  const totalAdmins = await adminModel.countDocuments({ isDeleted });
  const totalPages = Math.ceil(totalAdmins / pageSize);

  res.status(200).json({
    statuscode: 200,
    message: "All admins fetched successfully",
    totalAdmins,
    totalPages,
    data: admins,
  });
};

module.exports.getAllUsers = async (req, res, next) => {
  const { page = 1, perPage = 5, isDeleted } = req.body;
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

  if (typeof isDeleted !== "boolean") {
    return res.status(400).json({
      statuscode: 400,
      message: "Invalid 'isDeleted' parameter. It must be a boolean value.",
    });
  }

  const users = await userModel
    .find({ isDeleted })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  const totalUsers = await userModel.countDocuments({ isDeleted });
  const totalPages = Math.ceil(totalUsers / pageSize);

  res.status(200).json({
    statuscode: 200,
    message: "All users fetched successfully",
    totalUsers,
    totalPages,
    data: users,
  });
};

module.exports.getAllRides = async (req, res, next) => {
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

  const rides = await rideModel
    .find({})
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .populate("user")
    .populate("captain")
    .sort({ _id: -1 });

  const totalRides = await rideModel.countDocuments({});
  const totalPages = Math.ceil(totalRides / pageSize);

  res.status(200).json({
    statuscode: 200,
    message: "All rides fetched successfully",
    totalRides,
    totalPages,
    data: rides,
  });
};

module.exports.getAllCaptains = async (req, res, next) => {
  const { page = 1, perPage = 5, isDeleted } = req.body;
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

  if (typeof isDeleted !== "boolean") {
    return res.status(400).json({
      statuscode: 400,
      message: "Invalid 'isDeleted' parameter. It must be a boolean value.",
    });
  }

  const captains = await captainModel
    .find({ isDeleted })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  const totalCaptains = await captainModel.countDocuments({ isDeleted });
  const totalPages = Math.ceil(totalCaptains / pageSize);

  res.status(200).json({
    statuscode: 200,
    message: "All captains fetched successfully",
    totalCaptains,
    totalPages,
    data: captains,
  });
};

module.exports.updateCaptainStatus = async (req, res, next) => {
  const status = req.body.status;
  const captainId = req.params.captainId;
  const admin = req.admin;

  if (admin.type == "admin") {
    return res.status(403).json({
      statuscode: 403,
      message: "You are not authorized to perform this action",
    });
  }
  if (admin.isDeleted == 1) {
    return res.status(404).json({
      statuscode: 404,
      message: "Admin is already deleted",
    });
  }

  const captain = await captainModel.findById(captainId);

  if (!captain) {
    return res.status(404).json({
      statuscode: 404,
      message: "Captain not found",
    });
  }

  captain.status = status;
  await captain.save();

  res.status(200).json({
    statuscode: 200,
    message: "Captain status updated successfully",
  });
};

module.exports.deleteAdmin = async (req, res, next) => {
  const admin = req.admin;
  const adminId = req.params.adminId;

  if (!adminId) {
    return res.status(400).json({
      statuscode: 400,
      message: "Please provide admin id",
    });
  }

  if (admin.type == "admin" || admin.type == "subadmin") {
    return res.status(403).json({
      statuscode: 403,
      message: "You are not authorized to perform this action",
    });
  }

  const deladmin = await adminModel.findById(adminId);
  if (!deladmin) {
    return res.status(404).json({
      statuscode: 404,
      message: "Admin not found",
    });
  }

  deladmin.isDeleted = true;
  await deladmin.save();

  res.status(200).json({
    statuscode: 200,
    message: "Admin deleted successfully",
  });
};

module.exports.deleteUser = async (req, res, next) => {
  const admin = req.admin;
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({
      statuscode: 400,
      message: "Please provide user id",
    });
  }

  if (admin.type == "admin") {
    return res.status(403).json({
      statuscode: 403,
      message: "You are not authorized to perform this action",
    });
  }

  const deluser = await userModel.findById(userId);
  if (!deluser) {
    return res.status(404).json({
      statuscode: 404,
      message: "User not found",
    });
  }

  deluser.isDeleted = true;
  await deluser.save();

  res.status(200).json({
    statuscode: 200,
    message: "User deleted successfully",
  });
};

module.exports.deleteCaptain = async (req, res, next) => {
  const admin = req.admin;
  const captainId = req.params.captainId;

  if (!captainId) {
    return res.status(400).json({
      statuscode: 400,
      message: "Please provide captain id",
    });
  }

  if (admin.type == "admin") {
    return res.status(403).json({
      statuscode: 403,
      message: "You are not authorized to perform this action",
    });
  }

  const delcaptain = await captainModel.findById(captainId);
  if (!delcaptain) {
    return res.status(404).json({
      statuscode: 404,
      message: "Captain not found",
    });
  }

  delcaptain.isDeleted = true;
  await delcaptain.save();

  res.status(200).json({
    statuscode: 200,
    message: "Captain deleted successfully",
  });
};

module.exports.searchInUser = async (req, res, next) => {
  const { fieldName, searchText } = req.body;

  if (!fieldName || !searchText) {
    return res.status(400).json({
      statuscode: 400,
      message: "Please provide both field name and search text",
    });
  }

  const users = await userModel.find({ [fieldName]: searchText });

  if (users.length == 0) {
    return res.status(404).json({
      statuscode: 404,
      message: "Users not found",
    });
  }

  res.status(200).json({
    statuscode: 200,
    data: users,
  });
};

module.exports.searchInCaptain = async (req, res, next) => {
  const { fieldName, searchText } = req.body;

  if (!fieldName || !searchText) {
    return res.status(400).json({
      statuscode: 400,
      message: "Please provide both field name and search text",
    });
  }

  const captains = await captainModel.find({ [fieldName]: searchText });

  if (captains.length == 0) {
    return res.status(404).json({
      statuscode: 404,
      message: "captains not found",
    });
  }

  res.status(200).json({
    statuscode: 200,
    data: captains,
  });
};

module.exports.searchInAdmin = async (req, res, next) => {
  const { fieldName, searchText } = req.body;

  if (!fieldName || !searchText) {
    return res.status(400).json({
      statuscode: 400,
      message: "Please provide both field name and search text",
    });
  }

  const admins = await adminModel.find({ [fieldName]: searchText });

  if (admins.length == 0) {
    return res.status(404).json({
      statuscode: 404,
      message: "admin not found",
    });
  }

  res.status(200).json({
    statuscode: 200,
    data: admins,
  });
};

module.exports.logoutAdmin = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(400).json({
      statusCode: 400,
      message: "Token is required",
    });
  }

  const token = authToken.split(" ")[1];
  const logToken = await new blackListTokenModel({ token });
  await logToken.save();

  res.status(200).json({
    statusCode: 200,
    message: "Logged out",
  });
};

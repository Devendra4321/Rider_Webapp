const router = require("express").Router();
const captainModel = require("../model/captain.model");
const blackListTokenModel = require("../model/blackListingToken.model");
const transporter = require("../mail.config");
const rideModel = require("../model/ride.model");
const walletModel = require("../model/wallet.model");
const reviewModel = require("../model/review.model");

module.exports.registerCaptain = async (req, res, next) => {
  const { fullname, email, password, vehicle } = req.body;

  const isCaptainExist = await captainModel.findOne({ email });

  if (isCaptainExist) {
    return res.status(400).json({
      statusCode: 400,
      message: "Captain already exist",
    });
  }

  const hashPassword = await captainModel.hashPassword(password);

  const captain = new captainModel({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password: hashPassword,
    vehicle: {
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    },
  });

  await captain.save();

  const wallet = new walletModel({
    captainId: captain._id,
  });

  await wallet.save();

  res.status(201).json({
    statusCode: 201,
    message: "Captain registered successfully",
  });
};

module.exports.loginCaptain = async (req, res, next) => {
  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(400).json({
      statusCode: 400,
      message: "Captain not found",
    });
  }

  if (captain.isDeleted === true) {
    return res.status(400).json({
      statusCode: 400,
      message: "Captain is deleted",
    });
  }

  const isPasswordMatch = await captain.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid password",
    });
  }

  const token = captain.generateAuthToken();

  res.status(200).json({
    statusCode: 200,
    message: "Captain logged in successfully",
    token,
    captain: captain,
  });
};

module.exports.sendOtp = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      statusCode: 400,
      message: "Email is required",
    });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);

  const captain = await captainModel.findOne({ email });

  if (!captain) {
    return res.status(404).json({
      statusCode: 404,
      message: "Captain not found",
    });
  }

  if (captain.isDeleted == true) {
    return res.status(404).json({
      statusCode: 404,
      message: "Captain is deleted",
    });
  }

  captain.otpData.otp = otp;
  captain.otpData.expiresAt = Date.now() + 5 * 60 * 1000;
  await captain.save();

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: "devendrabhole359@gmail.com",
      subject: "Rider app Captain OTP",
      html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #eee; border-radius: 8px;">
      <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;"> Rider App</span></h1>
      <p style="font-size: 16px; color: #555;">Hello ${
        captain.fullname.firstname
      },</p>
      <p style="font-size: 16px; color: #555;">
        We are excited to have you onboard. Your One-Time Password (OTP) to access your account is:
      </p>
      <div style="font-size: 28px; font-weight: bold; color: #4CAF50; text-align: center; padding: 15px; background: #e6f7ff; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">
        This OTP will expire in <span style="color: #4CAF50;">5 minutes</span>. Please use it to complete your authentication process.
      </p>
      <p style="font-size: 14px; color: #666; text-align: center;">
        If you have any questions, feel free to reach out to us at 
        <a href="mailto:support@riderapp.com" style="color: #007BFF;">support@riderapp.com</a>.
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

    res.status(200).send({
      statusCode: 200,
      message: "OTP sent successfully",
      otp: captain.otpData,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Error sending OTP",
    });
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).send({
      statusCode: 400,
      message: "Email and OTP are required",
    });

  const record = await captainModel.findOne({ email });

  if (!record)
    return res.status(404).send({
      statusCode: 404,
      message: "No OTP found for this email",
    });

  if (Date.now() > record.otpData.expiresAt)
    return res.status(400).send({
      statusCode: 400,
      message: "OTP has expired",
    });

  if (record.otpData.otp !== otp)
    return res.status(400).send({
      statusCode: 400,
      message: "Invalid OTP",
    });

  res.status(200).send({
    statusCode: 200,
    message: "OTP verified successfully",
  });
};

module.exports.emailVerificationLink = async (req, res, next) => {
  const captain = await captainModel.findOne({ _id: req.captain._id });

  if (captain.isDeleted === true) {
    return res.status(404).json({
      statusCode: 404,
      message: "Captain deleted",
    });
  }

  if (captain.isEmailVerified === true) {
    return res.status(404).json({
      statusCode: 404,
      message: "Email is already verified",
    });
  }

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${
    captain.emailVerificationToken
  }&userType=${encodeURIComponent("captain")}`;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: captain.email,
    subject: "Rider app Captain Email Verification",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #eee; border-radius: 8px;">
        <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;"> Rider App</span></h1>
        <p style="font-size: 16px; color: #555;">Hello ${
          captain.fullname.firstname
        },</p>
        <p style="font-size: 16px; color: #555;">
          We are excited to have you onboard. Please verify your email address by clicking the link below:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationLink}" style="font-size: 18px; font-weight: bold; color: #fff; background-color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        </div>
        <p style="font-size: 14px; color: #666; text-align: center;">
          If you have any questions, feel free to reach out to us at
          <a href="mailto:support@riderapp.com" style="color: #007BFF;">support@riderapp.com</a>.
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

  res.status(200).send({
    statusCode: 200,
    verificationLink: verificationLink,
    token: captain.emailVerificationToken,
    message: "Verification email sent successfully",
  });
};

module.exports.verifyEmail = async (req, res, next) => {
  const { token } = req.body;

  if (!token)
    return res.status(400).send({
      statusCode: 400,
      message: "Token is required",
    });

  const captain = await captainModel.findOne({ emailVerificationToken: token });

  if (!captain)
    return res.status(404).send({
      statusCode: 404,
      message: "Invalid token",
    });

  if (captain.isDeleted === true) {
    return res.status(404).json({
      statusCode: 404,
      message: "Captain deleted",
    });
  }

  if (captain.isEmailVerified === true) {
    return res.status(404).json({
      statusCode: 404,
      message: "Email is already verified",
    });
  }

  captain.isEmailVerified = true;
  await captain.save();

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: captain.email,
    subject: "Rider app Email Verified Successfully",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #eee; border-radius: 8px;">
        <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;"> Rider App</span></h1>
        <p style="font-size: 16px; color: #555;">Hello ${
          captain.fullname.firstname
        },</p>
        <p style="font-size: 16px; color: #555;">
          We are excited to inform you that your email address has been <span style="color: #4CAF50;">successfully verified</span>.
        </p>
        <p style="font-size: 14px; color: #666; text-align: center;">
          If you have any questions, feel free to reach out to us at
          <a href="mailto:support@riderapp.com" style="color: #007BFF;">support@riderapp.com</a>.
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

  res.status(200).send({
    statusCode: 200,
    message: "Email verified successfully",
  });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  const captain = req.captain;

  if (captain.isDeleted === true) {
    return res.status(400).json({
      statusCode: 400,
      message: "Captain is deleted",
    });
  }

  res.status(200).send({
    statusCode: 200,
    captain: captain,
  });
};

module.exports.forgotPassword = async (req, res, next) => {
  const { newPassword } = req.body;

  const captain = req.captain;

  if (captain.isDeleted === true) {
    return res.status(400).json({
      statusCode: 400,
      message: "Captain is deleted",
    });
  }

  const hashedPassword = await captainModel.hashPassword(newPassword);

  captain.password = hashedPassword;

  await captain.save();

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: captain.email,
    subject: "Rider app Forgot Passsword",
    html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
  <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;">Rider App</span></h1>
  <p style="font-size: 16px; color: #555;">Hello <strong>${
    captain.fullname.firstname
  }</strong>,</p>
  <p style="font-size: 16px; color: #555;">Your password has been successfully updated. If you did not make this change, please reset your password immediately or contact support.</p>
  <p style="font-size: 14px; color: #666;">If you need assistance, feel free to reach out to our support team.</p>
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

  res.status(200).send({
    statusCode: 200,
    message: "Password updated successfully",
  });
};

module.exports.logoutCaptain = async (req, res, next) => {
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

module.exports.uploadDocuments = async (req, res, next) => {
  if (req.file) {
    const captain = req.captain;

    captain.documents[req.body.documentName] = {
      url: req.file.path,
      fileName: req.body.documentName,
    };

    await captain.save();

    res.status(200).json({
      statusCode: 200,
      message: "Image uploaded successfully",
    });
  } else {
    res.status(400).json({
      statusCode: 400,
      message: "Failed to upload image",
    });
  }
};

module.exports.updateCaptainEarning = async (req, res, next) => {
  const captain = req.captain;

  const ride = await rideModel.find({ captain: captain.id });

  console.log(ride);

  await captainModel.findOneAndUpdate(
    {
      _id: captain.id,
    },
    {
      todaysEarn: captain.todaysEarn + ride.fare,
      totalEarning: captain.totalEarning + ride.fare,
    }
  );
  res.json({ ride });
};

module.exports.updateOnlineStatus = async (req, res, next) => {
  const { isOnline } = req.body;

  try {
    const captain = await captainModel.findById(req.captain.id);

    if (!captain) {
      return res.status(400).json({
        statusCode: 400,
        message: "Captain not found",
      });
    }

    captain.isOnline = isOnline;
    await captain.save();

    res.status(200).json({
      statusCode: 200,
      message: "Captain status updated",
      isOnline: captain.isOnline,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

module.exports.getCaptainAllRides = async (req, res, next) => {
  try {
    const captainId = req.captain._id;
    const { page = 1, perPage = 10 } = req.body;

    const rides = await rideModel
      .find({ captain: captainId })
      .sort({ _id: -1 })
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    const totalRides = await rideModel.countDocuments({ captain: captainId });

    res.status(200).json({
      statusCode: 200,
      totalPages: Math.ceil(totalRides / perPage),
      totalRides: totalRides,
      currentPage: page,
      rides,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Error fetching rides",
    });
  }
};

module.exports.getRatingAndReviewAverage = async (req, res, next) => {
  try {
    const avgRatings = await reviewModel.calculateAverageRatings(req.captain._id);

    if (!avgRatings) {
      return res.status(404).json({
        statusCode: 404,
        message: "No ratings found",
      });
    }
    
    res.json({ statusCode: 200, data: avgRatings });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};

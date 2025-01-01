const userModel = require("../model/user.model");
const blackListTokenModel = require("../model/blackListingToken.model");
const transporter = require("../mail.config");

module.exports.registerUser = async (req, res, next) => {
  const { fullname, email, password } = req.body;

  const isUserExist = await userModel.findOne({ email });

  if (isUserExist) {
    return res.status(400).json({
      statusCode: 400,
      message: "User already exist",
    });
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = new userModel({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();

  await user.save();

  res.status(201).json({
    statusCode: 201,
    message: "User registered successfully",
    token,
  });
};

module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      message: "User not found",
    });
  }

  if (user.isDeleted === true) {
    return res.status(404).json({
      statusCode: 404,
      message: "User deleted",
    });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid password",
    });
  }

  const token = user.generateAuthToken();

  res.status(200).json({
    statusCode: 200,
    message: "User logged in successfully",
    token,
    user: user,
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

  const otp = Math.floor(100000 + Math.random() * 900000);

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      message: "User not found",
    });
  }

  user.otpData.otp = otp;
  user.otpData.expiresAt = Date.now() + 5 * 60 * 1000;
  user.save();

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: "devendrabhole359@gmail.com",
      subject: "Raider app User OTP",
      html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #eee; border-radius: 8px;">
      <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;"> Raider App</span></h1>
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">
        We are excited to have you onboard. Your One-Time Password (OTP) to access your account is:
      </p>
      <div style="font-size: 28px; font-weight: bold; color: #4CAF50; text-align: center; padding: 15px; background: #e6f7ff; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">
        This OTP will expire in <span style="color: #4CAF50;">10 minutes</span>. Please use it to complete your authentication process.
      </p>
      <p style="font-size: 14px; color: #666; text-align: center;">
        If you have any questions, feel free to reach out to us at 
        <a href="mailto:support@raiderapp.com" style="color: #007BFF;">support@raiderapp.com</a>.
      </p>
      <footer style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Raider App. All rights reserved.</p>
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
      otp: user,
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

  const record = await userModel.findOne({ email });

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
  const { email } = req.body;

  if (!email)
    return res.status(400).send({
      statusCode: 400,
      message: "Email is required",
    });

  const user = await userModel.findOne({ email });

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${user.emailVerificationToken}`;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Raider app Email Verification",
    html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #eee; border-radius: 8px;">
      <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;"> Raider App</span></h1>
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">
        We are excited to have you onboard. Please verify your email address by clicking the link below:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationLink}" style="font-size: 18px; font-weight: bold; color: #fff; background-color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">
        If you have any questions, feel free to reach out to us at 
        <a href="mailto:support@raiderapp.com" style="color: #007BFF;">support@raiderapp.com</a>.
      </p>
      <footer style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Raider App. All rights reserved.</p>
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
    token: user.emailVerificationToken,
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

  const user = await userModel.findOne({ emailVerificationToken: token });

  if (!user)
    return res.status(404).send({
      statusCode: 404,
      message: "Invalid token",
    });

  user.isEmailVerified = true;
  user.save();

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: user.email,
    subject: "Raider app Email Verified Successfully",
    html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #eee; border-radius: 8px;">
      <h1 style="text-align: center; color: #333;">Welcome to <span style="color: #4CAF50;"> Raider App</span></h1>
      <p style="font-size: 16px; color: #555;">Hello ${
        user.fullname.firstname
      },</p>
      <p style="font-size: 16px; color: #555;">
        We are excited to inform you that your email address has been <span style="color: #4CAF50;">successfully verified</span>.
      </p>
      <p style="font-size: 14px; color: #666; text-align: center;">
        If you have any questions, feel free to reach out to us at 
        <a href="mailto:support@raiderapp.com" style="color: #007BFF;">support@raiderapp.com</a>.
      </p>
      <footer style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Raider App. All rights reserved.</p>
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

module.exports.getUserProfile = async (req, res, next) => {
  const user = req.user;

  if (user.isDeleted === true) {
    return res.status(404).json({
      statusCode: 404,
      message: "User deleted",
    });
  }

  res.status(200).send({
    statusCode: 200,
    user,
  });
};

module.exports.forgotPassword = async (req, res, next) => {
  const { newPassword } = req.body;

  const user = req.user;

  if (user.isDeleted === true) {
    return res.status(404).json({
      statusCode: 404,
      message: "User deleted",
    });
  }

  const hashedPassword = await userModel.hashPassword(newPassword);

  user.password = hashedPassword;

  user.save();

  res.status(200).send({
    statusCode: 200,
    message: "Password updated successfully",
  });
};

module.exports.logoutUser = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(400).json({
      statusCode: 400,
      message: "Token is required",
    });
  }

  const token = authToken.split(" ")[1];
  const logToken = await new blackListTokenModel({ token });
  logToken.save();

  res.status(200).json({
    statusCode: 200,
    message: "Logged out",
  });
};

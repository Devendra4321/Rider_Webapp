const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "riderwebapp999@gmail.com",
    pass: "nndpbtomxhhavpdx",
  },
  tls: { rejectUnauthorized: true },
});

module.exports = transporter;

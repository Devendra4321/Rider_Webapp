const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "devendrabhole3369@gmail.com",
    pass: "wicharmjnaewbyvl",
  },
  tls: { rejectUnauthorized: true },
});

module.exports = transporter;

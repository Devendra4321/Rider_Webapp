const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const adminRoutes = require("./routes/admin.routes");
const mapRoutes = require("./routes/map.routes");
const rideRoutes = require("./routes/ride.routes");
const walletRoutes = require("./routes/wallet.routes");
const couponRoutes = require("./routes/coupon.routes");
const authRoutes = require("./routes/auth.routes");

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/admin", adminRoutes);
app.use("/map", mapRoutes);
app.use("/ride", rideRoutes);
app.use("/wallet", walletRoutes);
app.use("/coupon", couponRoutes);
app.use('/auth', authRoutes);

module.exports = app;

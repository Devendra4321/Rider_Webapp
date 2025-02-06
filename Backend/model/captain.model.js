const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Firstname must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Lastname must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
  todaysEarn: {
    type: Number,
    default: 0,
  },
  totalEarning: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3], // 0: pending, 1: inprogress, 2: approved, 3: reject
    default: 0,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, "Color must be at least 3 characters long"],
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, "Plate must be at least 3 characters long"],
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"],
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["car", "motorcycle", "auto", "taxi"],
    },
  },
  location: {
    ltd: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  otpData: {
    otp: {
      type: Number,
    },
    expiresAt: { type: String },
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    default: () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let token = "";
      for (let i = 0; i <= 12; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return token;
    },
  },
  documents: {
    drivinglicense: {
      url: {
        type: String,
      },
      fileName: {
        type: String,
      },
    },
    rc: {
      url: {
        type: String,
      },
      fileName: {
        type: String,
      },
    },
    aadharfront: {
      url: {
        type: String,
      },
      fileName: {
        type: String,
      },
    },
    aadharback: {
      url: {
        type: String,
      },
      fileName: {
        type: String,
      },
    },
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createOn: {
    type: String,
    default: new Date().toLocaleString(),
  },
});

captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const captainModel = mongoose.model("captain", captainSchema);

module.exports = captainModel;

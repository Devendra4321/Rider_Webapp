const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["percentage", "amount"],
        default: "amount"
    },
    expirationDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        required: true
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
});

module.exports = mongoose.model("Coupon", couponSchema);

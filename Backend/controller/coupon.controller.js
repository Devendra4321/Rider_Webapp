const adminModel = require("../model/admin.model");
const couponModel = require("../model/coupon.model");

//admin 
module.exports.addCoupon = async (req, res, next) => {
    try {
        const { code, discount, type, expirationDate, usageLimit } = req.body;

        const admin = await adminModel.findById(req.admin._id);

        if (admin.type == "admin") {
            return res.status(403).json({ statusCode: 403, message: "You are not authorized to add coupon" });
        }

        const existingCoupon = await couponModel.findOne({ code });

        if (existingCoupon) {
            return res.status(400).json({ statusCode: 400, message: "Coupon already exists" });
        }

        const coupon = new couponModel({ code, discount, type, expirationDate, usageLimit });
        await coupon.save();

        res.status(201).json({ statusCode: 201, message: "Coupon created successfully", coupon });
    } catch (error) {
        res.status(500).json({ statusCode: 500, error: error.message });
    }
};

module.exports.applyCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;

        const coupon = await couponModel.findOne({ code });

        if (!coupon) {
            return res.status(404).json({ statusCode: 404, message: "Invalid coupon code" });
        }

        if (!coupon.isActive || coupon.expirationDate < new Date()) {
            return res.status(400).json({ statusCode: 400, message: "Coupon expired or inactive" });
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ statusCode: 400, message: "Coupon usage limit exceeded" });
        }

        res.status(200).json({ statusCode: 200, message: "Coupon applied", discount: coupon.discount, type: coupon.type });
    } catch (error) {
        res.status(500).json({ statusCode: 500, error: error.message });
    }
};

module.exports.useCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;
        const userId = req.user._id;

        if (!code) {
            return res.status(400).json({
                statusCode: 400, message: "Coupon code is required"
            });
        }

        const coupon = await couponModel.findOne({ code });

        if (!coupon || !coupon.isActive || coupon.expirationDate < new Date()) {
            return res.status(400).json({ statusCode: 400, message: "Invalid or expired coupon" });
        }
        if (coupon.usedBy.includes(userId)) {
            return res.status(400).json({ statusCode: 400, message: "You have already used this coupon" });
        }
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ statusCode: 400, message: "Coupon usage limit reached" });
        }

        coupon.usedBy.push(userId);
        coupon.usedCount += 1;

        if (coupon.usedCount >= coupon.usageLimit) {
            coupon.isActive = false;
        }

        await coupon.save();

        res.status(200).json({ statusCode: 200, message: "Coupon successfully used", discount: coupon.discount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.getActiveCoupons = async (req, res, next) => {
    try {
        const coupons = await couponModel.find().sort({ _id: -1 });

        if (coupons.length == 0) {
            return res.status(404).json({ statusCode: 404, message: "No coupons found" });
        }

        const activeCoupons = coupons.filter((coupon) => {
            return coupon.isActive && coupon.expirationDate > new Date();
        });

        res.status(200).json({
            statusCode: 200, coupons: activeCoupons
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, error: error.message });
    }
};

//admin
module.exports.updateCoupon = async (req, res, next) => {
    try {
        const { code, discount, type, expirationDate, usageLimit, isActive } = req.body;

        const admin = await adminModel.findById(req.admin._id);

        if (admin.type == "admin") {
            return res.status(403).json({ statusCode: 403, message: "You are not authorized to add coupon" });
        }

        const updatedCoupon = await couponModel.findByIdAndUpdate(req.params.id, { code, discount, type, expirationDate, usageLimit, isActive }, { new: true });

        if (!updatedCoupon) {
            return res.status(404).json({ statusCode: 404, message: "Coupon not found" });
        }

        res.status(200).json({ statusCode: 200, message: "Coupon updated successfully", coupon: updatedCoupon });
    }
    catch (error) {
        res.status(500).json({ statusCode: 500, error: error.message });
    }
};

//admin
module.exports.getAllCoupons = async (req, res, next) => {
    try {
        const { page, perPage } = req.body;

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

        const coupons = await couponModel
            .find()
            .sort({ _id: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        if (coupons.length == 0) {
            return res.status(404).json({ statusCode: 404, message: "No coupons found" });
        }

        const totalCoupons = await couponModel.countDocuments();
        const totalPages = Math.ceil(totalCoupons / pageSize);

        res.status(200).json({ statusCode: 200, totalPages, totalCoupons, coupons });
    }
    catch (error) {
        res.status(500).json({ statusCode: 500, error: error.message });
    }
};

//admin
module.exports.getCouponById = async (req, res, next) => {
    try {
        const coupon = await couponModel.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({ statusCode: 404, message: "Coupon not found" });
        }

        res.status(200).json({ statusCode: 200, coupon });
    }
    catch (error) {
        res.status(500).json({ statusCode: 500, error: error.message });
    }
};
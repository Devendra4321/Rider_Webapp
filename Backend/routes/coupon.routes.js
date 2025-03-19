const router = require("express").Router();
const couponController = require("../controller/coupon.controller");
const authMiddleware = require("../middlewarers/auth.middelware");

//admin
router.post(
    "/addCoupon",
    authMiddleware.authAdmin,
    couponController.addCoupon
);

router.post(
    "/applyCoupon",
    authMiddleware.authUser,
    couponController.applyCoupon
);

router.post(
    "/useCoupon",
    authMiddleware.authUser,
    couponController.useCoupon
);

router.get(
    "/getActiveCoupons",
    authMiddleware.authUser,
    couponController.getActiveCoupons
);

//admin
router.put(
    "/updateCoupon/:id",
    authMiddleware.authAdmin,
    couponController.updateCoupon
);

//admin
router.post(
    "/getAllCoupons",
    authMiddleware.authAdmin,
    couponController.getAllCoupons
);

module.exports = router;
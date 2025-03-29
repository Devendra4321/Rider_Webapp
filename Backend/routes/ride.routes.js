const router = require("express").Router();
const rideController = require("../controller/ride.controller");
const authMiddelware = require("../middlewarers/auth.middelware");

router.post("/create", authMiddelware.authUser, rideController.createRide);

router.post("/confirm", authMiddelware.authCaptain, rideController.confirm);

router.post("/startRide", authMiddelware.authCaptain, rideController.startRide);

router.post("/endRide", authMiddelware.authCaptain, rideController.endRide);

router.post(
  "/cancelUserRide",
  authMiddelware.authUser,
  rideController.cancelUserRide
);

router.post("/upadatePaymentStatus", rideController.upadatePaymentStatus);

router.post(
  "/paymentInit",
  authMiddelware.authUser,
  rideController.paymentInit
);

router.post(
  "/paymentVerify",
  authMiddelware.authUser,
  rideController.paymentVerify
);

router.post("/sendNotification", rideController.sendNotification);

router.get("/getRideById/:id", rideController.getRideById);

router.post(
  "/getVehiclePrices",
  rideController.getVehiclePrices
);

router.get(
  "/getAllVehicleNames",
  rideController.getAllVehicleNames
);

module.exports = router;

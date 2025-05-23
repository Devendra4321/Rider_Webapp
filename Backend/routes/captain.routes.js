const router = require("express").Router();
const captainController = require("../controller/captain.controller");
const authMiddleware = require("../middlewarers/auth.middelware");
const upload = require("../cloudinary.config");

router.post("/register", captainController.registerCaptain);

router.post("/login", captainController.loginCaptain);

router.post("/sendOtp", captainController.sendOtp);

router.post("/verifyOtp", captainController.verifyOtp);

router.get(
  "/emailVerificationLink",
  authMiddleware.authCaptain,
  captainController.emailVerificationLink
);

router.post("/verifyEmail", captainController.verifyEmail);

router.get(
  "/getCaptainProfile",
  authMiddleware.authCaptain,
  captainController.getCaptainProfile
);

router.patch(
  "/forgotPassword",
  authMiddleware.authCaptain,
  captainController.forgotPassword
);

router.get("/logoutCaptain", captainController.logoutCaptain);

router.post(
  "/uploadDocuments",
  authMiddleware.authCaptain,
  upload.single("document"),
  captainController.uploadDocuments
);

router.get(
  "/updateCaptainEarning",
  authMiddleware.authCaptain,
  captainController.updateCaptainEarning
);

router.post(
  "/updateOnlineStatus",
  authMiddleware.authCaptain,
  captainController.updateOnlineStatus
);

router.post(
  "/getCaptainAllRides",
  authMiddleware.authCaptain,
  captainController.getCaptainAllRides
);

router.get(
  "/getRatingAndReviewAverage",
  authMiddleware.authCaptain,
  captainController.getRatingAndReviewAverage
);

module.exports = router;

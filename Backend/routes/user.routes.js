const router = require("express").Router();
const userController = require("../controller/user.controller");
const authMiddleware = require("../middlewarers/auth.middelware");

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/sendOtp", userController.sendOtp);

router.post("/verifyOtp", userController.verifyOtp);

router.get(
  "/emailVerificationLink",
  authMiddleware.authUser,
  userController.emailVerificationLink
);

router.post("/verifyEmail", userController.verifyEmail);

router.get(
  "/getUserProfile",
  authMiddleware.authUser,
  userController.getUserProfile
);

router.patch(
  "/forgotPassword",
  authMiddleware.authUser,
  userController.forgotPassword
);

router.get("/logout", authMiddleware.authUser, userController.logoutUser);

router.post(
  "/getUserAllRides",
  authMiddleware.authUser,
  userController.getUserAllRides
);

module.exports = router;

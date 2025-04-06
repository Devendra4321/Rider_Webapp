const router = require("express").Router();
const authController = require("../controller/auth.controller");

router.post(
  "/googleSignUp",
  authController.googleSignUp
);

router.post(
  "/userGoogleLogin",
  authController.userGoogleLogin
);

router.post(
  "/captainGoogleLogin",
  authController.captainGoogleLogin
);

router.post(
  "/facebookSignUp",
  authController.facebookSignUp
);

router.post(
  "/userFacebookLogin",
  authController.userFacebookLogin
);

router.post(
  "/captainFacebookLogin",
  authController.captainFacebookLogin
);

module.exports = router;
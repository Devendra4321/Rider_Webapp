const router = require("express").Router();
const adminController = require("../controller/admin.controller");
const authMiddelware = require("../middlewarers/auth.middelware");

router.post("/addAdmin", authMiddelware.authAdmin, adminController.addAdmin);

router.post("/login", adminController.login);

router.get("/logout", adminController.logoutAdmin);

router.post("/getAllAdmin", adminController.getAllAdmins);

router.post("/getAllUsers", adminController.getAllUsers);

router.post("/getAllCaptains", adminController.getAllCaptains);

router.post("/getAllCaptainsRequest", adminController.getAllCaptainsRequest);

router.post("/getAllRides", adminController.getAllRides);

router.post(
  "/updateCaptainStatus/:captainId",
  authMiddelware.authAdmin,
  adminController.updateCaptainStatus
);

router.get(
  "/deleteAdmin/:adminId",
  authMiddelware.authAdmin,
  adminController.deleteAdmin
);

router.get(
  "/deleteUser/:userId",
  authMiddelware.authAdmin,
  adminController.deleteUser
);

router.get(
  "/deleteCaptain/:captainId",
  authMiddelware.authAdmin,
  adminController.deleteCaptain
);

router.post("/searchInUser", adminController.searchInUser);

router.post("/searchInCaptain", adminController.searchInCaptain);

router.post("/searchInAdmin", adminController.searchInAdmin);

module.exports = router;

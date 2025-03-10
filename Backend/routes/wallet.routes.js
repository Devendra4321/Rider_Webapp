const router = require("express").Router();
const walletController = require("../controller/wallet.controller");
const authMiddleware = require("../middlewarers/auth.middelware");

router.get(
  "/getCaptainWallet",
  authMiddleware.authCaptain,
  walletController.getCaptainWallet
);

router.post(
  "/debitInCaptainWallet",
  authMiddleware.authCaptain,
  walletController.debitInCaptainWallet
);

router.post(
  "/creditInCaptainWallet",
  authMiddleware.authCaptain,
  walletController.creditInCaptainWallet
);

router.post(
  "/withdrawInCaptainWallet",
  authMiddleware.authCaptain,
  walletController.withdrawInCaptainWallet
);

router.post(
  "/AddInCaptainWallet",
  authMiddleware.authCaptain,
  walletController.AddInCaptainWallet
);

router.post(
  "/getAllCaptainWalletTransactions",
  authMiddleware.authCaptain,
  walletController.getAllCaptainWalletTransactions
);

router.post(
  "/paymentInit",
  authMiddleware.authCaptain,
  walletController.paymentInit
);

router.post(
  "/paymentVerify",
  authMiddleware.authCaptain,
  walletController.paymentVerify
);

router.get(
  "/getUserWallet",
  authMiddleware.authUser,
  walletController.getUserWallet
);

router.post(
  "/debitInUserWallet",
  authMiddleware.authUser,
  walletController.debitInUserWallet
);

router.post(
  "/creditInUserWallet",
  authMiddleware.authUser,
  walletController.creditInUserWallet
);

router.post(
  "/AddInUserWallet",
  authMiddleware.authUser,
  walletController.AddInUserWallet
);

router.post(
  "/getAllUserWalletTransactions",
  authMiddleware.authUser,
  walletController.getAllUserWalletTransactions
);

module.exports = router;

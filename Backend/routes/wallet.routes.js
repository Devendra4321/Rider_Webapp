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

module.exports = router;

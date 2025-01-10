const express = require("express");
const router = express.Router();
const {
  generateQRCode,
  getVouchers,
} = require("../controllers/dashboardController");

router.get("/", getVouchers);
router.post("/generate", generateQRCode);

module.exports = router;

const express = require("express");
const router = express.Router();
const { sql } = require("../config/db");
const QRCode = require("qrcode");
const { generateVoucherPDF } = require("../utils/helper");
const dayjs = require("dayjs");
const { getSettings } = require("../utils/helper");

router.get("/", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM vouchers`;

    if (result && result.recordset.length > 0) {
      const formattedVouchers = result.recordset.map((voucher) => ({
        ...voucher,
        generated_date: dayjs(voucher.generated_date).format(
          "DD-MMM-YYYY hh:mm A"
        ),
        expiry_date: dayjs(voucher.expiry_date).format("DD-MMM-YYYY hh:mm A"),
      }));

      formattedVouchers.reverse();
      return res.render("dashboard", { vouchers: formattedVouchers });
    } else {
      return res.render("dashboard", {
        vouchers: [],
        message: "No vouchers found.",
      });
    }
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return res.status(500).render("error", {
      message: "An error occurred while fetching vouchers.",
      error,
    });
  }
});

router.post("/generate", async (req, res) => {
  const randomCode = Math.floor(
    1000000000 + Math.random() * 9000000000
  ).toString();
  const generatedDate = new Date();
  const settings = await getSettings();
  const expiryDate = new Date(generatedDate);
  expiryDate.setDate(expiryDate.getDate() + settings.maxExpiryDays); // Use maxExpiryDays from settings

  const formattedGeneratedDate = dayjs(generatedDate).format(
    "DD-MMM-YYYY hh:mm A"
  );
  const formattedExpiryDate = dayjs(expiryDate).format("DD-MMM-YYYY hh:mm A");

  await sql.query`INSERT INTO vouchers (code, generated_date, expiry_date) VALUES (${randomCode}, ${generatedDate}, ${expiryDate})`;

  QRCode.toDataURL(randomCode, (err, url) => {
    if (err) return res.send("Error generating QR Code");
    res.render("voucher", {
      qrCode: url,
      code: randomCode,
      generatedDate: formattedGeneratedDate,
      expiryDate: formattedExpiryDate,
    });
  });
});

// Your print voucher route
router.get("/print-voucher/:code", async (req, res) => {
  const { code } = req.params;
  if (!code) {
    return res.status(400).send("Voucher code is required.");
  }

  try {
    const result = await sql.query`SELECT * FROM vouchers WHERE code = ${code}`;
    if (!result || result.recordset.length === 0) {
      return res.status(404).send("Voucher not found.");
    }

    const settings = await getSettings();
    if (!settings) {
      return res.status(500).send("Failed to retrieve settings.");
    }

    const voucher = result.recordset[0];
    try {
      const printResult = await generateVoucherPDF(
        voucher,
        settings,
        res,
        true
      );
      if (!printResult) {
        return res.status(500).send("Error generating PDF.");
      }

      res.json(printResult);
    } catch (pdfError) {
      console.error("Error generating voucher PDF:", pdfError);
      res.status(500).send("Error generating voucher PDF.");
    }
  } catch (dbError) {
    console.error("Error fetching voucher for printing:", dbError);
    res.status(500).send("Error fetching voucher for printing.");
  }
});

router.get("/export-pdf/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const result = await sql.query`SELECT * FROM vouchers WHERE code = ${code}`;
    const settings = await getSettings(); // Fetch settings

    if (result && result.recordset.length > 0) {
      const voucher = result.recordset[0];

      await generateVoucherPDF(voucher, settings, res);
    } else {
      res.status(404).send("Voucher not found.");
    }
  } catch (error) {
    console.error("Error exporting voucher as PDF:", error);
    res.status(500).send("Error exporting voucher.");
  }
});

module.exports = router;

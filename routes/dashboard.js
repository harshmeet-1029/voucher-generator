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

      return res.render("dashboard", {
        vouchers: formattedVouchers,
        message: req.query.error || null, // Show error message if exists
        error: req.query.error ? true : false,
      });
    } else {
      return res.render("dashboard", {
        vouchers: [],
        message: "No vouchers found.",
        error: true,
      });
    }
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return res.render("dashboard", {
      vouchers: [],
      message: "An error occurred while fetching vouchers.",
      error: true,
    });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const randomCode = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
    const generatedDate = new Date();
    const settings = await getSettings();

    if (!settings || !settings.maxExpiryDays) {
      throw new Error("Settings not found or invalid expiry days.");
    }

    const expiryDate = new Date(generatedDate);
    expiryDate.setDate(expiryDate.getDate() + settings.maxExpiryDays); // Use maxExpiryDays from settings

    const formattedGeneratedDate = dayjs(generatedDate).format(
      "DD-MMM-YYYY hh:mm A"
    );
    const formattedExpiryDate = dayjs(expiryDate).format("DD-MMM-YYYY hh:mm A");

    await sql.query`INSERT INTO vouchers (code, generated_date, expiry_date) VALUES (${randomCode}, ${generatedDate}, ${expiryDate})`;

    QRCode.toDataURL(randomCode, (err, url) => {
      try {
        if (err) {
          throw new Error("Error generating QR code");
        }
        res.render("voucher", {
          qrCode: url,
          code: randomCode,
          generatedDate: formattedGeneratedDate,
          expiryDate: formattedExpiryDate,
        });
      } catch (error) {
        // If any error occurs, render the dashboard with error message and without inserting voucher data
        return res.redirect(
          `/dashboard?error=${encodeURIComponent(
            error.message || "An error occurred while generating voucher."
          )}`
        );
      }
    });
  } catch (error) {
    // If any error occurs, render the dashboard with error message and without inserting voucher data
    return res.redirect(
      `/dashboard?error=${encodeURIComponent(
        error.message || "An error occurred while generating voucher."
      )}`
    );
  }
});

// Your print voucher route
router.get("/print-voucher/:code", async (req, res) => {
  const { code } = req.params;
  if (!code) {
    return res.redirect(
      `/dashboard?error=${encodeURIComponent(
        "An error occurred while printing vouchers."
      )}`
    );
  }

  try {
    const result = await sql.query`SELECT * FROM vouchers WHERE code = ${code}`;
    if (!result || result.recordset.length === 0) {
      return res.redirect(
        `/dashboard?error=${encodeURIComponent(
          "An error occurred while printing vouchers."
        )}`
      );
    }

    const settings = await getSettings();
    if (!settings) {
      return res.redirect(
        `/dashboard?error=${encodeURIComponent(
          "An error occurred while printing vouchers."
        )}`
      );
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
        return res.redirect(
          `/dashboard?error=${encodeURIComponent(
            "An error occurred while printing vouchers."
          )}`
        );
      }

      res.json(printResult);
    } catch (pdfError) {
      console.error("Error generating voucher PDF:", pdfError);
      return res.redirect(
        `/dashboard?error=${encodeURIComponent(
          "An error occurred while printing vouchers."
        )}`
      );
    }
  } catch (dbError) {
    console.error("Error fetching voucher for printing:", dbError);
    return res.redirect(
      `/dashboard?error=${encodeURIComponent(
        "An error occurred while printing vouchers."
      )}`
    );
  }
});

router.get("/export-pdf/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const result = await sql.query`SELECT * FROM vouchers WHERE code = ${code}`;
    const settings = await getSettings(); // Fetch settings

    if (!settings) {
      return res.redirect(
        `/dashboard?error=${encodeURIComponent(
          "An error occurred while exporting vouchers."
        )}`
      );
    }

    if (result && result.recordset.length > 0) {
      const voucher = result.recordset[0];
      await generateVoucherPDF(voucher, settings, res);
    } else {
      // Voucher not found
      return res.redirect(
        `/dashboard?error=${encodeURIComponent("Voucher not found.")}`
      );
    }
  } catch (error) {
    console.error("Error exporting voucher as PDF:", error);

    // Handle error and redirect to dashboard with error message
    return res.redirect(
      `/dashboard?error=${encodeURIComponent(
        "An error occurred while exporting vouchers."
      )}`
    );
  }
});

module.exports = router;

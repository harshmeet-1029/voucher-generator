const express = require("express");
const router = express.Router();
const { sql } = require("../config/db");

router.get("/", async (req, res) => {
  try {
    // Initialize settings as an empty object
    let settings = {};

    // Fetch settings from the database
    const result = await sql.query`SELECT * FROM settings`;

    if (result.recordset.length > 0) {
      settings = result.recordset[0];
    }

    // Render the settings page with the fetched settings
    res.render("settings", { settings, message: null, error: null });
  } catch (error) {
    console.error("Error fetching settings:", error);

    // Render the settings page with an error message
    res.render("settings", {
      settings: {},
      message: "An error occurred while fetching settings.",
      error: true,
    });
  }
});

// Route to get settings
router.post("/update", async (req, res) => {
  const {
    maxExpiryDays,
    voucherWidth,
    voucherHeight,
    titleFontSize,
    normalFontSize,
  } = req.body;

  let errorMessage = "";

  // Validate the inputs and build an error message if needed
  if (maxExpiryDays < 1) {
    errorMessage += "Max Expiry Days must be at least 1. ";
  }
  if (maxExpiryDays >= 100) {
    errorMessage += "Max Expiry Days must not be greater than 100. ";
  }
  if (voucherWidth < 10) {
    errorMessage += "Voucher Width must be at least 10mm. ";
  }
  if (voucherHeight < 10) {
    errorMessage += "Voucher Height must be at least 10mm. ";
  }
  if (titleFontSize < 5) {
    errorMessage += "Title Font Size must be at least 5. ";
  }
  if (normalFontSize < 5) {
    errorMessage += "Normal Font Size must be at least 5. ";
  }

  if (errorMessage) {
    return res.render("settings", {
      settings: req.body,
      message: errorMessage.trim(),
      error: true,
    });
  }

  try {
    // Save the settings to the database
    await sql.query`UPDATE settings SET maxExpiryDays = ${maxExpiryDays}, voucherWidth = ${voucherWidth}, voucherHeight = ${voucherHeight}, titleFontSize = ${titleFontSize}, normalFontSize = ${normalFontSize}`;

    // Send confirmation message along with updated data
    res.render("settings", {
      settings: {
        maxExpiryDays,
        voucherWidth,
        voucherHeight,
        titleFontSize,
        normalFontSize,
      },
      message: "Settings updated successfully!",
      error: false,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.render("settings", {
      settings: req.body,
      message: "An error occurred while updating settings.",
      error: true,
    });
  }
}); // Route to update settings

module.exports = router;

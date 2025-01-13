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
  const maxDaysIn100Years = 100 * 365.25; // 100 years in days

  if (maxExpiryDays > maxDaysIn100Years) {
    errorMessage += "Max Expiry Days must not be greater than 100 years. ";
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
    // Check if the settings table has any row
    const existingSettings =
      await sql.query`SELECT COUNT(*) AS count FROM settings`;
    const settingsCount = existingSettings.recordset[0].count;

    if (settingsCount === 0) {
      // Insert new settings if the table is empty
      const insertResult = await sql.query`
         INSERT INTO settings (maxExpiryDays, voucherWidth, voucherHeight, titleFontSize, normalFontSize)
         VALUES (${maxExpiryDays}, ${voucherWidth}, ${voucherHeight}, ${titleFontSize}, ${normalFontSize})`;

      res.render("settings", {
        settings: {
          maxExpiryDays,
          voucherWidth,
          voucherHeight,
          titleFontSize,
          normalFontSize,
        },
        message: "Settings saved successfully!",
        error: false,
      });
    } else {
      // Update existing settings if a row already exists
      const updateResult = await sql.query`
         UPDATE settings 
         SET 
           maxExpiryDays = ${maxExpiryDays}, 
           voucherWidth = ${voucherWidth}, 
           voucherHeight = ${voucherHeight}, 
           titleFontSize = ${titleFontSize}, 
           normalFontSize = ${normalFontSize}`;

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
    }
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

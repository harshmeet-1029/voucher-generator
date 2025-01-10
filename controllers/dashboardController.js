const { sql } = require("../config/db");
const dayjs = require("dayjs");
const QRCode = require("qrcode");

exports.getVouchers = async (req, res) => {
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

      return res.render("dashboard", { vouchers: formattedVouchers });
    } else {
      // If no vouchers found
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
};
exports.generateQRCode = async (req, res) => {
  const randomCode = Math.floor(
    1000000000 + Math.random() * 9000000000
  ).toString();
  const generatedDate = new Date();
  const expiryDate = new Date(generatedDate);
  expiryDate.setDate(expiryDate.getDate() + 30); // 30 days expiry

  // Format the dates
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
};

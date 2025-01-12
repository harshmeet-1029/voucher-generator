const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const dayjs = require("dayjs");
const { sql } = require("../config/db");

module.exports.generateVoucherPDF = (voucher, settings, res, print = false) => {
  const formattedGeneratedDate = dayjs(voucher.generated_date).format(
    "DD-MMM-YYYY hh:mm A"
  );
  const formattedExpiryDate = dayjs(voucher.expiry_date).format(
    "DD-MMM-YYYY hh:mm A"
  );

  // Generate QR Code
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(voucher.code, async (err, qrCodeUrl) => {
      if (err) return reject("Error generating QR Code");

      const doc = new PDFDocument({
        size: [settings.voucherWidth, settings.voucherHeight], // Set dimensions
        margin: 20, // Add margin to make content look better
      });

      // Prepare the file name
      const fileName = `Voucher_${voucher.code}.pdf`;

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        const base64PDF = pdfBuffer.toString("base64");

        if (print) {
          // Return the base64 PDF and file name
          resolve({
            base64PDF,
            fileName: `Voucher_${voucher.code}.pdf`,
          });
        } else {
          // Handle download
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="Voucher_${voucher.code}.pdf"`
          );
          res.setHeader("Content-Type", "application/pdf");
          res.end(pdfBuffer); // Send the PDF buffer as response
          resolve();
        }
      });

      // Add border to make it look like a voucher
      doc.rect(0, 0, settings.voucherWidth, settings.voucherHeight).stroke();

      // Header
      doc.fontSize(settings.titleFontSize).text("Voucher Details", {
        align: "center",
        underline: true, // Add underline to the header
      });
      doc.moveDown(1); // Add some space after the header

      // Voucher Details Section
      doc
        .fontSize(settings.normalFontSize)
        .text(`Code: ${voucher.code}`, { align: "left" });
      doc.text(`Generated Date: ${formattedGeneratedDate}`, {
        align: "left",
      });
      doc.text(`Expiry Date: ${formattedExpiryDate}`, { align: "left" });
      doc.moveDown(2); // Add space between details and QR code

      // Divider line
      doc
        .moveTo(20, doc.y)
        .lineTo(settings.voucherWidth - 20, doc.y)
        .stroke();

      // QR Code Section
      doc.moveDown(1); // Add space before QR code

      // Define the size of the QR code
      const qrCodeSize = 150; // Size of the QR code (150x150 pixels)

      // Calculate the x position to center the QR code
      const xPosition = (settings.voucherWidth - qrCodeSize) / 2;

      // Create the QR code buffer
      const qrCodeBuffer = Buffer.from(qrCodeUrl.split(",")[1], "base64");

      // Add the QR code image to the document, centered
      doc.image(qrCodeBuffer, xPosition, doc.y, {
        width: qrCodeSize,
        height: qrCodeSize,
      });

      doc.end();
    });
  });
};

module.exports.getSettings = async () => {
  // Fetch settings from the database
  const result = await sql.query`SELECT * FROM settings`;
  return (
    result.recordset[0] || {
      maxExpiryDays: 30,
      voucherWidth: 210,
      voucherHeight: 99,
      titleFontSize: 25,
      normalFontSize: 16,
    }
  );
};

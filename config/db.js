require("dotenv").config(); // Load environment variables

const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
    instancename: process.env.DB_INSTANCE || "SQLEXPRESS",
  },
  port: process.env.DB_PORT || 1433,
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log("Connected to SQL Server");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

module.exports = { sql, connectDB };

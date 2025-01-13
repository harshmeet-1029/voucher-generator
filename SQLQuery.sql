-- Step 1: Create the database if it doesn't exist
-- Note: Please comment this if you want to use another database name
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'Vouchers')
BEGIN
    CREATE DATABASE Vouchers;
END

-- Step 2: Switch to the Vouchers database
USE Vouchers;

-- Step 3: Create the 'vouchers' table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'vouchers' AND xtype = 'U')
BEGIN
    CREATE TABLE vouchers (
        id INT PRIMARY KEY IDENTITY(1,1),
        code VARCHAR(10) NOT NULL,
        generated_date DATETIME NOT NULL,
        expiry_date DATETIME NOT NULL
    );
END

-- Step 4: Create the 'settings' table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'settings' AND xtype = 'U')
BEGIN
    CREATE TABLE settings (
        maxExpiryDays INT,
        voucherWidth INT,
        voucherHeight INT,
        titleFontSize INT,
        normalFontSize INT
    );
END

-- Step 5: Insert default values into the 'settings' table if it's empty
IF NOT EXISTS (SELECT * FROM settings)
BEGIN
    INSERT INTO settings (maxExpiryDays, voucherWidth, voucherHeight, titleFontSize, normalFontSize)
    VALUES (30, 500, 300, 15, 10);
END

use Vouchers
go

CREATE TABLE vouchers (
    id INT PRIMARY KEY IDENTITY(1,1),
    code VARCHAR(10) NOT NULL,
    generated_date DATETIME NOT NULL,
    expiry_date DATETIME NOT NULL
);

CREATE TABLE settings (
    maxExpiryDays INT,
    voucherWidth INT,
    voucherHeight INT,
    titleFontSize INT,
    normalFontSize INT
);

INSERT INTO settings (maxExpiryDays, voucherWidth, voucherHeight, titleFontSize, normalFontSize)
VALUES (30, 500, 300, 15, 10);

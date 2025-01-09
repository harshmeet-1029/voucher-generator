use Vouchers
go

CREATE TABLE vouchers (
    id INT PRIMARY KEY IDENTITY(1,1),
    code VARCHAR(10) NOT NULL,
    generated_date DATETIME NOT NULL,
    expiry_date DATETIME NOT NULL
);
# Voucher Generator

A simple web application that allows users to generate and manage vouchers. This application includes features like PDF generation, QR code integration, and settings customization.

---

## Features

- **Voucher Management**: Create, customize, and manage vouchers.
- **QR Code Generation**: Generate QR codes for vouchers for easy access and validation.
- **PDF Export**: Export vouchers as PDFs based on user-defined settings.
- **Settings Customization**: Define voucher settings through a dedicated settings page.
- **Print Functionality**: Print vouchers directly from the application.

---

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: EJS templating engine
- **Database**: SQL Server Express
- **Additional Libraries**:
  - QR code generation
  - PDF generation libraries

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **Yarn** (Package manager)
3. **Microsoft SQL Server** (Express or Developer edition recommended)
   - Download and install SQL Server from the [official Microsoft website](https://www.microsoft.com/en-us/sql-server/sql-server-downloads).
   - During installation:
     - Select the "Basic" or "Custom" installation option based on your requirements.
     - Configure the `SQL Server Authentication` mode and remember the username and password.
   - Install **SQL Server Management Studio (SSMS)** to manage the database. You can download it [here](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms).

---

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/harshmeet-1029/voucher-generator.git
   cd voucher-generator
   ```

2. **Install Dependencies**:

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and configure the following:

   ```env
   SESSION_SECRET = 'yourSessionSecret'
   DB_USER = 'yourDatabaseUsername'
   DB_PASSWORD = 'yourDatabasePassword'
   DB_SERVER = 'yourServerName'
   DB_NAME = 'yourDatabaseName'
   ```

   Replace the placeholders with your actual configuration values.

4. **Set Up the Database**:

   - Ensure SQL Server is running and properly configured.
   - Open the `SQLQuery.sql` file located in the project root.
   - Execute the script in SQL Server Management Studio (or any SQL client) to create the required tables

---

## Running the Application

To start the development server, use the following command:

```bash
yarn dev
```

The application will run on `http://localhost:3000` by default.

---

## Usage

1. Navigate to `http://localhost:3000`.
2. Log in with your credentials (default: `username: admin`, `password: admin`).
3. Use the dashboard to manage vouchers and settings.
4. Generate QR codes and export vouchers as PDFs.

## Contact

For inquiries or support, contact [harshmeetsingh010@gmail.com](mailto:harshmeetsingh010@gmail.com).

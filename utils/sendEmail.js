const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: "./config/config.env" });

// Create a transporter using SMTP transport
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "73d907466fb9ee",
    pass: "048748a822682c",
  },
});

exports.sendConfirmationEmail = async (email, token) => {
  try {
    const verificationUrl = `http://localhost:${process.env.PORT}/api/v1/auth/verify/${token}`;

    // Email template
    const mailOptions = {
      from: ` From ${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Confirm Your Email",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Confirm Your Email Address</h2>
          <p>Thank you for signing up! Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                      text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p>"${verificationUrl}"</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
      text: `
        Confirm Your Email Address
        
        Thank you for signing up! Please visit the following link to verify your email address:
        ${process.env.APP_URL}/verify/${token}
        
        This link will expire in 24 hours.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw new Error("Failed to send confirmation email");
  }
};

exports.sendResetEmail = async (email, token) => {
  try {
    const resetUrl = `http://localhost:${process.env.PORT}/api/v1/auth/reset/${token}`;

    //email template
    const mailOptions = {
      from: ` From ${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            color: #333333;
        }
        .content {
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>Hi </p>
            <p>We received a request to reset your password for your <strong>${process.env.FROM_NAME}</strong> account. Click the button below to reset it:</p>
            <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If the button above doesn’t work, copy and paste the following link into your browser:</p>
            <p style="word-wrap: break-word; color: #007BFF;">
                <a href="[Reset Password Link]">[Reset Password Link]</a>
            </p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>Thank you,</p>
            <p><strong> ${process.env.FROM_NAME} Team</strong></p>
        </div>
    </div>
</body>
</html>`,

      text: `Reset Your Password
        
        You are receiving this email because you requested to reset your password. Please visit the following link to reset your password:
        ${resetUrl}
        
        This link will expire in 24 hours.
      `,
    };
    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw new Error("Failed to send confirmation email");
  }
};

exports.sendEmail = async (email) => {
  try {
    //email template
    const mailOptions = {
      from: ` From ${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "it's time for your todo ",
      html: `
    <!-- Notification Container -->
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 1050">
        <div id="reminderNotification" class="alert alert-info alert-dismissible fade show" role="alert">
            Reminder: You have a task due soon!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    </div>

    <!-- Include Bootstrap JS and Popper.js for alert functionality -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
    `,
      text: "This is a test notification message!",
    };
    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending notification :", error);
    throw new Error("Failed to send notification ");
  }
};

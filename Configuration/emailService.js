const nodemailer = require("nodemailer");

// Create a reusable transporter for nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD, // Your Gmail App Password or regular password (if no 2FA)
    },
  });
};

// Function to send a reset password email
const sendResetPasswordEmail = async (toEmail, token) => {
  // Set up email options
  const resetLink = `${process.env.FRONTEND_URL}/resetaPassword/${token}`;
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: "Reset your password",
    html: `
      <p>Click on the link below to reset your password:</p>
      <br/>
      <a href="${resetLink}">Reset Password</a>
      <br/><br/>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you.</p>
      <p>Team OEP</p>
    `,
  };

  // Send the email using the transporter
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response); // Optional logging
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Error sending password reset email");
  }
};

// Function to send a notification email
const sendNotificationEmail = async (name, email, subject, message) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: "techspherebulletin@gmail.com",
    subject: `New Contact Message: ${subject}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log("Notification email sent: " + info.response);
  } catch (error) {
    console.error("Error sending notification email: ", error);
    throw new Error("Error sending notification email");
  }
};

const sendSubscriptionEmails = async (name, email) => {
  const userMailOptions = {
    from: process.env.GMAIL_USER,
    to: email, // Send to the subscriber
    subject: `Subscription Confirmation`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f9f9f9;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
              }
              .header {
                  background-color: #4CAF50;
                  color: white;
                  text-align: center;
                  padding: 20px;
                  font-size: 24px;
              }
              .content {
                  padding: 20px;
                  text-align: center;
              }
              .button {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 10px 20px;
                  color: white;
                  background-color: #4CAF50;
                  border: none;
                  border-radius: 5px;
                  text-decoration: none;
                  font-size: 16px;
              }
              .footer {
                  text-align: center;
                  padding: 10px;
                  background-color: #f1f1f1;
                  color: #555;
                  font-size: 14px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  Thank You for Subscribing! 🎉
              </div>
              <div class="content">
                  <p>Hello ${name || "Dear"},</p>
                  <p>Thank you for subscribing to our newsletter. We're excited to keep you updated with the latest news, offers, and exclusive content.</p>
                  <a href="${"http://192.168.1.6:3001/"}" class="button">Visit Our Website</a>
              </div>
              <div class="footer">
                  <p>If you have any questions, feel free to <a href="mailto:support@example.com">contact us</a>.</p>
                  <p>You can unsubscribe anytime by clicking <a href="#">here</a>.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  const adminMailOptions = {
    from: process.env.GMAIL_USER,
    to: "techspherebulletin@gmail.com", // Replace with admin email
    subject: `New Subscription Alert`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f9f9f9;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
              }
              .header {
                  background-color: #FF9800;
                  color: white;
                  text-align: center;
                  padding: 20px;
                  font-size: 24px;
              }
              .content {
                  padding: 20px;
                  text-align: center;
              }
              .footer {
                  text-align: center;
                  padding: 10px;
                  background-color: #f1f1f1;
                  color: #555;
                  font-size: 14px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  New Subscription Alert 🚀
              </div>
              <div class="content">
                  <p>Admin,</p>
                  <p>A new user has subscribed to the newsletter.</p>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
              </div>
              <div class="footer">
                  <p>This is an automated email. No action is required.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    const transporter = createTransporter();

    // Send both emails simultaneously using Promise.all
    const [userResponse, adminResponse] = await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    console.log("User notification email sent: " + userResponse.response);
    console.log("Admin notification email sent: " + adminResponse.response);
  } catch (error) {
    console.error("Error sending subscription emails: ", error);
    throw new Error("Error sending subscription emails");
  }
};



module.exports = {
  sendResetPasswordEmail,
  sendNotificationEmail,
  sendSubscriptionEmails
};

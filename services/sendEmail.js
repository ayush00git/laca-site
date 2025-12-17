const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { generateToken } = require("./token");

const sendEmail = async (user) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.USER_PASS,
    },
  });
  // token is undefined
  const token = generateToken(user);
  const targetURL = `http://localhost:${PORT}/verify-email?veri=${token}`;
  try {
    await transporter.sendMail({
    from: process.env.USER_MAIL,
    to: process.env.USER_PASS,
    subject: "Verification of email",
    html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Email - City College</title>
            <style>
                /* Base Reset */
                body, html {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                    background-color: #F5F5F5;
                    color: #333333;
                }

                /* Container */
                .email-wrapper {
                    width: 100%;
                    background-color: #F5F5F5;
                    padding: 40px 0;
                }

                .email-content {
                    max-width: 500px;
                    margin: 0 auto;
                    background-color: #FFFFFF;
                    border: 1px solid #E0E0E0;
                    border-radius: 4px; /* Slightly sharper corners for academic look */
                }

                /* Header */
                .header {
                    padding: 25px 0;
                    text-align: center;
                    border-bottom: 2px solid #800000; /* Academic Maroon Accent */
                }

                .logo {
                    font-size: 20px;
                    font-weight: bold;
                    color: #1a1a1a;
                    text-decoration: none;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                /* Body */
                .body-content {
                    padding: 30px;
                    text-align: center; /* Centered for minimal look */
                }

                h1 {
                    margin: 0 0 15px;
                    font-size: 20px;
                    color: #111111;
                }

                p {
                    margin: 0 0 20px;
                    font-size: 15px;
                    line-height: 1.5;
                    color: #555555;
                }

                /* Button */
                .btn {
                    display: inline-block;
                    background-color: #800000; /* Academic Maroon */
                    color: #FFFFFF;
                    text-decoration: none;
                    padding: 12px 28px;
                    border-radius: 4px;
                    font-weight: 600;
                    font-size: 14px;
                    margin-top: 10px;
                }

                .btn:hover {
                    background-color: #600000;
                }

                /* Link fallback */
                .link-fallback {
                    font-size: 12px;
                    color: #999999;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #EEEEEE;
                }
                
                .link-fallback a {
                    color: #800000;
                    text-decoration: underline;
                }

                /* Footer */
                .footer {
                    padding: 20px;
                    text-align: center;
                    font-size: 11px;
                    color: #888888;
                    background-color: #FAFAFA;
                }
            </style>
        </head>
        <body>

            <div class="email-wrapper">
                <div class="email-content">
                    <!-- Header -->
                    <div class="header">
                        <a href="#" class="logo">City College</a>
                    </div>

                    <!-- Content -->
                    <div class="body-content">
                        <h1>Verify your email</h1>
                        <p>Please confirm your email address to access the student portal.</p>
                        
                        <a href="${targetURL}" class="btn">Verify Email</a>
                    </div>

                    <!-- Footer -->
                    <div class="footer">
                        <p>&copy; 2024 City College. All rights reserved.</p>
                    </div>
                </div>
            </div>

        </body>
        </html>
        `,
    });
    return console.log("Email sent");
  } catch (error) {
    console.log(`${error}`);
    throw new Error(`While sending the mail`);
  }

};

module.exports = {
    sendEmail
};
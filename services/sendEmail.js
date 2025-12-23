const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async(token) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.USER_PASS,
        }
    });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const verificationURL = `http://localhost:3000/form/verify-email?token=${token}`
    try {
        await transporter.sendMail({
            from: process.env.USER_MAIL,
            to: decoded.email,
            subject: "Registration of elective subjects",
            html:  `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Registration Confirmation</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f4f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="padding: 20px 0 30px 0;">
                                
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                    
                                    <tr>
                                        <td align="center" style="padding: 40px 0 30px 0; background-color: #2563eb;">
                                            <h1 style="margin: 0; font-size: 24px; color: #ffffff;">Confirm you registration</h1>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 24px;">
                                                Hello <strong>${decoded.name}</strong>,
                                            </p>
                                            <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px; line-height: 24px;">
                                                We are pleased to inform you that your seat has been successfully reserved. Below are your registration details for the upcoming event.
                                            </p>

                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                                                <tr>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px; width: 30%;">
                                                        <strong>Full Name</strong>
                                                    </td>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #333333; font-size: 14px; font-weight: 600;">
                                                        ${decoded.name}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                                                        <strong>Email</strong>
                                                    </td>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #333333; font-size: 14px;">
                                                        <a href="mailto:${decoded.email}" style="color: #2563eb; text-decoration: none;">${decoded.email}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                                                        <strong>Roll Number</strong>
                                                    </td>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #333333; font-size: 14px;">
                                                        ${decoded.rollNumber}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                                                        <strong>Branch</strong>
                                                    </td>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #333333; font-size: 14px;">
                                                        ${decoded.branch}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 15px; color: #64748b; font-size: 14px;">
                                                        <strong>Activity Code</strong>
                                                    </td>
                                                    <td style="padding: 15px; color: #2563eb; font-size: 14px; font-weight: bold;">
                                                        ${decoded.subjectCode}
                                                    </td>
                                                </tr>
                                            </table>
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td align="center" style="padding: 30px 0 10px 0;">
                                                        <a href="${verificationURL}" 
                                                        style="background-color: #22c55e; color: #ffffff; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                                                            Confirm Registration
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center">
                                                        <p style="font-size: 12px; color: #94a3b8; margin-top: 10px;">
                                                            Click the button above to confirm your registration.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style="margin: 30px 0 0 0; color: #555555; font-size: 16px; line-height: 24px;">
                                                Please keep this email as proof of your registration. If you have any questions, feel free to reply to this email.
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="padding: 30px; background-color: #060010; color: #ffffff;">
                                            <p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8;">
                                                You received this email because you registered on our portal.
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>

                </body>
                </html>
            `
        })
    } catch(error) {
        console.log(`${error}`);
        throw new Error(`While sending mail to ${decoded.email}`);
    }
}

module.exports = {
    sendEmail
}
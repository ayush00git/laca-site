const express = require("express");
const route = express.Router();
const Subject = require("../models/subject");
const Form = require("../models/form");
const dotenv = require("dotenv");
const { sendEmail } = require("../services/sendEmail");
dotenv.config();
const jwt = require("jsonwebtoken");

route.post('/submit', async(req, res) => {
    const { name, email, rollNumber, mobileNum, gender, branch, subjectCode } = req.body;
    if( !name || !email || !rollNumber || !gender || !branch || !subjectCode || !mobileNum ) {
        return res.status(400).json({
            success: false,
            message: "All the fields are required",
        });
    };

    if( !email.endsWith('@nith.ac.in') ) {
        return res.status(400).json({
            success: false,
            message: "Only college emails are allowed",
        });
    };

    const existingUser = await Form.findOne({ email });
    if( existingUser ) {
        return res.status(400).json({
            success: false,
            message: `${existingUser.email} is already registered to ${existingUser.subjectCode}`
        });
    };
    
    const subject = await Subject.findOne({ code: subjectCode });
    if( subject.seatsFilled >= subject.maxSeats) {
        return res.status(400).json({ 
            success: false,
            message: `All the Seats for this subject have been reserved`,
        });
    };

    const token = jwt.sign(
        { name, email, rollNumber, mobileNum, branch, subjectCode, gender },
        process.env.JWT_SECRET,
        {expiresIn: '24h'},
    )

    try {
        if(!sendEmail(token)) {
            return res.status(400).json({ 
                success: false,
                message: `Error sending the email`,
            });
        }
        console.log(`Email sent to ${email}`);
        return res.status(200).json({ 
                success: true,
                message: `Check your email inbox for confirming the seat`,
        });
    } catch(error) {
        console.log(`${error}`);
        return res.status(500).json({
            success: false,
            message: `Internal server error`,
        })
    };
});

module.exports = route;

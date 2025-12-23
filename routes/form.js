const express = require("express");
const route = express.Router();
const Subject = require("../models/subject");
const Form = require("../models/form");
const dotenv = require("dotenv");
const { sendEmail } = require("../services/sendEmail");
dotenv.config();
const jwt = require("jsonwebtoken");

route.post('/', async(req, res) => {
    const { name, email, rollNumber, gender, branch, subjectCode } = req.body;
    if( !name || !email || !rollNumber || !gender || !branch || !subjectCode ) {
        return res.status(400).json({
            success: false,
            message: "All the fields are required"
        });
    }

    const existingUser = await Form.findOne({ email });
    if( existingUser ) {
        return res.status(400).json({
            success: false,
            message: `${existingUser.email} is already registered to ${existingUser.subjectCode}`
        });
    }
    
    const subject = await Subject.findOne({ code: subjectCode });
    if( subject.seatsFilled > 5) {
        return res.status(400).json({ 
            success: false,
            message: `Seats for this subject are already reserved`,
        });
    }

    const token = jwt.sign(
        { name, email, rollNumber, branch, subjectCode, gender },
        process.env.JWT_SECRET
    )

    try {
        if(!sendEmail(token)) {
            return res.status(400).json({ 
                success: false,
                message: `Error sending the email`,
            });
        }
        return res.status(200).json({ 
                success: true,
                message: `Check your inbox for reserving the seat`,
        });
    } catch(error) {
        console.log(`${error}`);
        return res.status(500).json({
            success: false,
            message: `Internal server error`,
        })
    }

});

route.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    if( !token ) {
        return res.render('verify-email', { 
            success: false,
            message: "Invalid response" 
        });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    try{

        const sub = await Subject.findOneAndUpdate(
            { code: decoded.subjectCode, seatsFilled: { $lt: 5 } },
            { $inc: { seatsFilled: 1 } },
            { new: true },
        );

        if( !sub ) {
            return req.render('verify-email', {
                success: false,
                message: `Seats for this subject just got filled up!` 
            });
        }

        const newReg = new Form({
            name: decoded.name,
            email: decoded.email,
            rollNumber: decoded.rollNumber,
            gender: decoded.gender,
            branch: decoded.branch,
            subjectCode: decoded.subjectCode,
        });
        await newReg.save();
        res.render('verify-email', {
            success: true,
            message: `Your seat has been reserved: ${decoded.subjectCode}`,
        });
    } catch(error) {
        console.log(`${error}`);
        return res.render('verify-email', {
            success: false,
            message: `Internal server error`,
        })
    }
});

module.exports = route;
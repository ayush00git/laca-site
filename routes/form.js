const express = require("express");
const route = express.Router();
const Subject = require("../models/subject");
const Form = require("../models/form");

route.post('/', async(req, res) => {
    const { name, email, rollNumber, gender, branch, subjectCode } = req.body;
    if( !name || !email || !rollNumber || !gender || !branch || !subjectCode ) {
        return res.status(400).json({ message: "All the fields are required" });
    }
    const subject = await Subject.findOneAndUpdate(
        { 
            code: subjectCode,
            seatsFilled: { $lt: 5 }
        },
        { $inc: { seatsFilled: 1 } },
        { new: true }
    );

    if( !subject ) {
        return res.status(400).json({ message: "Reservation of seats for this subject are full" });
    }

    try {
        const newStudent = new Form({
            name,
            email,
            rollNumber,
            gender,
            branch,
            subjectCode,
        });
        await newStudent.save();
        return res.status(200).json({ message: "Seat confirmed" });
    } catch (error) {
        await Subject.findOneAndUpdate(
            { code: subjectCode },
            { $inc: { seatsFilled: -1 } }
        );
        return res.status(500).json({ message: "That email is already registered to a seat" });
    }
});

module.exports = route;
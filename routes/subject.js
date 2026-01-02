const express = require("express");
const route = express.Router();
const Subject = require("../models/subject");

const subjectCode = ['SA-201', 'SA-202', 'SA-203', 'SA-204', 'SA-205', 'SA-206', 'SA-207', 'SA-208', 'SA-209', 'SA-210', 'SA-211', 'SA-212', 'SA-213'];

route.get('/', (req, res) => {
    res.render('subject', { subjectCodes: subjectCode });
});

route.post('/', async (req, res) => {
    const { code, maxSeats } = req.body;
    if (!code) return res.status(400).json({ message: "Code is required" });
    const sub = new Subject({
        code,
        maxSeats,
    });
    await sub.save();
    return res.status(200).json({ message: "Subject added to the database" });
})

module.exports = route;

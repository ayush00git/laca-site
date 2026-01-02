const express = require("express");
const route = express.Router();
const Subject = require("../models/subject");

route.post('/', async (req, res) => {
    const { code, maxSeats } = req.body;
    if( !code ) return res.status(400).json({ message: "Code is required" });
    const sub = new Subject({
        code,
        maxSeats,
    });
    await sub.save();
    return res.status(200).json({ message: "Subject added to the database" });
})

module.exports = route;

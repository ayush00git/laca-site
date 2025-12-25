const express = require("express");
const route = express.Router();
const Subject = require("../models/subject");

route.post('/', async (req, res) => {
    const { code } = req.body;
    const sub = new Subject({
        code,
    });
    await sub.save();
    return res.status(200).json({ message: "Subject set" });
})

module.exports = route;
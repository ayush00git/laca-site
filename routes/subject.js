const express = require("express");
const route = express.Router();

route.post('/subject', async (req, res) => {
    const { code } = req.body;
    const sub = new Subject({
        code,
    });
    await sub.save();
    return res.status(200).json({ message: "Subject set" });
})

module.exports = route;
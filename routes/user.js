const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get('/', (req, res) => {
    return res.status(200).render("home");
})

router.post('/verify-email', async(req, res) => {
    const { email } = req.body;
    if(!email) {
        return res.status(400).json({ "message" :"All the fields are required" });
    }
    try {
        const user = new User({ email });
        user.save();
    } catch (error) {
        console.log(`${error}`);
        throw new Error(`While saving the email to the db`);
    }
})

module.exports = router;
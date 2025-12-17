const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { sendEmail } = require("../services/sendEmail");

router.get('/', (req, res) => {
    return res.status(200).render("home");
})

router.post('/input-email', async(req, res) => {
    const { email } = req.body;
    if(!email) {
        return res.status(400).json({ "message" : "All the fields are required" });
    }
    try {
        const user = new User({ email });
        await user.save();
        sendEmail(user.email);
        return res.status(200).json({ "message": "Email sent for verification" });
    } catch (error) {
        console.log(`${error}`);
        throw new Error(`While saving the email to the db`);
    }
})

router.get('/verify-email', async(req, res) => {
    const token = req.query.veri;
    if(!token) {
        return res.status(400).json({ "message": "Invalid response" });
    }
    try {
        const decoded = jwt.verify(token);
        const user = await User.findOne({ email: decoded.email });
        if(!user.isVerified || !user) {
            return res.status(400).json({ "message": "Email not verified" })
        }
        return res.status(400).json({ "message": "Duck" });
    } catch (error) {
        console.log(`${error}`);
    }
})

module.exports = router;
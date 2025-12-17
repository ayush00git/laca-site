const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (user) => {
    const payload = {
        email: user.email,
    }
    return jwt.verify(payload, process.env.JWT_SECRET);
}

module.exports = {
    generateToken
};
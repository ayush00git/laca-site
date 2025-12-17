const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true } );

const User = mongoose.model("user", emailSchema);
module.exports = User;
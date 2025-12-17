const mongoose = require("mongoose");

const connectToMongoDB = async (url) => {
    await mongoose.connect(url);
}

module.exports = {
    connectToMongoDB
};
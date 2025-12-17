const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const emailRoute = require("./routes/user");
const { connectToMongoDB } = require("./connection");

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

connectToMongoDB(process.env.MONGO_URI)
.then(() => console.log(`MongoDB connected`))
.catch((err) => console.log(`Mongo Error: ${err}`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', emailRoute);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server started on - http://localhost:${PORT}`));
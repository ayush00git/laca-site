const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// model
const Subject = require("./models/subject");

// routes
const formRoute = require("./routes/form");
const subjectRoute = require("./routes/subject");

const { connectToMongoDB } = require("./connection");

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

connectToMongoDB(process.env.MONGO_URI)
.then(() => console.log(`MongoDB connected`))
.catch((err) => console.log(`Mongo Error: ${err}`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home');
})
app.use('/form', formRoute);
app.use('/subject', subjectRoute);

app.get('/seats', async(req, res) => {
    try {
        const seats = await Subject.find({});
        return res.status(200).json(seats);
    } catch (error) {
        return res.status(400).json({ message: "Failed to fetch seats" });
    }
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server started on - http://localhost:${PORT}`));
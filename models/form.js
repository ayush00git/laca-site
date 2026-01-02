const { model, Schema } = require("mongoose");
const branches = ['Computer Science and Engineering', 'Dual CSE', 'Electrical Engineering', 'Electronics and Communication Engineering', 'Dual ECE', 'Mechanical Engineering', 'Mathematics and Computing', 'Chemical Engineering', 'Engineering Physics', 'Materials Science and Engineering', 'Civil Engineering'];
const Subjects = ['SA-201', 'SA-202', 'SA-203','SA-204','SA-205','SA-206','SA-207','SA-208','SA-209', 'SA-210', 'SA-211', 'SA-212', 'SA-213'];

const formSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNum: {
        type: Number,
        required: true,
        unique: true,
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    branch: {
        type: String,
        enum: branches,
        required: true,
    },
    subjectCode: {
        type: String,
        enum: Subjects,
        required: true,
    },
}, { timestamps: true } );

const Form = model("form", formSchema);
module.exports = Form;

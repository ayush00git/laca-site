const { model, Schema } = require("mongoose");
const subjectCode = ['SA-201', 'SA-202', 'SA-203','SA-204','SA-205','SA-206','SA-207','SA-208','SA-209', 'SA-210', 'SA-211', 'SA-212', 'SA-213'];

const subjectSchema = new Schema({
    code: {
        type: String,
        enum: subjectCode,
        required: true,
    },
    seatsFilled: {
        type: Number,
        default: 0,
    },
    maxSeats: {
        type: Number,
        default: 120,
    },
}, { timestamps: true } );

const Subject = model("subject", subjectSchema);
module.exports = Subject;

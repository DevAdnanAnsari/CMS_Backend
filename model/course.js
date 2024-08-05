const mongoose = require("mongoose");


const course = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    createdDate: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String,
        required: false
    },
    updatedDate: {
        type: Date,
        required: false
    }
});


module.exports = mongoose.model("course", course);
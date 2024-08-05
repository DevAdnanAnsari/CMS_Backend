const mongoose = require('mongoose')
const chapter = new mongoose.Schema({

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    concepts: {
        type: [],
        required: true,
        trim: true
    },
    references: {
        type: [],
        required: true,
        trim: true
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
    },
});

module.exports = mongoose.model("chapter", chapter);
const mongoose = require("mongoose");


const student = new mongoose.Schema({

    studentname: {
        type: String,
        required: true,
        trim: true
    },
    studentId: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 8

    },
    gender: {
        type: String,
        required: true,

    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    address: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    dateOfJoining: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },

    aadharCard: {
        type: String,
        required: false,
        minlength: 12,
        maxlength: 12
    },
    panCard: {
        type: String,
        required: false,
        minlength: 10,
        maxlength: 10
    },

    highestQualification: {
        type: String,
        enum: ['ssc', 'hsc', 'bachelors', 'masters', 'phd'],
        required: true,
    },
    selectCourse: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin', 'student'],
        default: 'student'
    },
    createdBy: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
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
    recStatus: {
        type: String,
        enum: ['active', 'In_Active', 'courseCompleted'],
        default: 'active'
    }
});

module.exports = mongoose.model("student", student);



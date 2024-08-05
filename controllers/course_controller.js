const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { encryptString, matchText, decryptString } = require("../helper/security");
const { resObject } = require("../helper/responseStructure");
const { checkFieldsExist, extractFields, filterObject } = require("../utils/objectDestructure");
const { requiredFields, expectedFields } = require("../constants/fields.constants");
const { general } = require("../constants/message.constants");
const { excludeFields } = require("../constants/query.constants");
const { STATUS } = require("../constants/status.constants");
const courseSchema = require('../model/course');
const course = require("../model/course");



// Add Course
exports.addCourse = async (req, res) => {
    try {
        // Check if all required fields exist in the request body
        if (!checkFieldsExist(req.body, requiredFields.courseRegistration)) {
            return res.status(STATUS.badRequest).send(resObject(STATUS.badRequest, general.missingParameters));
        }

        let params = extractFields(req.body, expectedFields.courseRegistration)
        params = filterObject(params);

        res.status(STATUS.created).send(resObject(STATUS.created, general.courseCreated));

        const courseData = new courseSchema({
            ...params,
            createdBy: req.payload?.email,
            createdDate: new Date(),
        })
        await courseData.save()
        // const populatedCourse = await Course.findById(courseData._id).populate('chapters');
        await courseSchema.findById(courseData._id)//.populate('chapters');

    } catch (error) {
        console.error(error);
        res.status(STATUS.badRequest).send(resObject(STATUS.badRequest, general.internalServerError));
    }
};


// Get all course
exports.getAllCourses = (req, res) => {
    courseSchema.find()
        .select(excludeFields.general)
        .then(result => {
            res.status(STATUS.success).send(resObject(STATUS.success, general.allCourses, result));
        })
        .catch(err => {
            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, err));
        })
};



// Get single course
exports.singleCourse = (req, res) => {
    courseSchema.findById(req.params.id).select(excludeFields.general)
        .then(result => {
            res.status(STATUS.Success).send(resObject(STATUS.success, general.singleCourse, result));
        })
        .catch(err => {
            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, err))
        })
};

// Delete course
exports.deleteCourse = (req, res) => {
    courseSchema.findByIdAndDelete(req.params.id)
        .select(excludeFields.general)
        .then(result => {
            res.status(STATUS.success).send(resObject(STATUS.deleteCourse, general.deleteCourse, result))
        })
        .catch(err => {
            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, err))
        })
};


// Update Course
exports.updateCourse = async (req, res) => {

    let extractedFields = extractFields(req.body, expectedFields.courseRegistration);
    extractedFields = filterObject(extractedFields)

    let params = {
        ...extractedFields,
        updatedBy: req.payload?.email,
        updatedDate: new Date()
    }
    const courseId = req.body._id;
    await courseSchema.findOneAndUpdate(
        { _id: courseId },
        {
            $set: params
        },
    )
        .select(excludeFields.general)
        .then(result => {
            res.status(STATUS.success).send(resObject(STATUS.updateCourse, general.updateCourse, result))
        })
        .catch(err => {
            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, err))
        })
}
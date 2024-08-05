const { resObject } = require("../helper/responseStructure");
const { checkFieldsExist, extractFields, filterObject } = require("../utils/objectDestructure");
const { requiredFields, expectedFields } = require("../constants/fields.constants");
const { general } = require("../constants/message.constants");
const { excludeFields } = require("../constants/query.constants");
const { STATUS } = require("../constants/status.constants");
const chapterSchema = require('../model/chapter');


// Add Chapter
exports.addChapter = async (req, res) => {
    try {
        // Check if all required fields exist in the request body
        if (!checkFieldsExist(req.body, requiredFields.chapterRegistration)) {
            return res.status(STATUS.badRequest).send(resObject(STATUS.badRequest, general.missingParameters));
        }
        let params = extractFields(req.body, expectedFields.chapterRegistration);
        params = filterObject(params);

        const chapterData = new chapterSchema({
            ...params,

            createdBy: req.payload?.email,
            createdDate: new Date(),
        });
        await chapterData.save();
        res.status(STATUS.created).send(resObject(STATUS.created, general.chapterCreated));

    } catch (error) {
        console.error(error);
        res.status(STATUS.badRequest).send(resObject(STATUS.badRequest, general.internalServerError));
    }
};



// Get all chapters
exports.getAllChapters = async (req, res) => {
    chapterSchema.find({ courseId: req.query.courseId })
        .select(excludeFields.general)
        .then(result => {
            res.status(STATUS.success).send(resObject(STATUS.success, general.allChapters, result))
        })
        .catch(err => {
            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, err))
        })
};


//get single chapter
exports.singleChapter = async (req, res) => {
    chapterSchema.findById(req.params.id)
        .select(excludeFields.general)
        .then(result => {
            res.status(STATUS.success).send(resObject(STATUS.success, general.singleChapter, result))
        })
        .catch(err => {
            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, err))
        })
};


// Delete chapter
exports.deleteChapter = async (req, res) => {
    chapterSchema.findByIdAndDelete(req.params.id)
        .select(excludeFields.general)
        .then(result => {
            res.status(STATUS.success).send(resObject(STATUS.success, general.deleteCourse, result))
        })
        .catch(err => {
            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, general.inactiveStudents, err))
        })
};



// Update chapter
exports.updateChapter = async (req, res) => {

    let extractedFields = extractFields(req.body, expectedFields.chapterRegistration);
    extractedFields = filterObject(extractedFields)

    let params = {
        ...extractedFields,
        updatedBy: req.payload?.email,
        updatedDate: new Date()
    }
    const chapterId = req.body._id;
    await chapterSchema.findOneAndUpdate(
        { _id: chapterId },
        {
            $set: params
        },
    )
        .select(excludeFields.general)
        .then(result => {
            res.status(STATUS.success).send(resObject(STATUS.success, general.chapterUpdated, result))
        })
        .catch(err => {
            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, err))
        })
}
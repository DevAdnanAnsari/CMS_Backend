const studentSchema = require("../model/student");
const student = require("../model/student");
const jwt = require('jsonwebtoken');
const { encryptString, matchText, decryptString } = require("../helper/security");
const { resObject } = require("../helper/responseStructure");
const { checkFieldsExist, extractFields, filterObject } = require("../utils/objectDestructure");
const { requiredFields, expectedFields } = require("../constants/fields.constants");
const { excludeFields } = require("../constants/query.constants");
const { general } = require("../constants/message.constants");
const { STATUS } = require("../constants/status.constants");




// get all student
exports.getStudent = (req, res, next) => {
    studentSchema.find({ role: "student" })
        .select(excludeFields.general)
        .then(result => {
            res.status(STATUS.success).send(resObject(STATUS.success, general.allStudents, result));
        })
        .catch(err => {
            console.log(err);
            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, err));
            next()
        });
};

// Total Active Student count
exports.studentsRecStatus = async (req, res, next) => {
    try {
        const totalStudents = await studentSchema.find({ role: "student" }).count();
        const activeStudents = await studentSchema.find({ role: "student", recStatus: 'active' }).count();
        const deActiveStudents = await studentSchema.find({ role: "student", recStatus: 'In_Active' }).count();
        const completedStudents = await studentSchema.find({ role: "student", recStatus: 'courseCompleted' }).count();
        res.status(STATUS.success).send(resObject(STATUS.success, general.activeStudents, { total: totalStudents, active: activeStudents, inActive: deActiveStudents, completed: completedStudents }));
    } catch (error) {
        console.error(error);
        res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, "Error", error));
        next();
    }
};


//get single student
exports.getSinglestudent = async (req, res, next) => {
    if (req.params.id === "qualification") {
        return
    }
    studentSchema.findById(req.params.id)
        .select(excludeFields.general).lean()
        .then(result => {
            const decryptedPassword = decryptString(result.password);
            const response = { ...result, password: decryptedPassword }
            res.status(STATUS.success).send(resObject(STATUS.success, general.singleStudent, response));
        })
        .catch(err => {
            console.error(err);
            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, general.internalServerError, err))
            next()
        });
};


// register student
exports.registerStudent = async (req, res, next) => {

    // Validate that required fields are present
    if (!checkFieldsExist(req.body, requiredFields.studentRegistration)) {
        return res.status(STATUS.badRequest).send(resObject(STATUS.badRequest, general.missingParameters));
    }

    let params = extractFields(req.body, expectedFields.studentRegistration);
    params = filterObject(params)

    try {
        const newStudent = new studentSchema({
            ...params,
            password: encryptString(req.body.password),
            createdBy: req.payload?.email,
            createdDate: new Date(),
        });

        await newStudent.save();
        const savedStudent = await studentSchema.findById(newStudent._id).select(excludeFields.general);

        res.status(STATUS.created).send(resObject(STATUS.created, general.studentCreated, savedStudent));

    } catch (error) {
        console.error(error);

        res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, general.internalServerError, error))
    }
};


// delete student
exports.deleteStudent = async (req, res, next) => {

    studentSchema.findByIdAndUpdate({ _id: req.params.id }, { recStatus: 'In_Active' }, { new: true })
        .select(excludeFields.general)
        .then(result => {
            res.status(STATUS.Success).send(resObject(STATUS.Success, general.deleteStudent, result));
        })
        .catch(err => {

            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, general.internalServerError, err))
            next()
        });
};

// update student
exports.updateStudent = async (req, res, next) => {
    // const password = req.body.password;
    const studentId = req.body._id;
    // Validate that required fields are present
    if (!checkFieldsExist(req.body, requiredFields.studentRegistration)) {
        return res.status(STATUS.badRequest).send(resObject(STATUS.badRequest, general.missingParameters));
    }

    let extractedFields = extractFields(req.body, expectedFields.studentRegistration);
    extractedFields = filterObject(extractedFields)

    try {

        let params = {
            ...extractedFields,
            password: encryptString(req.body.password),
            updatedBy: req.payload?.email,
            updatedDate: new Date(),
        }

        await studentSchema.findOneAndUpdate(
            { _id: studentId },
            {
                $set: params
            },

        ).select(excludeFields.general) // Exclude specified fields
            .exec();

        res.status(STATUS.Success).send(resObject(STATUS.Success, general.studentUpdated, params));

    } catch (error) {
        console.error(error);
        res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, general.internalServerError, error))
        next()
    }
};



// Login Page
exports.loginStudent = (req, res, next) => {
    const email = req.body.email;
    const inputPassword = req.body.password;
    if (!email && !inputPassword) {
        return res.status(STATUS.badRequest).send(resObject(STATUS.unauthorized, general.requiredFields));
    }
    student.findOne({ email: email })
        .exec()
        .then(studentData => {
            if (!studentData) {
                return res.status(STATUS.badRequest).send(resObject(STATUS.unauthorized, general.notExists));
            }

            if (!matchText(inputPassword, studentData.password)) {
                return res.status(STATUS.badRequest).send(resObject(STATUS.unauthorized, general.incorrectPassword))
            }

            const params = {
                gender: studentData.gender,
                studentId: studentData.studentId,
                phoneNumber: studentData.phoneNumber,
                address: studentData.address,
                dateOfBirth: studentData.dateOfBirth,
                dateOfJoining: studentData.dateOfJoining,
                email: studentData.email,
                password: studentData.password,
                aadharCard: studentData.aadharCard,
                panCard: studentData.panCard,
                selectCourse: studentData.selectCourse,
                highestQualification: studentData.highestQualification,
                role: studentData.role,
                creatoremail: studentData.createdBy // Include the creator field here
            }
            const token = jwt.sign(params, "secret_key", {
                expiresIn: '24h'
            });

         const { __v, password, createdBy, createdDate, ...sanitizedStudentData } = studentData.toObject();

            res.status(STATUS.Success).send(resObject(STATUS.Success, general.login, { token, ...sanitizedStudentData }));
        })
        .catch(err => {
            console.log(err);
            res.status(STATUS.internalServerError).send(resObject(STATUS.internalServerError, err))
        });
};

// get students by highest qualification
exports.studentsQualification = (req, res) => {
    const qualifications = require("../constants/qualifications.json")
    res.status(STATUS.success).send(resObject(STATUS.Success, general.studentsByQualification, qualifications));
};
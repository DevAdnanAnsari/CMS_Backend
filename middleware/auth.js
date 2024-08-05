const { general } = require("../constants/message.constants");
const { STATUS } = require("../constants/status.constants");
const { resObject } = require("../helper/responseStructure");

exports.authorization = (req, res, next) => {
    //  Assuming that user information (role and email) is available in the req.body object
    const { role } = req.payload;
    // Check if the student is a super admin
    if (role === 'super_admin') {
        // If the user is a super admin, proceed with the next middleware
        next();
    } else {
        res.status(STATUS.forbidden).send(resObject(STATUS.forbidden, general.onlyAdmin));
    }
};

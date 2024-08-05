// check required fields in object
exports.checkFieldsExist = (obj, fieldsToCheck) => {
    const objKeys = Object.keys(obj);
    return fieldsToCheck.every(field => objKeys.includes(field));
}

// Extract fields from the sourceObject
exports.extractFields = (sourceObject, fieldsToExtract) => {
    const extractedObject = {};
    fieldsToExtract.forEach(field => {
        extractedObject[field] = sourceObject[field];
    });
    return extractedObject;
}
// handle undefined and null error
exports.filterObject = (originalObject) => {
    return Object.fromEntries(
        Object.entries(originalObject).filter(([_, value]) => value !== null && value !== undefined)
    );
}


// Required fields
exports.requiredFields = {
    studentRegistration: ['studentname', 'gender', 'phoneNumber', 'address', 'email', 'dateOfBirth', 'dateOfJoining', 'highestQualification', 'selectCourse', 'password', 'studentId', 'password'],
    courseRegistration: ['title', 'description'],
    chapterRegistration: ['courseId', 'title', 'description', 'concepts', 'references'],
}


// Optional fields
exports.expectedFields = {
    studentRegistration: ['studentname', 'gender', 'phoneNumber', 'address', 'email', 'dateOfBirth', 'dateOfJoining', 'aadharCard', 'panCard', 'selectCourse', 'highestQualification', 'recStatus', 'role', 'studentId'],
    courseRegistration: ['title', 'description'],
    chapterRegistration: ['courseId', 'title', 'description', 'concepts', 'references'],
}




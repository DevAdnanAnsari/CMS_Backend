const express = require("express");
const router = express.Router();
const controllers = require("../controllers/student_controller");
const middleware = require("../middleware/auth");
const authMiddleware = require("../middleware/authMiddleware");


// routes
router.post('/register', authMiddleware.verifyToken, middleware.authorization, controllers.registerStudent);
router.get('/', authMiddleware.verifyToken, middleware.authorization, controllers.getStudent);
router.get('/stats', authMiddleware.verifyToken, middleware.authorization, controllers.studentsRecStatus);
router.delete('/:id', authMiddleware.verifyToken, middleware.authorization, controllers.deleteStudent);
router.post('/update', authMiddleware.verifyToken, middleware.authorization, controllers.updateStudent);
router.post('/login', controllers.loginStudent);
router.get('/qualification', controllers.studentsQualification);
router.get('/:id', authMiddleware.verifyToken, middleware.authorization, controllers.getSinglestudent);




module.exports = router;




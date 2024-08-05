const express = require("express");
const router = express.Router();
const controllers = require("../controllers/course_controller");
const middleware = require("../middleware/auth");
const authMiddleware = require("../middleware/authMiddleware");


// Routes
router.post('/addcourse', authMiddleware.verifyToken, middleware.authorization, controllers.addCourse);
router.get('/', authMiddleware.verifyToken, middleware.authorization, controllers.getAllCourses);
router.get('/:id', authMiddleware.verifyToken, middleware.authorization, controllers.singleCourse);
router.delete('/:id', authMiddleware.verifyToken, middleware.authorization, controllers.deleteCourse);
router.post('/update', authMiddleware.verifyToken, middleware.authorization, controllers.updateCourse);






module.exports = router;

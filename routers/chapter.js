const express = require("express");
const router = express.Router();
const controllers = require("../controllers/chapter_controller");
const middleware = require("../middleware/auth");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post('/addchapter', authMiddleware.verifyToken, middleware.authorization, controllers.addChapter);
router.get('/', authMiddleware.verifyToken, middleware.authorization, controllers.getAllChapters);
router.get('/:id', authMiddleware.verifyToken, middleware.authorization, controllers.singleChapter);
router.delete('/:id', authMiddleware.verifyToken, middleware.authorization, controllers.deleteChapter);
router.post('/update', authMiddleware.verifyToken, middleware.authorization, controllers.updateChapter);








module.exports = router;
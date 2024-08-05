const studentRouter = require('./student');
const courseRouter = require('./course')
const chapterRouter = require('./chapter')

exports.setupRouters = (app) => {
    app.use('/student', studentRouter);
    app.use('/course', courseRouter);
    app.use('/chapter', chapterRouter)
}
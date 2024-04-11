const course = require('../models/course_model');
const { validationResult } = require('express-validator');
const httpStatus = require('../utility/https_status');
const appError = require('../utility/app_error');
const asyncWrapper = require('../middleware/asyncWrapper');

const getAllCourses = async (req, res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await course.find({}, { "__v": false }).limit(limit).skip(skip);
    res.json({ status: httpStatus.SUCCESS, data: { courses } });
};

const getSiglecourse = asyncWrapper(
    async (req, res, next) => {
        const Course = await course.findById(req.params.courseid);
        if (!course) {
            const error = appError.create('course not found', 404, httpStatus.FAIL);
            return next(error);
        }
        return res.json({ status: httpStatus.SUCCESS, data: { Course } });
    }
);

const addcourse = asyncWrapper(
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, httpStatus.FAIL)
            return next(error);
        }
        const newCourse = new course(req.body);
        await newCourse.save();
        res.status(201).json({ status: httpStatus.SUCCESS, data: { course: newCourse } });
    }
)

const updateCourse = asyncWrapper(
    async (req, res) => {
        const courseid = req.params.courseid;
        const updatedCourse = await course.updateOne({ _id: courseid }, { $set: { ...req.body } });
        return res.status(200).json({ status: httpStatus.SUCCESS, data: { course: updatedCourse } });
    }
)


const deletCourse = asyncWrapper(
    async (req, res) => {
        const courseid = req.params.courseid;
        const result = await course.deleteOne({ _id: courseid });
        res.status(200).json({ success: true, msg: result });
    }
)

module.exports = {
    getAllCourses,
    getSiglecourse,
    addcourse,
    updateCourse,
    deletCourse,
}
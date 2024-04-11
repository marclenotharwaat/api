const express = require('express');
const router = express.Router();
const coursesController = require("../controller/courses_controller");
const { body } = require('express-validator');
const verifyToken = require('../middleware/verify_token');
const allow_to = require('../middleware/allow_to');
const userRole = require('../utility/userRole');

router.route('/')
    .get(coursesController.getAllCourses)
    .post([
        body('title')
            .notEmpty()
            .withMessage('title is required')
            .isLength({ min: 2 })
            .withMessage('title is ><')
        ,
        body('price')
            .notEmpty()
            .withMessage('price is required')
            .isLength({ min: 2 })
    ]
        , coursesController.addcourse);

router.route('/:courseid')
    .patch(coursesController.updateCourse) 
    .get(coursesController.getSiglecourse)
    .delete(verifyToken,allow_to(userRole.ADMIN),coursesController.deletCourse);
module.exports = router;
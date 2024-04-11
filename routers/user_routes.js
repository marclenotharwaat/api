const express = require('express');
const routers = express.Router();
const userController = require('../controller/users_controller')
const verifyToken = require('../middleware/verify_token')
const multer = require('multer');
const app_error = require('../utility/app_error');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(file)
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
        const ext = file.mimetype.split('/')[1]
        const fileName = `user-${Date.now()}.${ext}`
        callback(null, fileName)
    }
})

const fileFilter = (req, file, callback) => {
    const imageType = file.mimetype.split("/")[0]
    if (imageType == 'image') {
        return callback(null, true)
    } else {
        return callback(app_error.create("file must be an image", 400), false)
    }
}



const upload = multer({
    storage: diskStorage,
    fileFilter
}
)
//get all users

routers.route('/').get(verifyToken, userController.getAllUsers);
//user register
routers.route('/register').post(upload.single('avatar'), userController.register);
//user login
routers.route('/login').post(userController.login);
module.exports = routers
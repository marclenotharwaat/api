const JWT = require('jsonwebtoken');
const appError = require("../utility/app_error")
const httpStatus = require('../utility/https_status')
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    if (!authHeader) {
        const err = appError.create('token is require', 401, httpStatus.Error)
        return next(err)
    }
    const token = authHeader.split(' ')[1];
    try {
        const currentUser = JWT.verify(token,
            "45ab3f5eb14a437e865deb3648a1e31aa2688e30f39c9e7fca3bc0a0d69835f8")
            req.currentUser = currentUser
        next()
    } catch (error) {
        const err = appError.create('invalid token', 401, httpStatus.Error)
        return next(err)
    }
}
module.exports = verifyToken

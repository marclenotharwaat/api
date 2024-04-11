const app_error = require("../utility/app_error")

module.exports = (...rols) => {
    return (req, res, next) => {
        if (!rols.includes(req.currentUser.role)) {
            return next(app_error.create('this role is not authorized'),401)
        }
        next()
    }
}
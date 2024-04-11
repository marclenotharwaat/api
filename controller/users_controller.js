const asyncWrapper = require("../middleware/asyncWrapper");
const User = require('../models/user_model');
const httpStatus = require('../utility/https_status');
const appError = require('../utility/app_error');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const generatJWT = require('../utility/generate_JWT');

const getAllUsers = asyncWrapper(
    async (req, res) => {
        const users = await User.find({}, { "__v": false, "password": false });
        res.json({ status: httpStatus.SUCCESS, data: { users } })
    }

)

const register = asyncWrapper(
    async (req, res, next) => {
        const { firstName, lastName, email, password, role } = req.body;
        const oldUser = await User.findOne({ email: email }, { "__v": false, "password": false });

        if (oldUser) {
            const er = appError.create("user already exsist", 400, httpStatus.FAIL);
            return next(er);
        }
      
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword,
            role: role,
            avatar: req.file.filename
        })
        //generat token 
        const token = await generatJWT({ userID: newUser._id })
        newUser.token = token;
        await newUser.save();
        return res.json({ status: httpStatus.SUCCESS, data: { user: newUser } })
    }
)

const login = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            const err = appError.create("email and password are required", 400, httpStatus.FAIL)
            return next(err);
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            const err = appError.create('user not found ', 400, httpStatus.FAIL);
            return next(err);
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if (user && matchPassword) {

            //generate JWT
            const token = await generatJWT({ email: user.email, userID: user._id, role: user.role })

            return res.json({ status: httpStatus.SUCCESS, data: { token } })
        } else {
            const err = appError.create('something wrong', 500, httpStatus.Error)
            return next(err)
        }
    }


)

module.exports = {
    getAllUsers,
    register,
    login

}

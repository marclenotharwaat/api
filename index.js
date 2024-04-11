const express = require('express');
const app = express();
app.use(express.json());
const httpStatus = require("./utility/https_status");
const coursesRouters = require('./routers/courses_routes');
const usersRouters = require('./routers/user_routes');
const path = require('path')
app.use('/api/courses', coursesRouters);
app.use('/api/users', usersRouters);
const mongoos = require('mongoose');
const url = "mongodb+srv://marclenotharwat:nodejs@learn.pc4fmql.mongodb.net/BIS?retryWrites=true&w=majority&appName=learn"
mongoos.connect(url).then(
    () => {
        console.log('mongodb server started');
    }
);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use("*", (req, res, next) => {
    return res.status(404).json({ statue: httpStatus.Error, message: "this resourse is not valid" })
})

app.use((err, req, res, next) => {
    res.status(500).json({ status: err.statusText || httpStatus.Error, message: err.message, code: err.statusCode || 500, data: null })
})

app.listen(4000, () => {
    console.log("listening on port 4000");
});




const mongoos = require('mongoose');
const courseSchema = new mongoos.Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }   
    }
)
module.exports = mongoos.model('Course' , courseSchema);
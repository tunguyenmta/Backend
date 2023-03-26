const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type: 'string',
        required: true
    },
    email:{
        type: 'string',
        required: true
    },
    password:{
        type: 'string',
        required: true
    },
    games: {
        type: 'array',
        default: []
    },
    createdAt:{
        type: Date,
        default: new Date()


    }
})

module.exports = mongoose.model('User',userSchema)
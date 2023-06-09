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
    userImage:{
        type: "string",
        required: true,
    },
    address: {
        type: 'string',
        default: ""
    },
    userName:{
        type: 'string',
    },
    age: {
        type: 'number',
        default: 18
    },
    payment: {
        type: 'string',
        default: ""
    },
    isAdmin:{
        type: 'boolean',
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User',userSchema)
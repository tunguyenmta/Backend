const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    title: {
        type: "string",
        required: true
    },
    description:{
        type: "string",
        required: true
    },
    image: {
        type: "string",
        required: true
    },
    icon:{
        type: "string",
        required: true
    },
    creator: {type: mongoose.Schema.type.objectId, required: true, ref: 'User'},
    buyer: [{type: mongoose.Schema.type.objectId, ref: 'User'}], default: []
})

module.exports = mongoose.model("Game", gameSchema)
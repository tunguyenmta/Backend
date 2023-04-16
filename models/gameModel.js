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
        contentType: String,
        data: Buffer,
    },
    icon:{
        contentType: String,
        data: Buffer,
    },
    rating:{
        type: 'number',
        default: 0
    },
    rated: {
        type: 'number',
        default: 0
    }
    ,
    creator: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    buyer: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], default: []
})

module.exports = mongoose.model("Game", gameSchema)
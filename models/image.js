const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    name: String,
    description: String,
    img: {
        data: Buffer,
        contentType: String
    }
})

module.exports = mongoose.model('Image', imageSchema)
const ImgageModel = require('../models/image')
const multer = require('multer');
const uuid = require('uuid')

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads')
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname+'-'+uuid.v4())
    }
})

const upload = multer({storage: storage})

module.exports = upload
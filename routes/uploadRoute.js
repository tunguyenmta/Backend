const express = require('express')
const upload = require('../controllers/uploadImage')
const Image = require('../models/image')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs')

const router = express.Router()
router.post('/upload', upload.single('image'), (req,res)=>{
    const img = fs.readFileSync(req.file.path)
    const encode_img = img.toString('base64')
    const final_img = {
        contentType: req.file.mimetype,
        image: new Buffer.from(encode_img, 'base64')
    };
    Image.create({img: final_img}).
        then(()=>{
        console.log("Save to db")
        res.contentType(final_img.contentType);
        res.send(final_img.image)
    }).catch((err)=>{console.log(err)})
})


module.exports = router
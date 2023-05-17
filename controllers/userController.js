const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const path = require('path');
const objectId = require('mongoose').Types.ObjectId
const bcrypt = require('bcryptjs');
const fs = require('fs')
const sharp = require('sharp')
const crypto = require('crypto')
const { uploadFile, deleteFile, getObjectSignedUrl } =require('../middlewares/S3')
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')


const getAllUsers = asyncHandler( async (req, res, next)=>{
    const user = await User.find({})
    res.status(200).send(user);
} )

const getUserByEmail = asyncHandler( async (req, res, next)=>{
    let user = await User.findOne({ email: req.user.email })
    if (user){
        res.status(200).send({
            _id: user.id,
            name: user.name,
            email: user.email,
            img: user.userImage,
            token: generateToken(user._id)
        })
    } else{
        res.status(404)
        throw new Error("User not found")
    }
})

const getUserById = asyncHandler( async (req, res, next)=>{
    const user = await User.findById(req.params.userid)
    if(!user){
        res.status(404)
        throw new Error('User not found')
    } else{
        res.status(200).send(user)
    }
} )

const registerUser = asyncHandler( async (req, res, next)=>{
    const {name, email, password} = req.body
    if(!name || !password || !email){
        res.status(400)
        throw new Error(`Please add all fields`)
    }

    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400)
        throw new Error(`User already exists`)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    let user
    // console.log(req.file)
    if(req.file){
        const file = req.file
        const imageName = generateFileName()
        const fileBuffer = await sharp(file.buffer)
        .resize({ height: 600, width: 600, fit: "contain" })
        .toBuffer()
        await uploadFile(fileBuffer, imageName, file.mimetype)
        const imgUrl = await getObjectSignedUrl(imageName)
        user = await User.create({name, password: hashedPassword, email, userImage: imgUrl})
        // const img = fs.readFileSync(req.file.path)
        // console.log(req.file)
        // const encode_img = img.toString('base64')
        // const final_img = {
        // contentType: req.file.mimetype,
        // data: new Buffer.from(encode_img, 'base64')
    }
     else{
        const defaultData = "https://w7.pngwing.com/pngs/416/62/png-transparent-anonymous-person-login-google-account-computer-icons-user-activity-miscellaneous-computer-monochrome-thumbnail.png"
        // const defaultImg = fs.readFileSync(path.join('./uploads', 'anonymous.png')).toString('base64');
        // const defaultData = {
        //     contentType: fs.readFileSync(path.join('./uploads', 'anonymous.png')).mimetype,
        //     data: new Buffer.from(defaultImg,'base64')
        user = await User.create({name, password: hashedPassword, email, userImage: defaultData})
    }
    
    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            img: user.userImage,
            token: generateToken(user._id)
        })
    } else{
        res.status(400)
        throw new Error(`Invalid user data`)
    }
} )

const getMe = asyncHandler( async (req, res, next) => {
    const {_id, name, email, userImage} = await User.findById(req.user.id)
    res.status(200).json({
        id: _id,
        name,
        email,
        userImage
    })
})


const login = asyncHandler( async (req, res, next)=>{
    const {name, password} = req.body;
    const user = await User.findOne({name});
   
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            img: user.userImage,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else{
        res.status(404)
        throw new Error(`Invalid login`)
    }
} )

const updateUser = asyncHandler( async (req, res, next)=>{          

    const {name ,address, age} = req.body
    
    // console.log(req.body)
    let updateUser
    if(req.file){
        // console.log(req.file)
        const avatar = fs.readFileSync(req.file.path)
        const encode_img = avatar.toString('base64')
        const final_img = {
            contentType: req.file.mimetype,
            data: new Buffer.from(encode_img, 'base64')
        }


        updateUser = await User.findOneAndUpdate({_id: new objectId(req.params.userid)}, {userName: name, age: age, userImage: final_img, address: address},{new: true})
        await updateUser.save()
    } else{
        updateUser = await User.findOneAndUpdate({_id: new objectId(req.params.userid)}, {userName: name, age: age, address: address},{new: true})
        await updateUser.save()
    }
    if(updateUser){
       res.json({
        address: updateUser.address,
        age: updateUser.age,
        name: updateUser.name,
        img: updateUser.userImage,
        _id: updateUser.id,
        email: updateUser.email
       }) 
    } else{
        res.status(500)
        throw new Error("Update failed")
    }     
})

const deleteUser = asyncHandler( async (req, res, next)=>{
    res.status(200).send({message: `delete user ${req.params.userid}`});
})

const generateToken = (id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    })
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    registerUser,
    login,
    getMe
}
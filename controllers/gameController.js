const asyncHandler = require('express-async-handler');
const Game = require('../models/gameModel')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const path = require('path');
const objectId = require('mongoose').Types.ObjectId
const bcrypt = require('bcryptjs');
const fs = require('fs')
const sharp = require('sharp')
const crypto = require('crypto')

const { uploadFile, deleteFile, getObjectSignedUrl } =require('../middlewares/S3')


const getAllGames = asyncHandler( async (req, res, next)=>{
    const game = await Game.find({})
    res.status(200).send(game);
} )

const getGameById = asyncHandler( async (req, res, next)=>{
    const game = await Game.findById(req.params.gameid)
    if(!game){
        res.status(404)
        throw new Error('Game not found')
    } else{
        res.status(200).send(game)
    }
} )

const createGame = asyncHandler( async (req, res, next)=>{
    const {title, description, creator} = req.body
    const user = await User.findById(creator)
    if(!title || !description || !creator){
        res.status(400)
        throw new Error(`Please add all fields`)
    }
    const gameExist = await Game.findOne({title})
    if(gameExist){
        res.status(400)
        throw new Error(`Game already exists`)
    }
    let game
    if(req.files){
        const file = req.files
        const imageName = generateFileName()

        const fileBuffer = await sharp(file[0].buffer)
        .resize({ height: 1920, width: 1080, fit: "contain" })
        .toBuffer()
        await uploadFile(fileBuffer, imageName, file[0].mimetype)

        const iconName = generateFileName()
        const iconBuffer = await sharp(file[1].buffer)
        .resize({ height: 600, width: 600, fit: "contain" })
        .toBuffer()
        await uploadFile(iconBuffer, iconName, file[1].mimetype)
        const imgUrl = await getObjectSignedUrl(imageName)
        const iconUrl = await getObjectSignedUrl(iconName)


    //     const img = fs.readFileSync(req.files[0].path)
    //     const icon = fs.readFileSync(req.files[1].path)
    //     const encode_icon = icon.toString('base64')
    //     const encode_img = img.toString('base64')
    //     const icon_img = {
    //         contentType: req.files[1].mimetype,
    //         data: new Buffer.from(encode_icon, 'base64')
    //     }
    //     const final_img = {
    //         contentType: req.files[0].mimetype,
    //         data: new Buffer.from(encode_img, 'base64')
    // };
        game = await Game.create({title: title, description: description, creator: new objectId(user.id), image: imgUrl, icon: iconUrl})
    } else{
        const defaultImg = fs.readFileSync(path.join('./uploads', 'game.png')).toString('base64');
        const defaultData = {
            contentType: fs.readFileSync(path.join('./uploads', 'game.png')).mimetype,
            data: new Buffer.from(defaultImg,'base64')
    }
        game = await Game.create({title: title, description: description, creator: new objectId(user.id), image: defaultData, icon: defaultData})
    }
    if(game){
        res.status(201).json({
            _id: game.id,
            title: game.title,
            descrition: game.description,
            creator: game.creator,
            img: game.image,
            icon: game.icon
        })
    } else{
        res.status(400)
        throw new Error(`Invalid game data`)
    }
} )

const getGame = asyncHandler( async (req, res, next) => {
    const {_id, title, desctiption, image, icon} = await Game.findById(req.game.id)
    res.status(200).json({
        id: _id,
        title,
        desctiption,
        image,
        icon
    })
})


const updateGame = asyncHandler( async (req, res, next)=>{          
    res.send('updated')
})

const ratingGame = asyncHandler( async (req, res, next)=>{
    const {rating} = req.body
    let rated = await Game.findById(req.params.gameid)

    let rateTimes = rated.rated+1
    let stars = rated.rating+rating*1

    const ratedGame = await Game.findOneAndUpdate( {_id: new objectId(req.params.gameid)}, { rating: stars, rated: rateTimes }, {new: true})
    await ratedGame.save()
    if(!ratedGame){
        throw new Error(`Invalid game`)
    } else {
        res.json(ratedGame)
    }
})

const deleteGame = asyncHandler( async (req, res, next)=>{
    res.status(200).send({message: `delete user ${req.params.userid}`});
})


const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')


const uploadImgS3 = asyncHandler( async (req, res, next)=>{
    const file = req.file
  const imageName = generateFileName()

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer()

  await uploadFile(fileBuffer, imageName, file.mimetype)

//   return imageName
  res.status(201).send(fileBuffer)
})

const getImgS3 = asyncHandler( async (req, res, next)=>{
    const key = req.params.key
    const readStream = getFileS3(key)
    readStream.pipe(res)
})

module.exports = {
    getAllGames,
    getGameById,
    updateGame,
    createGame,
    deleteGame,
    ratingGame,
    getGame,
    uploadImgS3,
    getImgS3
}
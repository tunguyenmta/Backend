const asyncHandler = require('express-async-handler');
const Game = require('../models/gameModel')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const path = require('path');
const objectId = require('mongoose').Types.ObjectId
const bcrypt = require('bcryptjs');
const fs = require('fs')

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
        console.log(req.files)
        const img = fs.readFileSync(req.files[0].path)
        const icon = fs.readFileSync(req.files[1].path)
        const encode_icon = icon.toString('base64')
        const encode_img = img.toString('base64')
        const icon_img = {
            contentType: req.files[1].mimetype,
            data: new Buffer.from(encode_icon, 'base64')
        }
        const final_img = {
            contentType: req.files[0].mimetype,
            data: new Buffer.from(encode_img, 'base64')
    };
        game = await Game.create({title: title, description: description, creator: new objectId(user.id), image: final_img, icon: icon_img})
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
            title: game.name,
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

const deleteGame = asyncHandler( async (req, res, next)=>{
    res.status(200).send({message: `delete user ${req.params.userid}`});
})


module.exports = {
    getAllGames,
    getGameById,
    updateGame,
    createGame,
    deleteGame,
    getGame
}
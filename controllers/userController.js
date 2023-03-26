const asyncHandler = require('express-async-handler');
const getAllUsers = asyncHandler( async (req, res, next)=>{
    res.status(200).send({message: 'get all users'});
} )

const getUserById = asyncHandler( async (req, res, next)=>{
    res.status(200).send({message: `get user ${req.params.userid}`});
} )

const registerUser =asyncHandler( async (req, res, next)=>{
    if(!req.body.name || !req.body.password || !req.body.email){
        res.status(400)
        throw new Error(`missing something`)
    }
    res.status(201).send({message: 'user created successfully'})
} )

const login = asyncHandler( async (req, res, next)=>{
    res.status(200).send({message: 'Login successfully'})
} )

const updateUser = asyncHandler( async (req, res, next)=>{
    res.status(200).send({message: `update user ${req.params.userid}`});
}
)
const deleteUser = asyncHandler( async (req, res, next)=>{
    res.status(200).send({message: `delete user ${req.params.userid}`});
})

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    registerUser,
    login
}
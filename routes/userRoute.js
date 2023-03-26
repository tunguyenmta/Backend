const { Router } = require('express');
const express = require('express');
const {getAllUsers, getUserById, updateUser, deleteUser, registerUser, login} = require('../controllers/userController')

const router = express.Router();

router.get('/', getAllUsers)

router.get('/:userid', getUserById)

router.post('/register', registerUser)

router.post('/login', login)

router.put('/:userid', updateUser)

router.delete('/:userid', deleteUser)

module.exports = router
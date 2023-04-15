const express = require('express');
const upload = require('../middlewares/upload')
const {getAllUsers, getUserById, updateUser, deleteUser, registerUser, login, getMe} = require('../controllers/userController')
const protect = require('../middlewares/authMiddleware')
const router = express.Router();

router.get('/', getAllUsers)

router.get('/me', protect, getMe)

router.get('/:userid', getUserById)

router.post('/register', upload.single('image'), registerUser)

router.post('/login', login)

router.put('/:userid', upload.single('avatar'), updateUser)

router.delete('/:userid', deleteUser)

module.exports = router
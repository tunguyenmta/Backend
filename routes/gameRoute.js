const express = require('express');
const upload = require('../middlewares/upload')
const multer = require('multer')
const {getAllGames,
    getGameById,
    updateGame,
    deleteGame,
    createGame,
    ratingGame,
    getGame,
    uploadImgS3,
    getImgS3
} = require('../controllers/gameController');

const storage = multer.memoryStorage()
const uploadS3 = multer({ storage: storage })

const router = express.Router();

router.get('/', getAllGames)

router.get('/game', getGame)

router.get('/:gameid', getGameById)

router.get('/testS3/:key',getImgS3 )

router.post('/rating/:gameid', ratingGame)

// router.post('/creategame', upload.array('gameImage',2),createGame)
router.post('/creategame', uploadS3.array('gameImage',2),createGame)

router.put('/:gameid', upload.single('avatar'), updateGame)

router.post('/testS3', uploadS3.single('testimg'), uploadImgS3)

router.delete('/:gameid', deleteGame)

module.exports = router
const express = require('express');
const upload = require('../middlewares/upload')
const {getAllGames,
    getGameById,
    updateGame,
    deleteGame,
    createGame,
    getGame} = require('../controllers/gameController');
const router = express.Router();

router.get('/', getAllGames)

router.get('/game', getGame)

router.get('/:gameid', getGameById)

router.post('/creategame', upload.array('gameImage',2),createGame)

router.put('/:gameid', upload.single('avatar'), updateGame)

router.delete('/:gameid', deleteGame)

module.exports = router
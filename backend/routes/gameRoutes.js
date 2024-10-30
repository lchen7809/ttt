const express = require('express');
const { createGame, makeMove, getGameState, resetGame, getPastGames } = require('../controllers/gameControllers');

const router = express.Router();

router.post('/create', createGame);

router.post('/move', makeMove);

router.get('/:gameId', getGameState);

router.post('/reset', resetGame);

router.get('/past-games', getPastGames);


module.exports = router;

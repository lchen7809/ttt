const express = require('express');
const { createGame, makeMove, getGameState, resetGame } = require('../controllers/gameController');

const router = express.Router();

router.post('/create', createGame);

router.post('/move', makeMove);

router.get('/:gameId', getGameState);

router.post('/reset', resetGame);

module.exports = router;

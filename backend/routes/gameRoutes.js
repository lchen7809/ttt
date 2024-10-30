const express = require('express');

const router = express.Router();

router.post('/create');

router.post('/move');

router.get('/:gameId');

router.post('/reset');

module.exports = router;

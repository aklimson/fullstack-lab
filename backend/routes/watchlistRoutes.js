const express = require('express');
const router = express.Router();

const {getWatchlist, createWatchlistEntry, updateWatchlistEntry, deleteWatchlistEntry} = require('../controllers/watchlistController');

router.get('/', getWatchlist);
router.post('/', createWatchlistEntry);
router.put('/:id', updateWatchlistEntry);
router.delete('/:id', deleteWatchlistEntry);

module.exports = router;

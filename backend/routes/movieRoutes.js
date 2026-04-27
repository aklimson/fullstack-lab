const express = require('express');
const router = express.Router();

const {getMovies, createMovie, updateMovie} = require('../controllers/movieController');

router.get('/', getMovies);
router.post('/', createMovie);
router.put('/:id', updateMovie);

module.exports = router;

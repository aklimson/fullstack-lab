const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().populate('genreId');
        return res.json(movies);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;

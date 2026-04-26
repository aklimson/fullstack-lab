const express = require('express');
const router = express.Router();

const Genre = require('../models/Genre');

router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find();
        return res.json(genres);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;

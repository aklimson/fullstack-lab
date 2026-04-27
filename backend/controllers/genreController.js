const Genre = require('../models/Genre');

const getGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        return res.json(genres);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

module.exports = {getGenres};

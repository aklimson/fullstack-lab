const Movie = require('../models/Movie');

const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find().populate('genreId');
        return res.json(movies);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

const createMovie = async (req, res) => {
    try {
        const movie = new Movie(req.body);
        const savedMovie = await movie.save();
        return res.status(201).json(savedMovie);
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
};

const updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            {returnDocument: 'after', runValidators: true}
        );

        if (!updatedMovie) {
            return res.status(404).json({error: 'Movie not found'});
        }

        return res.json(updatedMovie);
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
};

module.exports = {getMovies, createMovie, updateMovie};

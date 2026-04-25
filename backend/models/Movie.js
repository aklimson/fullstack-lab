const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
    {
        title: {type: String, required: [true, 'Movie title is required'], trim: true},
        genreId: {type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: [true, 'Genre is required']},
        releaseYear: {type: Number, required: [true, 'Release year is required'], min: [1888, 'Release year must be realistic'], max: [2030, 'Release year cannot be too far in the future']}
    }
);

module.exports = mongoose.model('Movie', movieSchema);

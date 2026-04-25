const mongoose = require('mongoose');

const watchlistEntrySchema = new mongoose.Schema(
    {
        movieId: {type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: [true, 'Movie is required']},
        watched: {type: Boolean, default: false},
        rating: {type: Number, min: [1, 'Rating must be at least 1'], max: [5, 'Rating cannot be more than 5']},
        comment: {type: String, trim: true, maxlength: [300, 'Comment cannot be longer than 300 characters']}
    }
);

module.exports = mongoose.model('WatchlistEntry', watchlistEntrySchema);

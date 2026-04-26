const WatchlistEntry = require('../models/WatchlistEntry');
const Movie = require('../models/Movie');
const Genre = require('../models/Genre');

const getWatchlist = async (req, res) => {
    try {
        const filter = {};

        if (req.query.watched === 'true') {
            filter.watched = true;
        }

        if (req.query.watched === 'false') {
            filter.watched = false;
        }

        const entries = await WatchlistEntry.find(filter).populate({
            path: 'movieId', populate: {path: 'genreId'}
        });

        return res.json(entries);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

const createWatchlistEntry = async (req, res) => {
    try {
        const entry = new WatchlistEntry(req.body);
        const savedEntry = await entry.save();

        return res.status(201).json(savedEntry);
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
};

const updateWatchlistEntry = async (req, res) => {
    try {
        const updatedEntry = await WatchlistEntry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updatedEntry) {
        return res.status(404).json({ error: 'Watchlist entry not found' });
        }

        return res.json(updatedEntry);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const deleteWatchlistEntry = async (req, res) => {
    try {
        const deletedEntry = await WatchlistEntry.findByIdAndDelete(req.params.id);

        if (!deletedEntry) {
            return res.status(404).json({error: 'Watchlist entry not found'});
        }
        return res.json({message: 'Watchlist entry deleted successfully!'});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

module.exports = {getWatchlist, createWatchlistEntry, updateWatchlistEntry, deleteWatchlistEntry};

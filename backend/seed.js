const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const Genre = require('./models/Genre');
const Movie = require('./models/Movie');
const WatchlistEntry = require('./models/WatchlistEntry');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        //Clear existing data
        await WatchlistEntry.deleteMany();
        await Movie.deleteMany();
        await Genre.deleteMany();

        // Genres
        const genres = await Genre.insertMany([
            {name: 'Sci-Fi'},
            {name: 'Action'},
            {name: 'Drama'},
            {name: 'Comedy'},
            {name: 'Fantasy'}
        ]);

        //Movies
        const movies = await Movie.insertMany([
            {title: 'Inception', genreId: genres[0]._id, releaseYear: 2010},
            {title: 'Interstellar', genreId: genres[0]._id, releaseYear: 2014},
            {title: 'The Dark Knight', genreId: genres[1]._id, releaseYear: 2008},
            {title: 'Forrest Gump', genreId: genres[2]._id, releaseYear: 1994},
            {title: 'The Hangover', genreId: genres[3]._id, releaseYear: 2009}
        ]);

        //Watchlist entries for all movies
        const watchlist = [
            {movieId: movies[0]._id, watched: true, rating: 5, comment: 'One of my favourite movies. I loved the story and ending.'},
            {movieId: movies[1]._id, watched: true, rating: 5, comment: 'Emotional and visually amazing. I would watch it again.'},
            {movieId: movies[2]._id, watched: false, comment: 'I want to watch this because many people recommend it.'},
            {movieId: movies[3]._id, watched: false, comment: 'Added to my list because it is a classic movie.'},
            {movieId: movies[4]._id, watched: true, rating: 4, comment: 'Funny movie and easy to rewatch with friends.'}
        ];

        await WatchlistEntry.insertMany(watchlist);

        console.log('Data seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();

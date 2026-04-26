const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const watchlistRoutes = require('./routes/watchlistRoutes');
const movieRoutes = require('./routes/movieRoutes');
const genreRoutes = require('./routes/genreRoutes');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/watchlist', watchlistRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);

app.get('/', (req, res) => {
    return res.json({message: 'Movie Tracker API is running...'});
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

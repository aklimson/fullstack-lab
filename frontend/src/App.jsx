import { useEffect, useState } from 'react';
import './App.css';

import MovieForm from './components/MovieForm';
import MovieTable from './components/MovieTable';

const WATCHLIST_API = 'http://localhost:4000/api/watchlist';
const MOVIES_API = 'http://localhost:4000/api/movies';
const GENRES_API = 'http://localhost:4000/api/genres';

function App() {
  const [entries, setEntries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    genreId: '',
    releaseYear: '',
    watched: false,
    rating: '',
    comment: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    genreId: '',
    releaseYear: '',
    watched: false,
    rating: '',
    comment: '',
  });

  const fetchEntries = async () => {
    try {
      setError('');

      let url = WATCHLIST_API;

      if (filter === 'watched') {
        url += '?watched=true';
      }

      if (filter === 'notWatched') {
        url += '?watched=false';
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error('Failed to fetch watchlist');
      }

      const data = await res.json();
      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetch(GENRES_API);

      if (!res.ok) {
        throw new Error('Failed to fetch genres');
      }

      const data = await res.json();
      setGenres(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetNewMovie = () => {
    setNewMovie({
      title: '',
      genreId: '',
      releaseYear: '',
      watched: false,
      rating: '',
      comment: '',
    });
  };

  const createMovie = async (e) => {
    e.preventDefault();

    try {
      setError('');

      if (!newMovie.title || !newMovie.genreId || !newMovie.releaseYear) {
        setError('Title, genre and release year are required');
        return;
      }

      const movieRes = await fetch(MOVIES_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newMovie.title,
          genreId: newMovie.genreId,
          releaseYear: Number(newMovie.releaseYear),
        }),
      });

      if (!movieRes.ok) {
        throw new Error('Failed to create movie');
      }

      const createdMovie = await movieRes.json();

      const entryRes = await fetch(WATCHLIST_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: createdMovie._id,
          watched: newMovie.watched,
          rating: newMovie.rating ? Number(newMovie.rating) : undefined,
          comment: newMovie.comment,
        }),
      });

      if (!entryRes.ok) {
        throw new Error('Failed to create watchlist entry');
      }

      resetNewMovie();
      setShowAddForm(false);
      fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry._id);
    setEditData({
      title: entry.movieId.title,
      genreId: entry.movieId.genreId._id,
      releaseYear: entry.movieId.releaseYear,
      watched: entry.watched,
      rating: entry.rating || '',
      comment: entry.comment || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      title: '',
      genreId: '',
      releaseYear: '',
      watched: false,
      rating: '',
      comment: '',
    });
  };

  const saveEdit = async (entry) => {
    try {
      setError('');

      if (!editData.title || !editData.genreId || !editData.releaseYear) {
        setError('Title, genre and release year are required');
        return;
      }

      const movieRes = await fetch(`${MOVIES_API}/${entry.movieId._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editData.title,
          genreId: editData.genreId,
          releaseYear: Number(editData.releaseYear),
        }),
      });

      if (!movieRes.ok) {
        throw new Error('Failed to update movie');
      }

      const entryRes = await fetch(`${WATCHLIST_API}/${entry._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          watched: editData.watched,
          rating: editData.rating ? Number(editData.rating) : undefined,
          comment: editData.comment,
        }),
      });

      if (!entryRes.ok) {
        throw new Error('Failed to update watchlist entry');
      }

      cancelEdit();
      fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateWatched = async (id, currentWatched) => {
    try {
      const res = await fetch(`${WATCHLIST_API}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ watched: !currentWatched }),
      });

      if (!res.ok) {
        throw new Error('Failed to update movie');
      }

      fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteEntry = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this movie?');

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`${WATCHLIST_API}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete movie');
      }

      fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchEntries();

    const interval = setInterval(fetchEntries, 6000);

    return () => clearInterval(interval);
  }, [filter]);

  return (
    <div className="container">
      <h1>Personal Movie Tracker</h1>

      {showAddForm && (
        <MovieForm
          genres={genres}
          newMovie={newMovie}
          setNewMovie={setNewMovie}
          createMovie={createMovie}
        />
      )}

      <div className="top-bar">
        <button
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Close' : '+ Add Movie'}
        </button>

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All movies</option>
          <option value="watched">Watched</option>
          <option value="notWatched">Not watched</option>
        </select>
      </div>

      {loading && <p>Loading movies...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <MovieTable
          entries={entries}
          genres={genres}
          editingId={editingId}
          editData={editData}
          setEditData={setEditData}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          updateWatched={updateWatched}
          deleteEntry={deleteEntry}
        />
      )}
    </div>
  );
}

export default App;

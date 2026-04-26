import { useEffect, useState } from 'react';
import './App.css';

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

      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Close Add Form' : 'Add Movie'}
      </button>

      {showAddForm && (
        <form className="form" onSubmit={createMovie}>
          <h2>Add Movie</h2>

          <input
            type="text"
            placeholder="Movie title"
            value={newMovie.title}
            onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
          />

          <select
            value={newMovie.genreId}
            onChange={(e) => setNewMovie({ ...newMovie, genreId: e.target.value })}
          >
            <option value="">Select genre</option>
            {genres.map((genre) => (
              <option key={genre._id} value={genre._id}>
                {genre.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Release year"
            value={newMovie.releaseYear}
            onChange={(e) =>
              setNewMovie({ ...newMovie, releaseYear: e.target.value })
            }
          />

          <label>
            Watched
            <input
              type="checkbox"
              checked={newMovie.watched}
              onChange={(e) =>
                setNewMovie({ ...newMovie, watched: e.target.checked })
              }
            />
          </label>

          <input
            type="number"
            min="1"
            max="5"
            placeholder="Rating"
            value={newMovie.rating}
            onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
          />

          <input
            type="text"
            placeholder="Comment"
            value={newMovie.comment}
            onChange={(e) =>
              setNewMovie({ ...newMovie, comment: e.target.value })
            }
          />

          <button type="submit">Save</button>
        </form>
      )}

      <div className="controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All movies</option>
          <option value="watched">Watched</option>
          <option value="notWatched">Not watched</option>
        </select>
      </div>

      {loading && <p>Loading movies...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Watched</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Year</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                {editingId === entry._id ? (
                  <>
                    <td>
                      <input
                        type="checkbox"
                        checked={editData.watched}
                        onChange={(e) =>
                          setEditData({ ...editData, watched: e.target.checked })
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                      />
                    </td>

                    <td>
                      <select
                        value={editData.genreId}
                        onChange={(e) =>
                          setEditData({ ...editData, genreId: e.target.value })
                        }
                      >
                        {genres.map((genre) => (
                          <option key={genre._id} value={genre._id}>
                            {genre.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <input
                        type="number"
                        value={editData.releaseYear}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            releaseYear: e.target.value,
                          })
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={editData.rating}
                        onChange={(e) =>
                          setEditData({ ...editData, rating: e.target.value })
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={editData.comment}
                        onChange={(e) =>
                          setEditData({ ...editData, comment: e.target.value })
                        }
                      />
                    </td>

                    <td>
                      <button onClick={() => saveEdit(entry)}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <input
                        type="checkbox"
                        checked={entry.watched}
                        onChange={() => updateWatched(entry._id, entry.watched)}
                      />
                    </td>
                    <td>{entry.movieId.title}</td>
                    <td>{entry.movieId.genreId.name}</td>
                    <td>{entry.movieId.releaseYear}</td>
                    <td>{entry.rating ? `${entry.rating}/5` : '-'}</td>
                    <td>{entry.comment || '-'}</td>
                    <td>
                      <button onClick={() => startEdit(entry)}>Edit</button>
                      <button onClick={() => deleteEntry(entry._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

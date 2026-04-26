import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:4000/api/watchlist';

function App() {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEntries = async () => {
    try {
      setError('');

      let url = API_URL;

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

  const updateWatched = async (id, currentWatched) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
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
      const res = await fetch(`${API_URL}/${id}`, {
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
    fetchEntries();

    const interval = setInterval(fetchEntries, 6000);

    return () => clearInterval(interval);
  }, [filter]);

  return (
    <div className="container">
      <h1>Personal Movie Tracker</h1>

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
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
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
                  <button onClick={() => deleteEntry(entry._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

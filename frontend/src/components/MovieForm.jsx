function MovieForm({ genres, newMovie, setNewMovie, createMovie }) {
  return (
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
        onChange={(e) => setNewMovie({ ...newMovie, comment: e.target.value })}
      />

      <label className="watched-label">
        Watched
        <input
          type="checkbox"
          checked={newMovie.watched}
          onChange={(e) =>
            setNewMovie({ ...newMovie, watched: e.target.checked })
          }
        />
      </label>

      <div className="form-button">
        <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default MovieForm;

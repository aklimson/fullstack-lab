function MovieRow({
  entry,
  genres,
  editingId,
  editData,
  setEditData,
  startEdit,
  cancelEdit,
  saveEdit,
  updateWatched,
  deleteEntry,
}) {
  return (
    <tr>
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
                setEditData({ ...editData, releaseYear: e.target.value })
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
  );
}

export default MovieRow;

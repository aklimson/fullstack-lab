import MovieRow from './MovieRow';

function MovieTable({
  entries,
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
          <MovieRow
            key={entry._id}
            entry={entry}
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
        ))}
      </tbody>
    </table>
  );
}

export default MovieTable;

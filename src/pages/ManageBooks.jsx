import { useState, useEffect } from "react";
import BookForm from "./BookForm.jsx";

function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  async function loadBooks() {
    try {
      const response = await fetch("http://localhost:8080/books");

      if (!response.ok) {
        throw new Error("Failed to load books");
      }

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Loading books failed:", error);
    }
  }

  async function deleteBook(id) {
    try {
      const response = await fetch(`http://localhost:8080/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete book: ${response.status}`);
      }

      if (editingBook?.id === id) {
        setEditingBook(null);
      }

      await loadBooks();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <main>
      <h1>Manage Books</h1>
      <p className="page-description">
        Add new books or update existing books.
      </p>

      {/* Keep ONE form here, above the table */}
      <section className="panel">
        <BookForm
          book={editingBook}
          onSaved={async () => {
            setEditingBook(null);
            await loadBooks();
          }}
          onCancelEdit={() => setEditingBook(null)}
        />
      </section>

      <section className="panel">
        <h2>Current Books</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.price}</td>
                  <td>
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => setEditingBook(book)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => deleteBook(book.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default ManageBooks;

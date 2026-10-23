import { useState, useEffect } from "react";

function BookForm({ book, onSaved, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = book != null;

  useEffect(() => {
    if (book) {
      setTitle(book.title ?? "");
      setAuthor(book.author ?? "");
      setPrice(String(book.price ?? ""));
    } else {
      setTitle("");
      setAuthor("");
      setPrice("");
    }

    setError("");
  }, [book]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      price: Number(price),
    };

    try {
      const url = isEditing
        ? `http://localhost:8080/books/${book.id}`
        : "http://localhost:8080/books";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          `Failed to ${isEditing ? "update" : "add"} book: ${response.status} ${message}`,
        );
      }

      setTitle("");
      setAuthor("");
      setPrice("");

      await onSaved();
    } catch (error) {
      console.error("Save failed:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setTitle("");
    setAuthor("");
    setPrice("");
    setError("");

    if (onCancelEdit) {
      onCancelEdit();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? "Edit Book" : "Add New Book"}</h2>

      <div className="form-field">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>
      </div>

      <div className="form-field">
        <label>
          Author
          <input
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            required
          />
        </label>
      </div>

      <div className="form-field">
        <label>
          Price
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </label>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="form-actions">
        <button
          type="submit"
          className="button button-primary"
          disabled={saving}
        >
          {saving ? "Saving..." : isEditing ? "Update Book" : "Add Book"}
        </button>

        {isEditing && (
          <button
            type="button"
            className="button button-secondary"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

export default BookForm;

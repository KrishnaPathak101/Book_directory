const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = 3000;
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define book schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
});

const Book = mongoose.model('Book', bookSchema);

app.use(bodyParser.json());

// GET all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new book
app.post('/books', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a book
app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book == null) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (req.body.title != null) {
      book.title = req.body.title;
    }

    if (req.body.author != null) {
      book.author = req.body.author;
    }

    if (req.body.genre != null) {
      book.genre = req.body.genre;
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a book
app.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

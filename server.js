// Importing modules
require('dotenv').config({path: './.env'});
const express = require('express');
const cors =  require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Connecting to MongoDB
mongoose.connect(process.env.DATABASE_LOCAL, { useNewUrlParser: true });
mongoose.set("strictQuery", true);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Creating schema
const quoteSchema = mongoose.Schema({
  content: String,
  author: String
});

// Creating model
const Quotes = mongoose.model("quotes", quoteSchema);


// Server requests
app.get('/', (req, res) => {
  Quotes.find().then(quote => {
    res.send(quote);
  });
});

app.post('/', (req, res) => {
  const quote = {
    content: req.body.content,
    author: req.body.author
  };
  const newQuote = new Quotes(quote);

  newQuote.save();
});

// Server listening
app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}...`));
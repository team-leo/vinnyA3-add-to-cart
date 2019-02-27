const mongoose = require('mongoose');
const db = require('./index.js');

const reviewSchema = new mongoose.Schema({
  /* TODO: Translate from SQL to MongoDB
  ======================================
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reviewCount NOT NULL,
  stars INTEGER DEFAULT 0
  */
}, 
  {
    timestamps: true
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
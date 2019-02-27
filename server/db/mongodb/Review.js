const mongoose = require('mongoose');
const db = require('./index.js');

const reviewSchema = new mongoose.Schema({
  // TODO: Fill schema
}, 
  {
    timestamps: true
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
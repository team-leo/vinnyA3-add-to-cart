const mongoose = require('mongoose');
const db = require('./index.js');

const reviewSchema = new mongoose.Schema({
  reviewCount: {type: Number, default: 0},
  stars: {type: Number, default: 0}
  }, 
  {
    timestamps: true
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports  = { Review };
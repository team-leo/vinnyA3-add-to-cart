const mongoose = require('mongoose');
const db = require('./index.js');

const productSchema = new mongoose.Schema({
  // TODO: Fill schema
},
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
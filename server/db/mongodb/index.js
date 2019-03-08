const mongoose = require('mongoose');
const config = require('../../config/secret');
// const mongoUri = `mongodb://${config.URI_LOCALHOST}`;
const mongoUri = `mongodb://${config.URI_AWS}`;

const db = mongoose.connect(mongoUri, { useNewUrlParser: true });

module.exports = db;
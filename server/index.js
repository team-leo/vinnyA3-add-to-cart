const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const PORT = process.env.PORT || 3000;
const app = express();
const cors = require('cors');

// MIDDLEWARE
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

// ROUTES
app.use('/api', require('./routes/api'));
app.get('/bundle', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../dist/bundle.js'))
);
// Verify domain ownership for Loader.io
app.get('/loaderio-8f9df7f5497dc81278a8b93c8fb4f3ea', (req, res) => 
  res.sendFile(path.resolve(__dirname, '../dist/loaderio-8f9df7f5497dc81278a8b93c8fb4f3ea.txt'))
);

app.listen(PORT, () => (console.log(`Listening on port ${PORT}`), void 0));

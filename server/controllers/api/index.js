const axios = require('axios');
const genRandomInt = require('utils/genRandInt');
// const db = require('db/connection');
const db = require('../../db/mongodb');
const { API_KEY } = require('config/secret');
const { Product } = require('../../db/mongodb/Product');
const { Review } = require('../../db/mongodb/Review');
const { ObjectID } = require('mongodb');


module.exports = {
  getGeolocation: (req, res) => {
    const { long, lat } = req.query;
    if (!long || !lat) {
      return res.send({
        message: 'Ooop! You need to send longitude and latitude',
        status: 400,
      });
    } else {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${API_KEY}`
        )
        .then(({ data }) =>
          res.send({
            message: 'okay',
            results: data.results[0].formatted_address,
          })
        )
        .catch(err =>
          res.status(500).send({ message: 'something went wrong' })
        );
    }
  },

  getProductInfo: (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.send({
        message: 'Please supply an ID!',
        status: 400,
      });
    }

    Product.find({_id: ObjectID(id)})
      .then((rows) => {
        // TODO: Replace hardcoded ID with URL parameter 
        Review.find({_id: ObjectID('5c7f1872fef7b21a3c7423f2')})
          .then((rRows) => {
            res.send({
              rows,
              rRows,
              status: 200
            });
          })
          .catch((err) => {
            return res.send({
              message: 'Oops, something went wrong!!',
              status: 500
            });
          });
      });
    }
};

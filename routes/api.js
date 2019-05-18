'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
const Like = require('../model/Like');
const API = symbol => `https://api.iextrading.com/1.0/stock/${symbol}/price`;
const axios = require('axios');

// Basic Config
require('dotenv').config({ path: 'process.env' });

const env = process.env.NODE_ENV || 'production';
if (env === 'development') {
  process.env.MONGODB_URI = process.env.MONGODB_LOCAL;
} else if (env === 'production') {
  process.env.MONGODB_URI = `mongodb+srv://afsal:${
    process.env.PASSWORD
  }@stock-price-checker-o1ucy.mongodb.net/test?retryWrites=true`;
}

// Connecting to MONGODB
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true }, () =>
    console.log('connected on mongodb server')
  )
  .catch(err => console.log(err));

module.exports = function(app) {
  app.route('/api/single-stock').post(async function(req, res) {
    let { symbol, like } = req.body;
    let IP = req.ip;
    let stockPrice = await axios
      .get(API(symbol))
      .then(res => res.data)
      .catch(err => null);
    // Check if stockPrice is available
    if (!stockPrice) {
      return res.json({ msg: 'Not a valid symbol' });
    } else {
      let stock = await Like.findOne({ symbol: symbol })
        .then(symbol => symbol)
        .catch(err => null);
      // if stock already exists
      if (stock) {
        try {
          Like.findOneAndUpdate(
            { symbol: symbol },
            {
              $inc: { likes: like ? 1 : 0 },
              $push: { IPs: IP }
            },
            { upsert: true, new: true }
          ).then(stock => {
            if (stock) {
              return res.status(200).json({
                Price: stockPrice,
                Symbol: symbol.toUpperCase(),
                Likes: stock.likes
              });
            }
            res.status(200).json({ msg: 'error' });
          });
        } catch (error) {
          res.status(401).json({ msg: 'err' });
        }
      } else {
        let newLike = new Like({
          symbol,
          likes: like ? 1 : 0,
          IPs: IP
        });
        newLike.save();
        return res.json({
          Price: stockPrice,
          Symbol: symbol.toUpperCase(),
          Likes: like ? 1 : 0
        });
      }
    }
  });

  app.route('/api/compare-stock').post(function(req, res) {
    res.status(200).json({ msg: 'Comparing Stocks' });
  });
};

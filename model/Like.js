const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true
  },
  IPs: [String]
});

module.exports = mongoose.model('Like', LikeSchema);

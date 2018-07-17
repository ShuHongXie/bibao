'use strict';
// bcrypt
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TokenlistSchema = new Schema({
    id: { type: Number },
    symbol: { type: String },
    date: { type: Array },
    price: { type: Array },
    volume: { type: Array },
  });
  return mongoose.model('Tokenlist', TokenlistSchema);
};

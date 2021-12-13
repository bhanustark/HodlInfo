const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  base_unit: String,
  quote_unit: String,
  low: String,
  high: String,
  last: String,
  type: String,
  open: Number,
  volume: String,
  sell: String,
  buy: String,
  at: Number,
  name: String
})

module.exports = mongoose.model("Result", resultSchema);

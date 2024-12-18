const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  erc20: {
    type: String,
    required: true,
  },
  bitcoin: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Wallet', walletSchema);

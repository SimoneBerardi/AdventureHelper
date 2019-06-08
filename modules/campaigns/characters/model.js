const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  playerName: {
    type: String,
    required: true,
  },
  background: String,
  publicBackground: String,
  imageUrl: String,
  shareToken: String,
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
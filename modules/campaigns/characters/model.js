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
  shareToken: {
    value: String,
    created: Date,
  }
});

characterSchema.methods.filterPublicContent = function () {
  this.background = null;
  this.shareToken = null;
}

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
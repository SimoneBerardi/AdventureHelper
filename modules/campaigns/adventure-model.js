const mongoose = require('mongoose');

const adventureSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  levelRange: String,
});

const Adventure = mongoose.model('Adventure', adventureSchema);

module.exports = Adventure;
const mongoose = require('mongoose');

const npcsSchema = new mongoose.Schema({
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
  info: String,
  publicInfo: String,
  status: {
    type: String,
    enum: ['created', 'shared', 'unshared'],
    default: 'created',
  },
  imageUrl: String,
});

npcsSchema.methods.filterPublicContent = function () {
  this.info = null;
}

const Npc = mongoose.model('Npc', npcsSchema);

module.exports = Npc;
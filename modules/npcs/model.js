const mongoose = require('mongoose');

const npcSchema = new mongoose.Schema({
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

npcSchema.methods.filterPublicContent = function () {
  this.info = null;
}

const Npc = mongoose.model('Npc', npcSchema);

module.exports = Npc;
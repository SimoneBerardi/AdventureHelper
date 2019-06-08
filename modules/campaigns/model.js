const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
});

campaignSchema.pre('remove', function (next) {
  this.model('Adventure').deleteMany({ campaign: this._id }, next);
  this.model('Character').deleteMany({ campaign: this._id }, next);
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
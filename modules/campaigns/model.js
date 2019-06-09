const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
});

campaignSchema.pre('remove', function (next) {
  var self = this;
  self.model('Adventure').deleteMany({ campaign: self._id }, function () {
    self.model('Character').deleteMany({ campaign: self._id }, next);
  });
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
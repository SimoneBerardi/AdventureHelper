import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: String,
  description: String,
});

campaignSchema.pre('remove', function(next){
  this.model('Adventure').deleteMany({campaign: this._id}, next);
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
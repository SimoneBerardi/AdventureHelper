import mongoose from 'mongoose';

const adventureSchema = new mongoose.Schema({
  campaign: {type: mongoose.Schema.Types.ObjectId, ref: 'Campaign'},
  name: String,
  description: String,
  levelRange: String,
});

const Adventure = mongoose.model('Adventure', adventureSchema);

export default Adventure;
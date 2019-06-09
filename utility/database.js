const mongoose = require('mongoose');

const User = require('../modules/users/model');
const Campaign = require('../modules/campaigns/model');
const Adventure = require('../modules/campaigns/adventures/model');
const Character = require('../modules/campaigns/characters/model');

const connectDb = () => {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  return mongoose.connect(process.env.DATABASE_URL);
};

const models = { User, Campaign, Adventure, Character };

exports.connectDb = connectDb;
exports.models = models;
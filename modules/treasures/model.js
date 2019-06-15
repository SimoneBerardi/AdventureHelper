const mongoose = require('mongoose');

const TreasureTableSchema = new mongoose.Schema({
  diceFrom: Number,
  diceTo: Number,
  filter: String,
  quantity: String,
  value: String,
  tableReference: String,
  tableFilter: String,
  tableDice: String,
});

TreasureTableSchema.statics.getByDice = function (diceValue, filter) {
  var findClause = {};
  if (filter)
    findClause.filter = filter;
  return this.find(findClause)
    .where('diceFrom').lte(diceValue)
    .where('diceTo').gte(diceValue);
}

const TreasureChallenge = mongoose.model('TreasureChallenge', TreasureTableSchema);
const TreasureValuable = mongoose.model('TreasureValuable', TreasureTableSchema);
const TreasureMagicItem = mongoose.model('TreasureMagicItem', TreasureTableSchema);
const TreasureCommon = mongoose.model('TreasureCommon', TreasureTableSchema);

module.exports = {
  TreasureChallenge,
  TreasureValuable,
  TreasureMagicItem,
  TreasureCommon,
};
const generate = async (req, challenge) => {
  var challengeFilter;
  if (challenge <= 4) {
    challengeFilter = "Challenge 0-4";
  }
  else if (challenge <= 10) {
    challengeFilter = "Challenge 5-10";
  }
  else if (challenge <= 16) {
    challengeFilter = "Challenge 11-16";
  } else {
    challengeFilter = "Challenge 17+";
  }
  var diceRoll = _rollDice(100);
  return await _getTableItems(req, "Challenge", challengeFilter, diceRoll);
}

const _rollDice = function (value) {
  var low = 1;
  var high = value;
  return Math.floor(Math.random() * (high - low + 1) + low);
}

const _getTableItems = async (req, tableName, filter, diceRoll) => {
  var result = [];
  tableName = "Treasure" + tableName;
  var items = await req.context.models[tableName].getByDice(diceRoll, filter);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.tableReference !== "") {
      var quantity = item.quantity !== "" ? _calculateQuantity(item.quantity) : 1;
      for (let j = 0; j < quantity; j++) {
        var diceType = item.tableDice.split("d")[1];
        var subDiceRoll = _rollDice(diceType);
        var subItems = await _getTableItems(req, item.tableReference, item.tableFilter, subDiceRoll);
        result = result.concat(subItems);
      }
    } else {
      result.push(_generateItemDescription(item));
    }
  }
  return result;
}

const _generateItemDescription = function (item) {
  var result = item.value;
  if (item.quantity !== "")
    result = _calculateQuantity(item.quantity).toString() + " " + result;
  return result;
}

const _calculateQuantity = function (quantity) {
  var diceNumber = quantity.split("d")[0];
  var diceType = quantity.split("d")[1].split("X")[0];
  var multiplier = quantity.indexOf("X") >= 0 ? quantity.split("X")[1] : 1;
  var result = 0;
  for (let i = 0; i < diceNumber; i++) {
    result += _rollDice(diceType);
  }
  result * multiplier;
  return result;
}

module.exports = { generate }
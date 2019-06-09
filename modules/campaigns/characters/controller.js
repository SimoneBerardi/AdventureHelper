const auth = require('../../../utility/authentication');

const getAll = async (req, res) => {
  try {
    const characters = await req.context.models.Character.find({
      campaign: req.params.campaignId,
    });
    if (!auth.isMaster(req)) {
      characters.forEach(character => {
        character.filterPublicContent();
      });
    }
    return res.send(characters);
  } catch (err) {
    return res.status(500).send();
  }
};

const add = async (req, res) => {
  try {
    var character = await req.context.models.Character.create(req.body);
    return res.send(character);
  } catch (err) {
    return res.status(500).send();
  }
};

const getById = async (req, res) => {
  try {
    if (!auth.isMaster(req) && !auth.isCharacterOwner(req, req.params.id))
      return res.status(403).send();

    const character = await req.context.models.Character.find({
      _id: req.params.id,
      campaign: req.params.campaignId,
    });

    if (character.length == 0)
      return res.status(404).send();

    return res.send(character);
  } catch (err) {
    return res.status(500).send();
  }
};

const modify = async (req, res) => {
  try {
    if (!auth.isMaster(req) && !auth.isCharacterOwner(req, req.params.id))
      return res.status(403).send();

    const character = await req.context.models.Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (character == null)
      return res.status(404).send();

    return res.send(character);
  } catch (err) {
    return res.status(500).send();
  }
};

const remove = async (req, res) => {
  try {
    const character = await req.context.models.Character.findByIdAndRemove(
      req.params.id,
    );

    if (character == null)
      return res.status(404).send();

    return res.send();
  } catch (err) {
    return res.status(500).send();
  }
};

module.exports = {
  getAll: getAll,
  add: add,
  getById: getById,
  modify: modify,
  remove: remove,
};
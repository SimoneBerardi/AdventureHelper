const auth = require('../../utility/authentication');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const getAll = async (req, res) => {
  try {
    const characters = await req.context.models.Character.find({
      campaign: req.params.campaignId,
    });
    if (!req.context.user.isCampaignMaster)
      characters.forEach(character => {
        character.filterPublicContent();
      });
    return res.send(characters);
  } catch (err) {
    return res.status(500).send();
  }
};

const add = async (req, res) => {
  try {
    req.body.campaign = req.params.campaignId;
    var character = await req.context.models.Character.create(req.body);
    return res.send(character);
  } catch (err) {
    return res.status(500).send();
  }
};

const getById = async (req, res) => {
  try {
    const character = await req.context.models.Character.find({
      _id: req.params.id,
      campaign: req.params.campaignId,
    });

    if (character.length == 0)
      return res.status(404).send();

    if (!req.context.user.isCampaignMaster)
      character.filterPublicContent();

    return res.send(character);
  } catch (err) {
    return res.status(500).send();
  }
};

const modify = async (req, res) => {
  try {
    if (!req.context.user.isCampaignMaster && !_isCharacterOwner(req, req.params.id))
      return res.status(403).send();

    req.body._id = req.params.id;
    await _saveBase64Image(req.body);
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

const _isCharacterOwner = function(req, characterId){
  return req.context.user.character !== characterId;
}

const _saveBase64Image = async (character) => {
  if (!character.image)
    return;

  var base64Data = character.image.replace(/^data:image\/png;base64,/, "");
  var imagePath = path.join(process.env.RESOURCES_PATH, 'characters');
  await promisify(fs.mkdir)(imagePath, { recursive: true });
  var imageName = character._id + '.png';
  var imagePath = path.join(imagePath, imageName);
  await promisify(fs.writeFile)(imagePath, base64Data, 'base64');

  character.imageUrl = '/resources/characters/' + imageName;
  delete character.image;
}

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
const auth = require('../../utility/authentication');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const getAll = async (req, res) => {
  try {
    const npcs = await req.context.models.Npc.find({
      campaign: req.params.campaignId,
    });
    if (!req.context.user.isCampaignMaster) {
      npcs.forEach(npc => {
        npc.filterPublicContent();
      });
    }
    return res.send(npcs);
  } catch (err) {
    return res.status(500).send();
  }
};

const add = async (req, res) => {
  try {
    req.body.campaign = req.params.campaignId;
    req.body.status = "created";
    var npc = await req.context.models.Npc.create(req.body);
    return res.send(npc);
  } catch (err) {
    return res.status(500).send();
  }
};

const getById = async (req, res) => {
  try {
    const npc = await req.context.models.Npc.find({
      _id: req.params.id,
      campaign: req.params.campaignId,
    });

    if (npc.length == 0)
      return res.status(404).send();

    if (!req.context.user.isCampaignMaster)
      npc.filterPublicContent();

    return res.send(npc);
  } catch (err) {
    return res.status(500).send();
  }
};

const modify = async (req, res) => {
  try {
    req.body._id = req.params.id;
    await _saveBase64Image(req.body);
    const npc = await req.context.models.Npc.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (npc == null)
      return res.status(404).send();

    return res.send(npc);
  } catch (err) {
    return res.status(500).send();
  }
};

const _saveBase64Image = async (npc) => {
  if (!npc.image)
    return;

  var base64Data = npc.image.replace(/^data:image\/png;base64,/, "");
  var imagePath = path.join(process.env.RESOURCES_PATH, 'npcs');
  await promisify(fs.mkdir)(imagePath, { recursive: true });
  var imageName = npc._id + '.png';
  var imagePath = path.join(imagePath, imageName);
  await promisify(fs.writeFile)(imagePath, base64Data, 'base64');

  npc.imageUrl = '/resources/npcs/' + imageName;
  delete npc.image;
}

const remove = async (req, res) => {
  try {
    const npc = await req.context.models.Npc.findByIdAndRemove(
      req.params.id,
    );

    if (npc == null)
      return res.status(404).send();

    return res.send();
  } catch (err) {
    return res.status(500).send();
  }
};

const share = async (req, res) => {
  return _changeStatus(req, res, "shared");
}

const _changeStatus = async (req, res, status) => {
  try {
    const npc = await req.context.models.Npc.find({
      _id: req.params.id,
      campaign: req.params.campaignId,
    });

    if (npc.length == 0)
      return res.status(404).send();

    npc.status = status;

    return res.send();
  } catch (err) {
    return res.status(500).send();
  }
}

const unshare = async (req, res) => {
  return _changeStatus(req, res, "unshared");
}

module.exports = {
  getAll: getAll,
  add: add,
  getById: getById,
  modify: modify,
  remove: remove,
  share: share,
  unshare: unshare,
};
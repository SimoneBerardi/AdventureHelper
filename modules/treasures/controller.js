const auth = require('../../utility/authentication');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const generator = require('./generator');

const getAll = async (req, res) => {
  try {
    var npcs = await req.context.models.Npc.find({
      campaign: req.params.campaignId,
    });
    if (!req.context.user.isCampaignMaster) {
      npcs = npcs.filter((npc) => {
        return npc.status === "shared";
      });
      npcs.forEach(npc => {
        npc.filterPublicContent();
      });
    }
    return res.send(npcs);
  } catch (err) {
    return res.status(500).send();
  }
};

const generate = async (req, res) => {
  try {
    var items = await generator.generate(req, 3);
    return res.send();
  } catch (err) {
    return res.status(500).send();
  }
};

const getById = async (req, res) => {
  try {
    const npc = await req.context.models.Npc.findOne({
      _id: req.params.id,
      campaign: req.params.campaignId,
    });

    if (npc == null)
      return res.status(404).send();

    if (!req.context.user.isCampaignMaster)
      if (npc.status !== "shared")
        return res.status(403).send();
      else
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
    const npc = await req.context.models.Npc.findOne({
      _id: req.params.id,
      campaign: req.params.campaignId,
    });

    if (npc == null)
      return res.status(404).send();

    npc.status = status;
    await npc.save();

    return res.send();
  } catch (err) {
    return res.status(500).send();
  }
}

const distribute = async (req, res) => {
  return _changeStatus(req, res, "distributed");
}

module.exports = {
  getAll: getAll,
  generate: generate,
  getById: getById,
  modify: modify,
  remove: remove,
  share: share,
  distribute: distribute,
};
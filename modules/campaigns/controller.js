const shortid = require('shortid');

const getAll = async (req, res) => {
  try {
    const campaigns = await req.context.models.Campaign.find({
      user: req.context.user._id,
    });
    return res.send(campaigns);
  } catch (err) {
    return res.status(500).send();
  }
};

const add = async (req, res) => {
  try {
    const campaign = await req.context.models.Campaign.create(req.body);
    return res.send(campaign);
  } catch (err) {
    return res.status(500).send();
  }
};

const getById = async (req, res) => {
  try {
    const campaign = await req.context.models.Campaign.findById(
      req.params.id,
    );

    if (campaign.length == 0)
      return res.status(404).send();

    return res.send(campaign);
  } catch (err) {
    return res.status(500).send();
  }
};

const modify = async (req, res) => {
  try {
    const campaign = await req.context.models.Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (campaign == null)
      return res.status(404).send();

    return res.send(campaign);
  } catch (err) {
    return res.status(500).send();
  }
};

const remove = async (req, res) => {
  try {
    const campaign = await req.context.models.Campaign.findById(
      req.params.id,
    );

    if (campaign == null)
      return res.status(404).send();

    campaign.remove();

    return res.send();
  } catch (err) {
    return res.status(500).send();
  }
};

const share = async (req, res) => {
  try {
    const characters = await req.context.models.Character.find({
      campaign: req.params.id,
    });

    for (let i = 0; i < characters.length; i++) {
      const character = characters[i];
      character.shareToken.value = shortid.generate();
      character.shareToken.created = Date.now();
      await character.save();
    }
    
    return res.send();
  } catch (err) {
    return res.status(500), send();
  }
};

module.exports = {
  getAll: getAll,
  add: add,
  getById: getById,
  modify: modify,
  remove: remove,
  share: share,
};
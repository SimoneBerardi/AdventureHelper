const generator = require('./generator');

const getAll = async (req, res) => {
  try {
    var treasures = await req.context.models.Treasure.find({
      campaign: req.params.campaignId,
    });
    if (!req.context.user.isCampaignMaster) {
      treasures = treasures.filter((treasure) => {
        return treasure.status === "shared" || treasure.status === "distributed";
      });
    }
    return res.send(treasures);
  } catch (err) {
    return res.status(500).send();
  }
};

const generate = async (req, res) => {
  try {
    var items = await generator.generate(req, 3);
    req.body.campaign = req.params.campaignId;
    req.body.items = items;
    req.body.status = "created";
    var treasure = await req.context.models.Treasure.create(req.body);
    return res.send(treasure);
  } catch (err) {
    return res.status(500).send();
  }
};

const getById = async (req, res) => {
  try {
    const treasure = await req.context.models.Treasure.findOne({
      _id: req.params.id,
      campaign: req.params.campaignId,
    });

    if (treasure == null)
      return res.status(404).send();

    if (!req.context.user.isCampaignMaster)
      if (treasure.status !== "shared")
        return res.status(403).send();
      else
        treasure.filterPublicContent();

    return res.send(treasure);
  } catch (err) {
    return res.status(500).send();
  }
};

const remove = async (req, res) => {
  try {
    const treasure = await req.context.models.Treasure.findByIdAndRemove(
      req.params.id,
    );

    if (treasure == null)
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
    const treasure = await req.context.models.Treasure.findOne({
      _id: req.params.id,
      campaign: req.params.campaignId,
    });

    if (treasure == null)
      return res.status(404).send();

    treasure.status = status;
    await treasure.save();

    return res.send();
  } catch (err) {
    return res.status(500).send();
  }
}

const distribute = async (req, res) => {
  return _changeStatus(req, res, "distributed");
}

module.exports = {
  getAll,
  generate,
  getById,
  remove,
  share,
  distribute,
};
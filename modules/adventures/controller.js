
const getAll = async (req, res) => {
  try {
    const adventures = await req.context.models.Adventure.find({
      campaign: req.params.campaignId,
    });
    return res.send(adventures);
  } catch (err) {
    return res.status(500).send();
  }
};

const add = async (req, res) => {
  try {
    req.body.campaign = req.params.campaignId;
    var adventure = await req.context.models.Adventure.create(req.body);
    return res.send(adventure);
  } catch (err) {
    return res.status(500).send();
  }
};

const getById = async (req, res) => {
  try {
    const adventure = await req.context.models.Adventure.findOne({
      _id: req.params.id,
      campaign: req.params.campaignId,
    });

    if (adventure == null)
      return res.status(404).send();

    return res.send(adventure);
  } catch (err) {
    return res.status(500).send();
  }
};

const modify = async (req, res) => {
  try {
    req.body._id = req.params.id;
    const adventure = await req.context.models.Adventure.findOneAndUpdate(
      {
        _id: req.params.id,
        campaign: req.params.campaignId,
      },
      req.body,
      { new: true }
    );

    if (adventure == null)
      return res.status(404).send();

    return res.send(adventure);
  } catch (err) {
    return res.status(500).send();
  }
};

const remove = async (req, res) => {
  try {
    const adventure = await req.context.models.Adventure.findOneAndRemove({
      _id: req.params.id,
      campaign: req.params.campaignId,
    });

    if (adventure == null)
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
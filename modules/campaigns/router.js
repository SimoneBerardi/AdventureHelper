var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
  try {
    const campaigns = await req.context.models.Campaign.find();
    return res.send(campaigns);
  } catch (err) {
    return res.status(500).send();
  }
});

router.post('/', async (req, res) => {
  try {
    var campaign = await req.context.models.Campaign.create({
      name: req.body.name,
      description: req.body.description,
    });
    return res.send(campaign);
  } catch (err) {
    return res.status(500).send();
  }
});

router.get('/:id', async (req, res) => {
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
});

router.put('/:id', async (req, res) => {
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
});

router.delete('/:id', async (req, res) => {
  try {
    const campaign = await req.context.models.Campaign.findByIdAndRemove(
      req.params.id,
    );

    if (campaign == null)
      return res.status(404).send();

    return res.send();
  } catch (err) {
    return res.status(500).send();
  }
});

router.post('/:id/share', async (req, res) => {
  try {
    res.status(501).send();
  } catch (err) {
    return res.status(500), send();
  }
});

router.get('/:campaignId/adventures', async (req, res) => {
  try {
    const adventures = await req.context.models.Adventure.find({
      campaign: req.params.campaignId,
    });
    return res.send(adventures);
  } catch (err) {
    return res.status(500).send();
  }
});

router.get('/:campaignId/adventures/:id', async (req, res) => {
  try {
    const adventure = await req.context.models.Adventure.find({
      _id: req.params.id,
      campaign: req.params.campaignId,
    });

    if (adventure.length == 0)
      return res.status(404).send();

    return res.send(adventure);
  } catch (err) {
    return res.status(500).send();
  }
});

router.put('/:campaignId/adventures/:id', async (req, res) => {
  try {
    const adventure = await req.context.models.Adventure.findOneAndUpdate(
      {
        _id: req.params.id,
        campaign: req.params.campaignId,
      },
      req.params.body,
    );

    if (adventure == null)
      return res.status(404).send();

    return res.send(adventure);
  } catch (err) {
    return res.status(500).send();
  }
});

router.delete('/:campaignId/adventures/:id', async (req, res) => {
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
});

module.exports = router;
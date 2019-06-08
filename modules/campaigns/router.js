var express = require('express');
var router = express.Router();

var adventuresRouter = require('./adventures/router');
var charactersRouter = require('./characters/router');

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
    var campaign = await req.context.models.Campaign.create(req.body);
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

router.use('/:campaignId/adventures', adventuresRouter);
router.use('/:campaignId/characters', charactersRouter);

module.exports = router;
var express = require('express');
var router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const adventures = await req.context.models.Adventure.find({
      campaign: req.params.campaignId,
    });
    return res.send(adventures);
  } catch (err) {
    return res.status(500).send();
  }
});

router.post('/', async (req, res) => {
  try {
    var adventure = await req.context.models.Adventure.create(req.body);
    return res.send(adventure);
  } catch (err) {
    return res.status(500).send();
  }
});

router.get('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
  try {
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
});

router.delete('/:id', async (req, res) => {
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
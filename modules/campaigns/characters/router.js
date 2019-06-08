var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', async (req, res) => {
  try {
    const characters = await req.context.models.Character.find({
      campaign: req.params.campaignId,
    });
    return res.send(characters);
  } catch (err) {
    return res.status(500).send();
  }
});

router.post('/', async (req, res) => {
  try {
    var character = await req.context.models.Character.create(req.body);
    return res.send(character);
  } catch (err) {
    return res.status(500).send();
  }
});

router.get('/:id', async (req, res) => {
  try {
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
});

router.put('/:id', async (req, res) => {
  try {
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
});

router.delete('/:id', async (req, res) => {
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
});

module.exports = router;
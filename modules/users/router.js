var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const createJwt = require('../../middleware/auth').createJwt;

router.post('/register', async (req, res) => {
  try {
    var user = await req.context.models.User.create({
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
    });
    return res.send(user);
  } catch (err) {
    return res.status(500).send();
  }
});

router.post('/login', async (req, res) => {
  try {
    var user = await req.context.models.User.findOne({
      username: req.body.username,
    });

    if (user == null ||
      !await bcrypt.compare(req.body.password, user.password))
      return res.status(401).send();

    return res.send({
      token: await createJwt({
        sessionData: {
          _id: user._id.toString(),
          username: user.username,
        },
        maxAge: 3600,
      }),
    });
  } catch (err) {
    return res.status(500).send();
  }
});

module.exports = router;
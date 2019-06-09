const bcrypt = require('bcrypt');
const auth = require('../../utility/authentication');

const postRegister = async (req, res) => {
  try {
    var user = await req.context.models.User.create({
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
    });

    user.filterPublicContent();
    
    return res.send(user);
  } catch (err) {
    return res.status(500).send();
  }
}

const postLogin = async (req, res) => {
  try {
    var user;
    var character;
    var isMaster = false;
    var isCharacter = false;

    user = await req.context.models.User.findOne({
      username: req.body.username,
    });
    if (user != null) isMaster = true;

    if (!isMaster) {
      character = await req.context.models.Character.findOne({
        "shareToken.value": req.body.password,
      });

      if (character != null) isCharacter = true;
    }

    if ((!isMaster && !isCharacter) || (isMaster && !await bcrypt.compare(req.body.password, user.password)))
      return res.status(401).send();

    return res.send({
      token: await auth.createJwt({
        sessionData: {
          //TODO in caso vi sia un utente collegato al personaggio va caricato il suo id
          _id: isMaster ? user._id.toString() : null,
          username: isMaster ? user.username : null,
          character: isCharacter ? character._id.toString() : null,
        },
        maxAge: 3600,
      }),
    });
  } catch (err) {
    return res.status(500).send();
  }
};


module.exports = {
  postRegister: postRegister,
  postLogin: postLogin,
}
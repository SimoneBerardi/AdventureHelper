const jwt = require('jsonwebtoken');

const createJwt = (details) => {
  if (typeof details !== 'object') {
    details = {}
  }

  if (!details.maxAge || typeof details.maxAge !== 'number') {
    details.maxAge = 3600
  }

  var token = jwt.sign(
    {
      details: details.sessionData
    },
    process.env.JWT_SECRET,
    {
      expiresIn: details.maxAge,
      algorithm: 'HS256'
    });

  return token;
}

const verifyJwt = async (token) => {
  return await jwt.verify(token, process.env.JWT_SECRET);
}

const loadJwtMw = async (req, res, next) => {
  try {
    const authorization = req.get('authorization');

    if (process.env.NODE_ENV !== 'production') {
      var user;
      var character;
      var isMaster = authorization == null || authorization.split(" ")[1] !== 'isCharacter';
      if (isMaster)
        user = await req.context.models.User.findOne({
          username: "master-user@gmail.com",
        });
      else
        character = await req.context.models.Character.findOne({
          name: 'Personaggio 1',
        });

      req.context.user = {
        _id: isMaster ? user._id.toString() : null,
        username: isMaster ? user.username : null,
        character: isMaster ? null : character._id.toString(),
      };
    } else {
      var token = authorization.split(" ")[1];
      var decodedToken = await verifyJwt(token);
      req.context.user = decodedToken.details;
    }
    next();
  } catch (err) {
    return res.status(400).send();
  }
}

const checkIsMaster = async (req, res, next) => {
  try {
    if (!isMaster(req))
      return res.status(403).send();
    next();
  } catch (err) {
    return res.status(500).send();
  }
}

const isMaster = function (req) {
  return req.context.user._id
}

const isCharacterOwner = function (req, characterId) {
  return req.context.user.character === characterId;
}

module.exports = {
  createJwt: createJwt,
  loadJwtMw: loadJwtMw,
  checkIsMaster: checkIsMaster,
  isMaster: isMaster,
  isCharacterOwner: isCharacterOwner,
}
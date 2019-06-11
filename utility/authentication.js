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

const verifyJwt = async (req, res, next) => {
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
      var decodedToken = await _verifyJwt(token);
      req.context.user = decodedToken.details;
    }
    next();
  } catch (err) {
    return res.status(400).send();
  }
}

const _verifyJwt = async (token) => {
  return await jwt.verify(token, process.env.JWT_SECRET);
}

const checkIsLoggedAsMaster = async (req, res, next) => {
  _checkIsLoggedAsMaster(req, res);
  next();
}

const _checkIsLoggedAsMaster = function (req, res) {
  if (!_isMaster(req))
    return res.status(403).send();
}

const _isMaster = function (req) {
  return req.context.user._id != null;
}

const checkIsCampaignMasterOrPlayer = async (req, res, next) => {
  var isMaster = _isMaster(req);
  if (isMaster) {
    _checkIsMaster(req, res);
  } else {
    _checkIsCampaignPlayer(req, res);
  }
  next();
}

const _checkIsMaster = function (req, res) {
  const campaign = await req.context.models.Campaign.findById(req.params.campaignId);
  if (campaign != null && campaign.user !== req.context.user._id)
    return res.status(403).send();

  req.context.user.isCampaignMaster = true;
}

const _checkIsCampaignPlayer = function (req, res) {
  const character = await req.context.models.Character.findById(req.context.user.character);
  if (character != null && character.campaign !== req.params.campaignId)
    return res.status(403).send();

  req.context.user.isCampaignMaster = false;
}

const checkIsCampaignMaster = function (req, res, next) {
  _checkIsLoggedAsMaster(req, res);
  _checkIsMaster(req, res);
  next();
}

module.exports = {
  createJwt: createJwt,
  verifyJwt: verifyJwt,
  checkIsLoggedAsMaster: checkIsLoggedAsMaster,
  checkIsCampaignMasterOrPlayer: checkIsCampaignMasterOrPlayer,
  checkIsCampaignMaster: checkIsCampaignMaster,
}
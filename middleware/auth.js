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

const loadJwt = async (req, res) => {
  const token = req.get('authorization').split(" ")[1];
  try {
    var decodedToken = await verifyJwt(token);
    req.context.user = decodedToken.details;
  } catch (err) {
    return res.status(400).send();
  }
}

exports.createJwt = createJwt;
exports.loadJwt = loadJwt;
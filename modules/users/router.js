var express = require('express');
var router = express.Router();

router.post('/register', function (req, res, next) {
  res.send('TODO - Registrazione utente');
});

router.post('/login', function (req, res, next) {
  res.send('TODO - Login utente');
});

module.exports = router;
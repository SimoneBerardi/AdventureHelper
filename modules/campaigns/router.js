const express = require('express');
const router = express.Router();

const auth = require('../../utility/authentication');

const controller = require('./controller');

const adventuresRouter = require('../adventures/router');
const charactersRouter = require('../characters/router');
const npcsRouter = require('../npcs/router');

router.all('*', auth.verifyJwt);

router.all('/', auth.checkIsLoggedAsMaster);
router.get('/', controller.getAll);
router.post('/', controller.add);

router.all('/:id', auth.checkIsLoggedAsMaster);
router.get('/:id', controller.getById);
router.put('/:id', controller.modify);
router.delete('/:id', controller.remove);

router.all('/:id/share', auth.checkIsLoggedAsMaster);
router.post('/:id/share', controller.share);

router.use('/:campaignId/adventures', adventuresRouter);
router.use('/:campaignId/characters', charactersRouter);
router.use('/:campaignId/npcs', npcsRouter);

module.exports = router;
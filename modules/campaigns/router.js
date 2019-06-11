const express = require('express');
const router = express.Router();

const auth = require('../../utility/authentication');

const controller = require('./controller');

const adventuresRouter = require('../adventures/router');
const charactersRouter = require('../characters/router');

router.all('*', auth.verifyJwtMiddleware);

router.all('/', auth.checkIsLoggedAsMaster);
router.get('/', controller.getAll);
router.post('/', controller.add);

router.all('/:id', auth.checkIsLoggedAsMaster);
router.get('/:id', controller.getById);
router.put('/:id', controller.modify);
router.delete('/:id', controller.remove);

router.all('/:id/share', auth.checkIsLoggedAsMaster);
router.post('/:id/share', controller.share);

router.all('/:campaignId/adventures', auth.checkIsMasterOrPlayer);
router.use('/:campaignId/adventures', adventuresRouter);

router.all('/:campaignId/characters', auth.checkIsMasterOrPlayer);
router.use('/:campaignId/characters', charactersRouter);

module.exports = router;
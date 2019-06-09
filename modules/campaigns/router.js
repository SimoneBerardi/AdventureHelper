const express = require('express');
const router = express.Router();

const auth = require('../../utility/authentication');

const controller = require('./controller');

const adventuresRouter = require('./adventures/router');
const charactersRouter = require('./characters/router');

router.all('*', auth.loadJwtMw);

router.all('/', auth.checkIsMaster);
router.all('/:id', auth.checkIsMaster);
router.all('/:id/share', auth.checkIsMaster);
router.all('/:campaignId/adventures', auth.checkIsMaster);

router.get('/', controller.getAll);
router.post('/', controller.add);
router.get('/:id', controller.getById);
router.put('/:id', controller.modify);
router.delete('/:id', controller.remove);
router.post('/:id/share', controller.share);

router.use('/:campaignId/adventures', adventuresRouter);
router.use('/:campaignId/characters', charactersRouter);

module.exports = router;
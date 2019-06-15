const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('./controller');

const auth = require('../../utility/authentication');

router.get('/', auth.checkIsCampaignMasterOrPlayer);
router.get('/', controller.getAll);

router.post('/generate', auth.checkIsCampaignMaster);
router.post('/generate', controller.generate);

router.get('/:id', auth.checkIsCampaignMasterOrPlayer);
router.get('/:id', controller.getById);

router.delete('/:id', auth.checkIsCampaignMaster);
router.delete('/:id', controller.remove);

router.post('/:id/share', auth.checkIsCampaignMaster);
router.post('/:id/share', controller.share);

router.post('/:id/distribute', auth.checkIsCampaignMaster);
router.post('/:id/distribute', controller.distribute);

module.exports = router;
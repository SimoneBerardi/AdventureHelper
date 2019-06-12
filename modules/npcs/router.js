const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('./controller');

const auth = require('../../utility/authentication');

router.get('/', auth.checkIsCampaignMasterOrPlayer);
router.get('/', controller.getAll);

router.post('/', auth.checkIsCampaignMaster);
router.post('/', controller.add);

router.get('/:id', auth.checkIsCampaignMasterOrPlayer);
router.get('/:id', controller.getById);

router.put('/:id', auth.checkIsCampaignMaster);
router.put('/:id', controller.modify);

router.delete('/:id', auth.checkIsCampaignMaster);
router.delete('/:id', controller.remove);

router.post('/:id/share', auth.checkIsCampaignMaster);
router.post('/:id/share', controller.share);

module.exports = router;
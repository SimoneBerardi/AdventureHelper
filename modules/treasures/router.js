const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('./controller');

const auth = require('../../utility/authentication');

router.post('/generate', auth.checkIsCampaignMaster);
router.post('/generate', controller.generate);

module.exports = router;
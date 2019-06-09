const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('./controller');

router.get('/', controller.getAll);
router.post('/', controller.add);
router.get('/:id', controller.getById);
router.put('/:id', controller.modify);
router.delete('/:id', controller.remove);

module.exports = router;
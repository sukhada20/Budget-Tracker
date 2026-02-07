const express = require('express');
const router = express.Router();
const {
    getEnvelopes,
    setEnvelope,
    updateEnvelope,
    deleteEnvelope,
    spendFromEnvelope
} = require('../controllers/envelopeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getEnvelopes).post(protect, setEnvelope);
router.route('/:id').put(protect, updateEnvelope).delete(protect, deleteEnvelope);
router.route('/:id/spend').post(protect, spendFromEnvelope);

module.exports = router;

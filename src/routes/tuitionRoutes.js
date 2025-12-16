const express = require('express');
const { createTuition, getMyTuitions } = require('../controllers/tuitionController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/tuitions', verifyToken, createTuition);
router.get('/tuitions/my-tuitions/:email', verifyToken, getMyTuitions);

module.exports = router;
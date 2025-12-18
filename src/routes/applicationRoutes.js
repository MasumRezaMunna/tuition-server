const express = require('express');
const { applyForTuition } = require('../controllers/applicationController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/applications', verifyToken, applyForTuition);

module.exports = router;
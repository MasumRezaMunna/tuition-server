const express = require('express');
const { createTuition, getMyTuitions, getAllTuitions, updateTuitionStatus, getApprovedTuitions } = require('../controllers/tuitionController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/tuitions', verifyToken, createTuition);
router.get('/tuitions/my-tuitions/:email', verifyToken, getMyTuitions);

router.get('/tuitions/all', verifyToken, verifyAdmin, getAllTuitions);
router.patch('/tuitions/status/:id', verifyToken, verifyAdmin, updateTuitionStatus);
router.get('/tuitions', getApprovedTuitions);
module.exports = router;
router.get('/tuitions/:id', getSingleTuition);
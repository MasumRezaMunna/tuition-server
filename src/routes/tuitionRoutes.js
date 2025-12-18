const express = require('express');
const {
  createTuition,
  getMyTuitions,
  getAllTuitions,
  updateTuitionStatus,
  getApprovedTuitions,
  getSingleTuition
} = require('../controllers/tuitionController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

/* student */
router.post('/', verifyToken, createTuition);
router.get('/my-tuitions', verifyToken, getMyTuitions);

/* admin */
router.get('/all', verifyToken, verifyAdmin, getAllTuitions);
router.patch('/status/:id', verifyToken, verifyAdmin, updateTuitionStatus);

/* public */
router.get('/', getApprovedTuitions);
router.get('/:id', getSingleTuition);

module.exports = router;

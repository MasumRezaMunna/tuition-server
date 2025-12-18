const express = require('express');
const router = express.Router();
const {
    applyTutor,
    getAllApplications,
    approveTutor,
    getTutorApplications
} = require('../controllers/applicationController');
const verifyJWT = require('../middlewares/verifyToken');

router.post('/apply', verifyJWT, applyTutor);
router.get('/', verifyJWT, getAllApplications);
router.patch('/approve/:id', verifyJWT, approveTutor);
router.get('/my-applications', verifyJWT, getTutorApplications);

module.exports = router;

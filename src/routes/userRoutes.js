const express = require('express');
const { upsertUser, getAllUsers, getUserRole } = require('../controllers/userController');

const router = express.Router();

router.post('/users', upsertUser); 

router.get('/users', getAllUsers); 

router.get('/users/role/:email', getUserRole); 

module.exports = router;
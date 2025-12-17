const express = require('express');
const {
  upsertUser,
  getAllUsers,
  getUserRole,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/users', upsertUser);
router.get('/role/:email', verifyToken, getUserRole);
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.patch('/users/role/:id', verifyToken, verifyAdmin, updateUserRole);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;

const express = require('express');
const {
  upsertUser,
  getAllUsers,
  getUserRole,
  updateUserRole,
  deleteUser,
  updateProfile,
  getAdminStats
} = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', upsertUser);

router.get('/role', verifyToken, getUserRole);

router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.patch('/role/:id', verifyToken, verifyAdmin, updateUserRole);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);
router.patch('/update/:email', verifyToken, updateProfile);
router.get('/admin-stats', verifyToken, verifyAdmin, getAdminStats);

module.exports = router;

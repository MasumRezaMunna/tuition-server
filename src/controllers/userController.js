const User = require("../models/User");

const upsertUser = async (req, res) => {
  const { email, name, phone, photoURL } = req.body;

  const filter = { email };
  const update = {
    $set: { name, phone, photoURL },
    $setOnInsert: { role: "student" }
  };

  try {
    const user = await User.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true
    });

    res.status(201).send({ message: "User saved", user });
  } catch (error) {
    res.status(500).send({ message: "User save failed" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name email role accountStatus photoURL createdAt"
    );
    res.send(users);
  } catch {
    res.status(500).send({ message: "Failed to fetch users" });
  }
};

const getUserRole = async (req, res) => {
  try {
    const email = req.decoded.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ role: user.role });
  } catch {
    res.status(500).send({ message: "Failed to get role" });
  }
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const result = await User.updateOne(
      { _id: id },
      { $set: { role, roleUpdatedAt: new Date() } }
    );
    res.send(result);
  } catch {
    res.status(500).send({ message: "Role update failed" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.email === req.decoded.email) {
      return res.status(400).send({ message: "Cannot delete own account" });
    }

    await User.findByIdAndDelete(id);
    res.send({ message: "User deleted" });
  } catch {
    res.status(500).send({ message: "Delete failed" });
  }
};

module.exports = {
  upsertUser,
  getAllUsers,
  getUserRole,
  updateUserRole,
  deleteUser
};

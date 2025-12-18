const Tuition = require('../models/Tuition');

const createTuition = async (req, res) => {
  try {
    const tuition = {
      ...req.body,
      studentEmail: req.decoded.email,
      status: 'pending'
    };

    const result = await Tuition.create(tuition);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Failed to create tuition' });
  }
};

const getMyTuitions = async (req, res) => {
  try {
    const result = await Tuition.find({
      studentEmail: req.decoded.email
    }).sort({ createdAt: -1 });

    res.send(result);
  } catch {
    res.status(500).send({ message: 'Failed to fetch tuitions' });
  }
};

const getAllTuitions = async (req, res) => {
  try {
    const result = await Tuition.find().sort({
      status: 1,
      createdAt: -1
    });
    res.send(result);
  } catch {
    res.status(500).send({ message: 'Failed to fetch all tuitions' });
  }
};

const updateTuitionStatus = async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).send({ message: 'Invalid status' });
  }

  try {
    const result = await Tuition.updateOne(
      { _id: req.params.id },
      { $set: { status } }
    );
    res.send(result);
  } catch {
    res.status(500).send({ message: 'Status update failed' });
  }
};

const getApprovedTuitions = async (req, res) => {
  try {
    const result = await Tuition.find({ status: 'approved' })
      .sort({ createdAt: -1 });
    res.send(result);
  } catch {
    res.status(500).send({ message: 'Failed to fetch tuitions' });
  }
};

const getSingleTuition = async (req, res) => {
  try {
    const result = await Tuition.findById(req.params.id);
    res.send(result);
  } catch {
    res.status(500).send({ message: 'Failed to fetch tuition' });
  }
};

module.exports = {
  createTuition,
  getMyTuitions,
  getAllTuitions,
  updateTuitionStatus,
  getApprovedTuitions,
  getSingleTuition
};

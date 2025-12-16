const Tuition = require('../models/Tuition');

const createTuition = async (req, res) => {
    try {
        const newTuition = req.body;
        newTuition.status = 'pending'; 
        
        const result = await Tuition.create(newTuition);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: 'Error creating tuition post', error: error.message });
    }
};

const getMyTuitions = async (req, res) => {
    const email = req.params.email;
    
    if (req.decoded.email !== email) {
        return res.status(403).send({ message: 'forbidden access' });
    }
    
    try {
        const result = await Tuition.find({ studentEmail: email }).sort({ createdAt: -1 });
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching tuitions' });
    }
};


const getAllTuitions = async (req, res) => {
    try {
         const result = await Tuition.find({}).sort({ status: -1, createdAt: -1 });
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching all tuitions' });
    }
};

const updateTuitionStatus = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body; 

    const filter = { _id: id };
    const updateDoc = {
        $set: { status: status }
    };

    try {
        const result = await Tuition.updateOne(filter, updateDoc);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: 'Error updating status' });
    }
};

module.exports = {
    createTuition,
    getMyTuitions,
    getAllTuitions,    
    updateTuitionStatus 
};
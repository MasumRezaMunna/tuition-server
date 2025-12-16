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

module.exports = {
    createTuition,
    getMyTuitions
};
const Application = require('../models/Application');

const applyForTuition = async (req, res) => {
    const applicationData = req.body;

    const query = { 
        tuitionId: applicationData.tuitionId, 
        tutorEmail: applicationData.tutorEmail 
    };
    
    const existingApplication = await Application.findOne(query);
    if (existingApplication) {
        return res.send({ message: 'already-applied' });
    }

    try {
        const result = await Application.create(applicationData);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: 'Error applying' });
    }
};

module.exports = { applyForTuition };
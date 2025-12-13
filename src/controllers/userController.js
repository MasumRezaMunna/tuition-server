const User = require('../models/User');


const upsertUser = async (req, res) => {
    const { email, name, role, phone, photoURL } = req.body;
    
    const defaultRole = role || 'student'; 

    const filter = { email };
    const update = { 
        $set: { email, name, photoURL },
        $setOnInsert: { role: defaultRole }
    };
    const options = { upsert: true, new: true }; 

    try {
        const result = await User.findOneAndUpdate(filter, update, options);
        res.status(200).send({ message: "User saved successfully", user: result });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send({ message: 'Error saving user data', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch users' });
    }
};

const getUserRole = async (req, res) => {
    const email = req.params.email;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send({ role: user.role });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching user role' });
    }
};


module.exports = {
    upsertUser,
    getAllUsers,
    getUserRole
};
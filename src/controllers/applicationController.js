const Application = require('../models/Application');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const applyTutor = async (req, res) => {
    try {
        const { tuitionId, subject, tutorName, tutorEmail } = req.body;

        const existing = await Application.findOne({ tuitionId, tutorId: req.user._id });
        if (existing) {
            return res.status(400).json({ message: 'You have already applied for this tuition!' });
        }

        const application = new Application({
            tuitionId,
            subject,
            studentEmail: req.body.studentEmail,
            tutorName,
            tutorEmail,
            tutorId: req.user._id
        });

        await application.save();
        res.status(201).json({ message: 'Application submitted', application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getTutorApplications = async (req, res) => {
    try {
        const applications = await Application.find({ tutorId: req.user._id }).sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const approveTutor = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findById(id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

       
        await Application.updateMany(
            { tuitionId: application.tuitionId, _id: { $ne: id }, status: 'pending' },
            { status: 'rejected' }
        );

       
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount * 100, 
            currency: 'usd',
            metadata: { applicationId: application._id.toString() }
        });

        
        application.status = 'approved';
        application.studentId = req.user._id;
        application.paymentStatus = 'pending';
        application.paymentIntentId = paymentIntent.id;
        application.approvedAt = new Date();

        await application.save();

        res.json({
            message: 'Tutor approved. Payment initiated.',
            clientSecret: paymentIntent.client_secret,             application
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    applyTutor,
    getAllApplications,
    approveTutor,
    getTutorApplications
};

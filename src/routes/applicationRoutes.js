const express = require('express');
const router = express.Router();
const {
    applyTutor,
    getAllApplications,
    approveTutor,
    getTutorApplications
} = require('../controllers/applicationController');
const verifyJWT = require('../middlewares/verifyToken');

router.post('/apply', verifyJWT, applyTutor);
router.get('/', verifyJWT, getAllApplications);
router.patch('/approve/:id', verifyJWT, approveTutor);
router.get('/my-applications', verifyJWT, getTutorApplications);


router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log('Payment Successful:', paymentIntent.id);
    }

    res.json({ received: true });
});

module.exports = router;

const express = require('express');
const Stripe = require('stripe');
const TuitionApplication = require('../models/applicationModel'); // তুমি যেই মডেল বানিয়েছো
const Tuition = require('../models/tuitionModel');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, applicationId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { applicationId },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'PaymentIntent creation failed' });
    }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const applicationId = paymentIntent.metadata.applicationId;

        try {
            const application = await TuitionApplication.findById(applicationId);
            if (!application) {
                console.error('Application not found:', applicationId);
                return res.status(404).send('Application not found');
            }

            application.paymentStatus = 'paid';
            application.paymentIntentId = paymentIntent.id;
            application.tutorConfirmed = true;
            await application.save();

            await TuitionApplication.updateMany(
                {
                    _id: { $ne: applicationId },
                    tuitionId: application.tuitionId,
                    paymentStatus: 'pending'
                },
                { $set: { paymentStatus: 'rejected' } }
            );

            console.log('Payment success handled for application:', applicationId);
        } catch (error) {
            console.error(error);
        }
    }

    res.json({ received: true });
});

module.exports = router;

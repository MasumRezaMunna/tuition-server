require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const userRoutes = require('./src/routes/userRoutes');
const app = express();
const port = process.env.PORT || 5000;
const tuitionRoutes = require('./src/routes/tuitionRoutes');
const User = require('./src/models/User');



app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://etuition-bd.web.app',
        'https://etuition-bd.firebaseapp.com'
    ],
    credentials: true
}));
app.use(express.json());
app.use(userRoutes);
app.use(tuitionRoutes);

const uri = process.env.DB_URI;

mongoose.connect(uri)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
    });


app.get('/', (req, res) => {
    res.send('eTuitionBd Server is Running...');
});





app.post('/jwt', async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.send({ token });
});

app.post('/create-payment-intent', async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price * 100);
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card']
    });

    res.send({
        clientSecret: paymentIntent.client_secret
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
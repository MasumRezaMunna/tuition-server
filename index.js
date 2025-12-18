require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const userRoutes = require('./src/routes/userRoutes');
const tuitionRoutes = require('./src/routes/tuitionRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const User = require('./src/models/User');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://tuition-client-five.vercel.app/',
    'https://fascinating-pavlova-390b2e.netlify.app/'
  ],
  credentials: true
}));


app.post('/applications/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

 
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('✅ Payment succeeded for Intent ID:', paymentIntent.id);
    
  }

  res.json({ received: true });
});


app.use(express.json());


let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.DB_URI);
    isConnected = true;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
connectDB();


app.use('/users', userRoutes);
app.use('/tuitions', tuitionRoutes);
app.use('/applications', applicationRoutes);

app.get('/', (req, res) => {
  res.send('eTuitionBd Server is Running...');
});

app.post('/jwt', (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h'
  });
  res.send({ token });
});

app.post('/login', async (req, res) => {
  const { email, name, photoURL } = req.body;

  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: { name, photoURL },
      $setOnInsert: { role: 'student' }
    },
    { upsert: true, new: true }
  );

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );

  res.send({ token, user });
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const amount = parseInt(req.body.price * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card']
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = app;
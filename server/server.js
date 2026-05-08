import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import Order from './models/Order.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    // Ensure invoiceId is set (mapping id from frontend to invoiceId)
    if (orderData.id && !orderData.invoiceId) {
      orderData.invoiceId = orderData.id;
    }
    
    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

app.get('/api/orders/:invoiceId', async (req, res) => {
  try {
    const order = await Order.findOne({ invoiceId: req.params.invoiceId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get all orders (admin / debugging)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Fetch all orders error:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (by invoiceId)
app.patch('/api/orders/:invoiceId/status', async (req, res) => {
  try {
    const { status, currentStep } = req.body;
    if (!status && typeof currentStep === 'undefined') {
      return res.status(400).json({ error: 'Provide `status` or `currentStep` in body' });
    }

    const update = {};
    if (status) update.status = status;
    if (typeof currentStep !== 'undefined') update.currentStep = currentStep;

    const order = await Order.findOneAndUpdate(
      { invoiceId: req.params.invoiceId },
      update,
      { new: true }
    );

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err.message);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Paymob Integration (V2 Intention API)
app.post('/api/paymob/pay', async (req, res) => {
  try {
    const { amount, customer, invoiceId } = req.body;
    const amountCents = amount * 100; // Paymob expects amount in cents

    // V2 Intention API Flow
    const response = await axios.post('https://accept.paymob.com/v1/intention/', {
      amount: amountCents,
      currency: "EGP",
      payment_methods: [parseInt(process.env.PAYMOB_INTEGRATION_ID)],
      billing_data: {
        apartment: "NA",
        email: customer.email || "test@test.com",
        floor: "NA",
        first_name: customer.fullName?.split(' ')[0] || "Guest",
        street: customer.address || "NA",
        building: "NA",
        phone_number: customer.phone || "01000000000",
        shipping_method: "PKG",
        postal_code: "NA",
        city: customer.governorate || "Cairo",
        country: "EG",
        last_name: customer.fullName?.split(' ')[1] || "User",
        state: customer.governorate || "Cairo"
      },
      extras: {
        invoiceId: invoiceId
      },
      redirection_url: "http://localhost:5000/api/paymob/callback"
    }, {
      headers: {
        'Authorization': `Token ${process.env.PAYMOB_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const clientSecret = response.data.client_secret;
    // For Unified Checkout, we redirect to Paymob's hosted page
    const iframeUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;

    // Save Paymob Intention ID to our database
    if (invoiceId) {
      await Order.findOneAndUpdate({ invoiceId }, { paymobOrderId: response.data.id });
    }

    res.json({ iframeUrl });
  } catch (err) {
    console.error('Paymob Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Paymob connection failed', details: err.response?.data || err.message });
  }
});

// Paymob Callback Handling
app.post('/api/paymob/callback', async (req, res) => {
  try {
    const { obj } = req.body;
    const paymobOrderId = obj.order.id;
    const success = obj.success;

    if (success) {
      await Order.findOneAndUpdate(
        { paymobOrderId: paymobOrderId },
        { status: 'Paid', currentStep: 1 } // Advance to 'Preparing Your Order'
      );
      console.log(`✅ Order ${paymobOrderId} marked as Paid`);
    } else {
      console.log(`❌ Payment failed for Order ${paymobOrderId}`);
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('Callback Error:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Paymob Redirection (GET)
app.get('/api/paymob/callback', (req, res) => {
  const { success, id } = req.query;
  // Redirect back to frontend with status
  const frontendUrl = `http://localhost:5173/?payment=${success === 'true' ? 'success' : 'failed'}&id=${id}`;
  res.redirect(frontendUrl);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

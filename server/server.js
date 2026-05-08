import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

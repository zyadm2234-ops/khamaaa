import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true },
  paymobOrderId: { type: String },
  customer: {
    fullName: String,
    phone: String,
    address: String,
    email: String
  },
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      quantity: Number,
      size: String,
      color: String,
      image: String
    }
  ],
  paymentMethod: String,
  governorate: String,
  shipping: Number,
  subtotal: Number,
  total: Number,
  estimatedDelivery: String,
  trackingSteps: [String],
  currentStep: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' },
  createdAt: { type: String, default: () => new Date().toLocaleString() }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;

import React, { useState, useMemo } from 'react';
import { shippingPrices, deliveryTimes } from '../data/constants';
import { createOrder } from '../services/api';

const Cart = ({ cart, setCart, setCurrentPage, setLastOrder }) => {
  const [governorate, setGovernorate] = useState('Cairo');
  const [paymentMethod, setPaymentMethod] = useState('Visa');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutData, setCheckoutData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: ''
  });

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const shippingPrice = shippingPrices[governorate] || 100;
  const finalTotal = totalPrice + shippingPrice;
  const deliveryTime = deliveryTimes[governorate] || '48 Hours';

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    setCheckoutError('');
    if (!checkoutData.fullName || !checkoutData.phone || !checkoutData.address || !checkoutData.email) {
      setCheckoutError('Please complete all required checkout fields.');
      return;
    }

    setLoadingPayment(true);

    const orderData = {
      id: `KH-${Math.floor(Math.random() * 100000)}`,
      items: cart,
      subtotal: totalPrice,
      shipping: shippingPrice,
      total: finalTotal,
      governorate: governorate,
      estimatedDelivery: deliveryTime,
      createdAt: new Date().toLocaleString(),
      paymentMethod: paymentMethod,
      customer: checkoutData,
      trackingSteps: ['Order Confirmed', 'Preparing Your Order', 'Shipped', 'Out For Delivery'],
      currentStep: 0
    };

    try {
      // Save to Database
      await createOrder(orderData);
      
      setLastOrder(orderData);
      localStorage.setItem('ss-last-order', JSON.stringify(orderData));
      setCart([]);
      setCurrentPage('order-success');
    } catch (err) {
      console.error(err);
      setCheckoutError('Failed to process order. Please try again.');
    } finally {
      setLoadingPayment(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => setCurrentPage('products')} className="bg-black text-white px-6 py-2 rounded-xl">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <section className="px-6 md:px-10 py-12 max-w-6xl mx-auto">
      <h2 className="text-4xl font-black mb-10">Your Cart</h2>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item, index) => (
            <div key={index} className="flex gap-4 border-b pb-6">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl" />
              <div className="flex-1">
                <h4 className="font-bold">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.size} / {item.color}</p>
                <p className="font-medium mt-1">{item.price} EGP x {item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(index)} className="text-red-500 text-sm">Remove</button>
            </div>
          ))}
        </div>

        <div className="border rounded-3xl p-6 bg-gray-50 h-fit">
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>
          <div className="space-y-4 text-sm mb-6">
            <div className="flex justify-between"><span>Subtotal</span><span>{totalPrice} EGP</span></div>
            <div className="flex justify-between"><span>Shipping ({governorate})</span><span>{shippingPrice} EGP</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-4"><span>Total</span><span>{finalTotal} EGP</span></div>
          </div>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-xl px-4 py-3"
              value={checkoutData.fullName}
              onChange={(e) => setCheckoutData({ ...checkoutData, fullName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full border rounded-xl px-4 py-3"
              value={checkoutData.phone}
              onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Shipping Address"
              className="w-full border rounded-xl px-4 py-3"
              value={checkoutData.address}
              onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border rounded-xl px-4 py-3"
              value={checkoutData.email}
              onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
            />
            <select
              className="w-full border rounded-xl px-4 py-3"
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
            >
              {Object.keys(shippingPrices).map(gov => <option key={gov} value={gov}>{gov}</option>)}
            </select>

            <select
              className="w-full border rounded-xl px-4 py-3"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash On Delivery">Cash On Delivery</option>
              <option value="Visa">Visa</option>
              <option value="Paymob">Paymob</option>
              <option value="Vodafone Cash">Vodafone Cash</option>
              <option value="Instapay">Instapay</option>
            </select>
          </div>

          {checkoutError && <p className="text-red-500 text-xs mb-4">{checkoutError}</p>}

          <button
            onClick={handleCheckout}
            disabled={loadingPayment}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {loadingPayment ? 'Processing...' : `Pay With ${paymentMethod}`}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;

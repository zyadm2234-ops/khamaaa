import React, { useState } from 'react';
import { getOrder } from '../services/api';

const TrackOrder = ({ searchedOrder, setSearchedOrder, invoiceSearch, setInvoiceSearch }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInvoiceSearch = async () => {
    if (!invoiceSearch) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrder(invoiceSearch);
      setSearchedOrder(data);
    } catch (err) {
      console.error(err);
      setError('Invoice Not Found or Server Offline');
      // Fallback to local storage for demo purposes if API fails
      const savedOrder = JSON.parse(localStorage.getItem('ss-last-order') || 'null');
      if (savedOrder && savedOrder.id.toLowerCase() === invoiceSearch.toLowerCase()) {
        setSearchedOrder(savedOrder);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 md:px-10 py-12 max-w-4xl mx-auto">
      <div className="border rounded-3xl p-8 mb-8">
        <h2 className="text-4xl font-black mb-4">Track Your Order</h2>
        <p className="text-gray-500 mb-6">Enter your invoice number to view your order details.</p>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter Invoice ID (Example: KH-12345)"
            value={invoiceSearch}
            onChange={(e) => setInvoiceSearch(e.target.value)}
            className="flex-1 border rounded-2xl px-5 py-4"
          />
          <button
            onClick={handleInvoiceSearch}
            disabled={loading}
            className="bg-black text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {searchedOrder && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="border rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Invoice</h3>
                <span className="text-sm text-gray-500">#{searchedOrder.invoiceId || searchedOrder.id}</span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between"><span>Date</span><span>{searchedOrder.createdAt}</span></div>
                <div className="flex justify-between"><span>Payment Method</span><span>{searchedOrder.paymentMethod}</span></div>
                <div className="flex justify-between"><span>Governorate</span><span>{searchedOrder.governorate}</span></div>
                <div className="flex justify-between"><span>Estimated Delivery</span><span>{searchedOrder.estimatedDelivery}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-4">
                  <span>Total Paid</span>
                  <span>{searchedOrder.total} EGP</span>
                </div>
              </div>
            </div>

            <div className="border rounded-3xl p-6">
              <h3 className="text-2xl font-bold mb-6">Ordered Products</h3>
              <div className="space-y-5">
                {searchedOrder.items.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 border rounded-2xl p-4">
                    <img src={item.image} alt={item.name} className="w-full md:w-28 h-28 object-cover rounded-2xl" />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">{item.name}</h4>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <p className="text-sm text-gray-500">Color: {item.color}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="font-bold">{item.price * item.quantity} EGP</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border rounded-3xl p-6 h-fit sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Tracking</h3>
            </div>
            <div className="space-y-5">
              {searchedOrder.trackingSteps?.map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full ${index <= searchedOrder.currentStep ? 'bg-black' : 'bg-gray-300'}`} />
                  <p className={`font-medium ${index <= searchedOrder.currentStep ? 'text-black' : 'text-gray-400'}`}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrackOrder;

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import TrackOrder from './pages/TrackOrder';

function App() {
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [invoiceSearch, setInvoiceSearch] = useState('');

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('ss-cart');
    const savedOrder = localStorage.getItem('ss-last-order');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrder) setLastOrder(JSON.parse(savedOrder));

    // Handle Paymob redirection
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      setCurrentPage('order-success');
      setCart([]);
      localStorage.removeItem('ss-cart');
      // Clear URL parameters
      window.history.replaceState({}, document.title, "/");
    } else if (paymentStatus === 'failed') {
      alert('Payment failed. Please try again.');
      setCurrentPage('cart');
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('ss-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, size: 'M', color: 'Black' }];
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar 
        setCurrentPage={setCurrentPage} 
        cartCount={cartCount} 
        setMobileMenu={setMobileMenu} 
        mobileMenu={mobileMenu} 
      />

      <main>
        {currentPage === 'home' && (
          <Home 
            setCurrentPage={setCurrentPage} 
            setSelectedProduct={setSelectedProduct} 
            addToCart={addToCart} 
          />
        )}
        
        {currentPage === 'products' && (
          <Products 
            setSelectedProduct={setSelectedProduct} 
            addToCart={addToCart} 
          />
        )}

        {currentPage === 'cart' && (
          <Cart 
            cart={cart} 
            setCart={setCart} 
            setCurrentPage={setCurrentPage} 
            setLastOrder={setLastOrder} 
          />
        )}

        {currentPage === 'track-order' && (
          <TrackOrder 
            searchedOrder={searchedOrder} 
            setSearchedOrder={setSearchedOrder} 
            invoiceSearch={invoiceSearch} 
            setInvoiceSearch={setInvoiceSearch} 
          />
        )}

        {currentPage === 'order-success' && lastOrder && (
          <div className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center">
            <div className="bg-green-100 border border-green-300 text-green-700 rounded-3xl p-8 mb-8">
              <h2 className="text-3xl font-black mb-2">✅ Order Successful!</h2>
              <p>Your order ID is: <span className="font-bold">{lastOrder.id}</span></p>
              <p className="mt-4">You can track your order using this ID in the "Track Order" section.</p>
            </div>
            <button 
              onClick={() => setCurrentPage('track-order')}
              className="bg-black text-white px-8 py-3 rounded-2xl"
            >
              Track Now
            </button>
          </div>
        )}
      </main>

      <footer className="border-t py-12 px-6 md:px-10 text-center text-gray-500 text-sm">
        <p>© 2026 KHAMA T-Shirt Store. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;

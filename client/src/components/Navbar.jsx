import React from 'react';

const Navbar = ({ setCurrentPage, cartCount, setMobileMenu, mobileMenu }) => {
  return (
    <>
      <nav className="flex justify-between items-center px-5 md:px-8 py-4 border-b sticky top-0 bg-white z-50">
        <h1 
          className="text-4xl font-black tracking-wide cursor-pointer uppercase"
          onClick={() => setCurrentPage('home')}
        >
          KHAMA
        </h1>

        <div className="hidden md:flex gap-6 text-sm font-medium">
          <button onClick={() => setCurrentPage('home')}>Home</button>
          <button onClick={() => setCurrentPage('products')}>Products</button>
          <button onClick={() => setCurrentPage('track-order')}>Track Order</button>
          <button>About</button>
          <button>Contact</button>
        </div>

        <div className="flex items-center gap-3">
          <button className="border p-2 rounded-full hover:bg-gray-100 transition">❤️</button>
          <button
            onClick={() => setCurrentPage('cart')}
            className="bg-black text-white px-4 py-2 rounded-full text-sm"
          >
            🛒 Cart ({cartCount})
          </button>
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden border px-3 py-2 rounded-xl"
          >
            ☰
          </button>
        </div>
      </nav>

      {mobileMenu && (
        <div className="md:hidden border-b p-4 flex flex-col gap-3 bg-white">
          <button onClick={() => { setCurrentPage('home'); setMobileMenu(false); }}>Home</button>
          <button onClick={() => { setCurrentPage('products'); setMobileMenu(false); }}>Products</button>
          <button onClick={() => { setCurrentPage('track-order'); setMobileMenu(false); }}>Track Order</button>
          <button onClick={() => { setCurrentPage('cart'); setMobileMenu(false); }}>Cart</button>
        </div>
      )}
    </>
  );
};

export default Navbar;

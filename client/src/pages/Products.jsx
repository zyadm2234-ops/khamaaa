import React from 'react';
import { products } from '../data/constants';

const Products = ({ setSelectedProduct, addToCart }) => {
  return (
    <section className="px-6 md:px-10 py-12">
      <h2 className="text-4xl font-black mb-10">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition bg-white">
            <img src={product.image} alt={product.name} className="h-72 w-full object-cover" />
            <div className="p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
                <div className="text-sm">⭐ {product.rating}</div>
              </div>
              <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
              <div className="flex justify-between items-center gap-3">
                <p className="text-gray-700 font-medium">{product.price} EGP</p>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedProduct(product)} className="border px-3 py-2 rounded-xl text-sm hover:bg-gray-100 transition">View</button>
                  <button onClick={() => addToCart(product)} className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition">Add</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;

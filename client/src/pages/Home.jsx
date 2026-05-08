import React from 'react';
import { styles, products } from '../data/constants';

const Home = ({ setCurrentPage, setSelectedProduct, addToCart }) => {
  return (
    <>
      <section className="text-center py-20 px-4 bg-gray-50">
        <h2 className="text-4xl md:text-6xl font-black mb-5">
          Customize Your Own Shirts
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto text-sm md:text-base">
          Choose your own style and wear something that represents you.
        </p>
        <button
          onClick={() => setCurrentPage('products')}
          className="bg-black hover:bg-gray-800 transition text-white px-8 py-4 rounded-2xl text-sm font-medium shadow-lg"
        >
          Shop Now
        </button>
      </section>

      <section className="px-6 md:px-10 py-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold">Available Styles</h3>
          <span className="text-sm text-gray-500">Swipe →</span>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-3">
          {styles.map((style) => (
            <div
              key={style.title}
              className="min-w-[220px] border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition bg-white"
            >
              <img
                src={style.image}
                alt={style.title}
                className="h-44 w-full object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-center">{style.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold">Best Sellers</h3>
          <button className="text-sm border px-4 py-2 rounded-full hover:bg-black hover:text-white transition">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition bg-white"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-72 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="text-sm">⭐ {product.rating}</div>
                </div>
                <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
                <div className="flex justify-between items-center gap-3">
                  <p className="text-gray-700 font-medium">{product.price} EGP</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="border px-3 py-2 rounded-xl text-sm hover:bg-gray-100 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-800 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;

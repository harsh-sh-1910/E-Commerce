import React, { useState } from "react";
import { getLocalStorage } from "../localStorageUtils/localStorageUtils";
import { MdDeleteOutline } from "react-icons/md";

const WishlistPage = () => {
  const URL = "https://e-commerce-4pcq.onrender.com";
  const [wishlistItems, setWishlistItems] = useState(() => {
    const items = getLocalStorage("wishlist") || [];
    return items.map((item) => ({
      ...item,
      quantity: typeof item.quantity === "number" ? item.quantity : 1,
    }));
  });

  const removeItem = (_id) => {
    const updatedItems = wishlistItems.filter((item) => item._id !== _id);
    setWishlistItems(updatedItems);
    localStorage.setItem("wishlist", JSON.stringify(updatedItems));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-light text-center mb-12">♡ WISHLIST</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
            <div className="col-span-6 text-center">Product</div>
            <div className="col-span-3 text-center">Price</div>
            <div className="col-span-3 text-center">Delete</div>
          </div>

          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center"
            >
              <div className="md:col-span-6 flex space-x-4 items-center justify-center">
                <div className="w-20 h-20 overflow-hidden rounded bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{item.name || item.title}</h3>
                  <p className="text-sm text-gray-500">{item.categoryName}</p>
                </div>
              </div>

              <div className="md:col-span-3 font-medium flex justify-center">
                ${item.price || item.pricing?.salePrice}
              </div>

              <div className="text-center text-2xl md:col-span-3">
                <button
                  onClick={() => removeItem(item._id)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <MdDeleteOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getLocalStorage } from "../localStorageUtils/localStorageUtils";
import { MdOutlineDelete } from "react-icons/md";
import {
  getCartFromStorage,
  removeItemFromCart,
  setCartToStorage,
} from "../CartUtils/CartUtils";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState(() => {
    const items = getLocalStorage("cart") || [];
    return items
      .filter((item) => item?.pricing && item?.inventory) // Filter out broken items
      .map((item) => ({
        ...item,
        quantity: typeof item.quantity === "number" ? item.quantity : 1,
      }));
  });

  const updateQuantity = (sku, change) => {
    const updatedItems = cartItems.map((item) =>
      item.inventory.sku === sku
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCartItems(updatedItems);
  };

  const removeItem = (sku) => {
    const updatedItems = cartItems.filter((item) => item.inventory.sku !== sku);
    setCartItems(updatedItems);
    setCartToStorage(updatedItems); // update localStorage
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item?.pricing?.salePrice || 0;
      const qty = item.quantity || 1;
      return total + price * qty;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200 hidden md:block">
              <div className="grid grid-cols-13 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-5">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">SKU</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-1 text-right">Subtotal</div>
                <div className="col-span-1 text-right">Delete</div>
              </div>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="px-4 sm:px-6 py-6 border-t border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-13 gap-4 items-center">
                  {/* Product */}
                  <div className="md:col-span-5 flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={`http://localhost:5000/${item.mainImage}`}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <div className="text-sm text-gray-500 space-y-1"></div>
                      <button className="text-gray-400 hover:text-red-500 mt-2 md:hidden">
                        <i className="fas fa-trash text-lg"></i>
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-sm md:text-base text-gray-900">
                    ${item?.pricing?.salePrice?.toFixed(2) ?? "N/A"}
                  </div>

                  {/* SKU */}
                  <div className="md:col-span-2 text-sm font-mono text-gray-600">
                    {item?.inventory?.sku ?? "N/A"}
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2">
                    <div className="flex items-center border border-gray-300 rounded-md w-fit">
                      <button
                        onClick={() => updateQuantity(item?.inventory?.sku, -1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-sm font-medium text-gray-900 border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item?.inventory?.sku, 1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="md:col-span-1 text-right font-medium text-gray-900">
                    $
                    {item?.pricing?.salePrice
                      ? (item.quantity * item.pricing.salePrice).toFixed(2)
                      : "0.00"}
                  </div>

                  {/* Delete */}
                  <div className="text-center text-xl">
                    <button
                      onClick={() => removeItem(item?.inventory?.sku)}
                      className="text-red-500 mt-2"
                    >
                      <MdOutlineDelete />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                Your cart is empty.
              </div>
            )}
          </div>
        </div>

        {/* Cart Totals */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Cart Totals
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  ${calculateSubtotal().toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 flex flex-col gap-1">
              <Link to="/checkoutForm">
                <button className="w-full bg-black text-white py-3 px-4 rounded font-medium hover:bg-gray-800 transition-colors">
                  Proceed To Checkout
                </button>
              </Link>
              <Link to="/shop">
                <button className="w-full border border-black text-black py-3 px-4 rounded font-medium hover:bg-gray-50 transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

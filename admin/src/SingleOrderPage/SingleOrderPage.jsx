import React, { useState } from "react";

const SingleProductPage = () => {
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [fulfillmentStatus, setFulfillmentStatus] = useState("Shipped");

  const orderItems = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      quantity: 2,
      price: 199.99,
      total: 399.98,
    },
    {
      id: 2,
      name: "Bluetooth Speaker",
      quantity: 1,
      price: 89.99,
      total: 89.99,
    },
    {
      id: 3,
      name: "USB-C Cable",
      quantity: 3,
      price: 24.99,
      total: 74.97,
    },
  ];

  const subtotal = 564.94;
  const shipping = 15.0;
  const tax = 45.2;
  const total = 625.14;

  const getStatusColor = (status, type) => {
    if (type === "payment") {
      switch (status) {
        case "Paid":
          return "bg-green-100 text-green-800";
        case "Pending":
          return "bg-yellow-100 text-yellow-800";
        case "Failed":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else {
      switch (status) {
        case "Processing":
          return "bg-blue-100 text-blue-800";
        case "Shipped":
          return "bg-purple-100 text-purple-800";
        case "Delivered":
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-sm text-gray-500 mt-1">Order #ORD-2024-001234</p>
          </div>

          {/* Payment & Fulfillment Status */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payment & Fulfillment Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Status */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Status
                </label>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      paymentStatus,
                      "payment"
                    )}`}
                  >
                    <i className="fas fa-credit-card mr-2"></i>
                    {paymentStatus}
                  </span>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Fulfillment Status */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Fulfillment Status
                </label>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      fulfillmentStatus,
                      "fulfillment"
                    )}`}
                  >
                    <i className="fas fa-truck mr-2"></i>
                    {fulfillmentStatus}
                  </span>
                  <select
                    value={fulfillmentStatus}
                    onChange={(e) => setFulfillmentStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Date
                  </label>
                  <p className="text-sm text-gray-900">March 15, 2024</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <p className="text-sm text-gray-900">John Michael Anderson</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-sm text-gray-900">+1 (555) 123-4567</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-sm text-gray-900">xyz@123@gmail.com</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <p className="text-sm text-gray-900">
                    1234 Oak Street, Apartment 5B
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <p className="text-sm text-gray-900">San Francisco</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <p className="text-sm text-gray-900">94102</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <p className="text-sm text-gray-900">India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="px-8 py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Item
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      Quantity
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Unit Price
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={`https://readdy.ai/api/search-image?query=modern%20electronic%20device%20product%20photography%20with%20clean%20white%20background%20minimal%20lighting%20professional%20studio%20setup%20high%20quality%20commercial%20product%20shot&width=48&height=48&seq=${item.id}&orientation=squarish`}
                              alt={item.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right text-sm text-gray-900">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-sm font-medium text-gray-900">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="max-w-md ml-auto space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tax</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;

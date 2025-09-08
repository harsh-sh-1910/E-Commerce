import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CheckoutFormPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    deliveryAddress: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  const [cartItems, setCartItems] = useState([]);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [modal, setModal] = useState({ open: false, type: "", message: "" });

  // Load cart on first render
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length > 0) {
      setCartItems(cart);
      setProduct(cart[0]);
      setQuantity(cart[0].quantity || 1);
    }
  }, []);

  // Save updated cart
  useEffect(() => {
    if (product) {
      const updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  }, [quantity, product]);

  const subtotal = product ? quantity * product.pricing.salePrice : 0;
  const tax = 12;
  const shipping = 12;
  const total = subtotal + tax + shipping;

  const handleQuantityChange = (isIncrement) => {
    setQuantity((prev) => {
      const newQty = isIncrement ? prev + 1 : prev > 1 ? prev - 1 : 1;
      return newQty;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRazorpayPayment = async () => {
    const amount = total;

    // Create Razorpay order
    const { data: order } = await axios.post("http://localhost:5000/payment/", {
      amount,
    });

    const token = localStorage.getItem("accessToken");
    let userId = null;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        userId = decoded.id || decoded._id || decoded.userId;
      } catch (error) {
        console.error("Invalid token", error);
      }
    }

    const options = {
      key: "rzp_test_3WbPzeexWFf3Wx",
      amount: order.amount,
      currency: order.currency,
      name: "X-Store",
      description: "Test Transaction",
      order_id: order.id,
      handler: async function (response) {
        // ✅ Only verify payment & store order in DB
        const res = await axios.post("http://localhost:5000/payment/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (res.data.success) {
          // Store order in your DB
          const orderDataForDB = {
            payment: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              status: "Paid",
              method: "Razorpay",
            },
            fullfillment: {
              status: "Pending",
              method: "Standard",
            },
            customerInfo: {
              userId: userId,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phNo: formData.phone,
              address: formData.deliveryAddress,
              city: formData.city,
              country: formData.country,
              postalCode: formData.postalCode,
            },
            orderDetail: [
              {
                name: product.name,
                quantity: quantity,
                price: product.pricing.salePrice,
                totalPrice: product.pricing.salePrice * quantity,
              },
            ],
            summary: {
              subTotal: subtotal,
              shipping: shipping,
              tax: tax,
              grandTotal: total,
            },
            orderNote: "",
            orderNumber: `ORD-${Date.now()}`,
          };

          try {
            const orderResponse = await axios.post(
              "http://localhost:5000/order/",
              orderDataForDB
            );
            console.log("Order stored:", orderResponse.data);

            // Clear cart and form
            localStorage.removeItem("cart");
            setCartItems([]);
            setProduct(null);
            setQuantity(1);
            setFormData({
              firstName: "",
              lastName: "",
              country: "",
              deliveryAddress: "",
              city: "",
              postalCode: "",
              phone: "",
              email: "",
            });

            setModal({
              open: true,
              type: "success",
              message: "✅ Payment successful, Order placed!",
            });
          } catch (error) {
            console.error("Failed to store order:", error);
            setModal({
              open: true,
              type: "error",
              message: "❌ Order failed to store after payment.",
            });
          }
        } else {
          setModal({
            open: true,
            type: "error",
            message: "❌ Payment verification failed.",
          });
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-xl">
        No product in cart. Please add a product to proceed to checkout.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 py-8">
        {/* Billing Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Billing Details
          </h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {["firstName", "lastName"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field === "firstName" ? "First Name *" : "Last Name *"}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                    placeholder={`Enter your ${
                      field === "firstName" ? "first" : "last"
                    } name`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              ))}
            </div>

            {[
              ["country", "Country / Region *"],
              ["deliveryAddress", "Delivery Address *"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                ["city", "Town / City *"],
                ["postalCode", "Postal Code *"],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              ))}
            </div>

            {[
              ["phone", "Phone *", "tel"],
              ["email", "Email Address *", "email"],
            ].map(([name, label, type]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            ))}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:top-8 h-fit">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-200 mb-6">
              Your Order
            </h3>

            <div className="flex items-start space-x-4 mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={`http://localhost:5000/${product.mainImage}`}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-500 mb-3">
                  Color: {product.selectedColor}
                </p>
                <div className="flex items-center space-x-3 mb-2">
                  <button
                    onClick={() => handleQuantityChange(false)}
                    className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="font-medium text-gray-900">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(true)}
                    className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${product.pricing.salePrice?.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">
                  ${shipping.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              type="submit"
              onClick={handleRazorpayPayment}
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors mt-4"
            >
              Place Order
            </button>
            <div className="text-xs text-gray-500 mt-4 text-center">
              Guarantee Safe and Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFormPage;

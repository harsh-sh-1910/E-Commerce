import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000";

const UserAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  // Fetch addresses from backend on component mount
  useEffect(() => {
    axios
      .get(`${API_URL}/address`, { withCredentials: true })
      .then((res) => setAddresses(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const setDefaultAddress = async (id) => {
    try {
      await axios.put(
        `${API_URL}/address/${id}/default`,
        {},
        { withCredentials: true }
      );

      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          isDefault: addr._id === id,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removeAddress = async (id) => {
    try {
      await axios.delete(`${API_URL}/address/${id}`, {
        withCredentials: true,
      });
      setAddresses(addresses.filter((addr) => addr._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addNewAddress = async (e) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      // Parse if it was stored as JSON
      try {
        token = JSON.parse(token);
      } catch {
        // Already a raw string
      }

      // Decode the token to get user info
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded.userId || decoded._id; // depends on your backend token structure

      const payload = { ...formData, userId }; // include id from token

      const res = await axios.post(`${API_URL}/address`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses([...addresses, res.data.data]);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6">Your Addresses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!showForm ? (
          <div
            onClick={() => setShowForm(true)}
            className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="text-4xl font-light text-gray-400">+</div>
            <div className="mt-2 text-lg font-medium text-gray-600">
              Add address
            </div>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm col-span-1 sm:col-span-2 lg:col-span-3">
            <h3 className="text-lg font-bold mb-4">Add New Address</h3>
            <form
              onSubmit={addNewAddress}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                name="zip"
                placeholder="PIN Code"
                value={formData.zip}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                name="street"
                placeholder="Flat, House no., Building, Company, Apartment"
                value={formData.street}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 sm:col-span-2"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex gap-4 mt-4 sm:col-span-2">
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Add Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border border-gray-300 rounded-lg p-4 flex flex-col justify-between bg-white shadow-sm"
          >
            {addr.isDefault && (
              <div className="text-sm text-gray-500 mb-2">
                Default: <span className="font-semibold">Xstore</span>
              </div>
            )}
            <div className="mb-4">
              <div className="font-bold">
                {addr.firstName} {addr.lastName}
              </div>
              <div>{addr.street}</div>
              <div>
                {addr.city}, {addr.state} {addr.zip}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Phone number: {addr.phone}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-blue-600">
              <button
                onClick={() => removeAddress(addr._id)}
                className="hover:underline"
              >
                Remove
              </button>
              {!addr.isDefault && (
                <>
                  <span>|</span>
                  <button
                    onClick={() => setDefaultAddress(addr._id)}
                    className="hover:underline"
                  >
                    Set as Default
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAddress;

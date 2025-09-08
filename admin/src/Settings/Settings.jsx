import React, { useState } from "react";

const Settings = () => {
  const [formData, setFormData] = useState({
    storeName: "My Store",
    email: "admin@example.com",
    currency: "INR",
    language: "English",
    timezone: "Asia/Kolkata",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send data to backend
    console.log("Settings Saved:", formData);
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 max-w-3xl"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium">Store Name</label>
          <input
            type="text"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium">Timezone</label>
          <input
            type="text"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="e.g., Asia/Kolkata"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;

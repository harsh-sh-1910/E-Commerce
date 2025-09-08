import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UpdateUser = () => {
  const URL = "https://e-commerce-4pcq.onrender.com";
  const [formData, setFormData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState({
    fName: false,
    lName: false,
    email: false,
    phone: false,
  });
  const [userId, setUserId] = useState("");

  const addMessage = (text) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 3000);
  };

  // --- Fetch user details by ID
  const fetchUser = async (id) => {
    try {
      const res = await axios.get(`${URL}/auth/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFormData({ ...res.data, password: "********" });
      setInitialData({ ...res.data, password: "********" });
    } catch (err) {
      addMessage(err.response?.data?.error || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  // --- Decode token and load user on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      addMessage("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded.id) {
        addMessage("Invalid token");
        setLoading(false);
        return;
      }
      setUserId(decoded.id);
      fetchUser(decoded.id);
    } catch (err) {
      addMessage("Failed to decode token");
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFields = [];
    Object.keys(formData).forEach((key) => {
      if (key !== "password" && formData[key] !== initialData[key]) {
        updatedFields.push(key);
      }
    });
    const { password, ...dataToSubmit } = formData;

    if (updatedFields.length > 0) {
      try {
        await axios.put(`${URL}/auth/${userId}`, dataToSubmit, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        addMessage(`${updatedFields.join(", ")} updated successfully`);
        setInitialData(formData);
      } catch (err) {
        addMessage(err.response?.data?.error || "Update failed");
      }
    } else {
      addMessage("No changes to update");
    }

    setEditable({ fName: false, lName: false, email: false, phone: false });
  };

  const toggleField = (field) => {
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading user data...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">User not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="bg-blue-100 text-blue-800 p-2 mb-2 rounded"
        >
          {msg.text}
        </div>
      ))}

      <h2 className="text-xl font-semibold mb-4">Update User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["uName", "fName", "lName", "email", "phone"].map((field) => (
          <div key={field}>
            <label className="block font-medium mb-1 capitalize">{field}</label>
            <div className="relative">
              <input
                type="text"
                name={field}
                value={formData[field]}
                disabled={field === "uName" || !editable[field]}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded pr-16 ${
                  field === "uName" ? "bg-gray-100" : ""
                }`}
              />
              {field !== "uName" && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-500"
                  onClick={() => toggleField(field)}
                >
                  {editable[field] ? "Cancel" : "Edit"}
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;

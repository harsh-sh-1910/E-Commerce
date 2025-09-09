import React, { useState, useEffect } from "react";
import axios from "axios";

const DealPage = () => {
  const URL = "https://e-commerce-4pcq.onrender.com";
  // const URL = "http://localhost:5000";
  const [formData, setFormData] = useState({
    productName: "", // This will store the product ID (ObjectId)
    startDateTime: "",
    endDateTime: "",
    discount: "",
  });

  const [productOptions, setProductOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  // ✅ Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${URL}/product`);

        setProductOptions(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // 🔍 Filter & sort products
  const filteredProducts = productOptions
    .filter((product) =>
      product.name.toLowerCase().includes(productSearch.trim().toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // 📥 Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Product selection: store product ID (not name)
  const handleProductSelect = (product) => {
    setFormData((prev) => ({ ...prev, productName: product._id }));
    setIsProductDropdownOpen(false);
    setProductSearch("");
    if (errors.productName) {
      setErrors((prev) => ({ ...prev, productName: "" }));
    }
  };

  // 🧪 Form validation
  const validateForm = () => {
    const newErrors = {};
    const { productName, startDateTime, endDateTime, discount } = formData;

    if (!productName) newErrors.productName = "Product selection is required";
    if (!startDateTime)
      newErrors.startDateTime = "Start date and time is required";
    if (!endDateTime) newErrors.endDateTime = "End date and time is required";

    if (!discount) {
      newErrors.discount = "Discount percentage is required";
    } else {
      const discountValue = parseFloat(discount);
      if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
        newErrors.discount = "Discount must be between 0 and 100";
      }
    }

    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      if (end <= start) {
        newErrors.endDateTime = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setShowSuccess(false);

    try {
      const dealData = {
        productName: formData.productName,
        time: {
          start: new Date(formData.startDateTime),
          end: new Date(formData.endDateTime),
        },
        discount: parseFloat(formData.discount),
      };

      const response = await axios.post(`${URL}/deal/`, dealData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);
      setShowSuccess(true);
      setFormData({
        productName: "",
        startDateTime: "",
        endDateTime: "",
        discount: "",
      });
      console.log("Deal Data:", {
        productName: formData.productName,
        time: {
          start: new Date(formData.startDateTime),
          end: new Date(formData.endDateTime),
        },
        discount: parseFloat(formData.discount),
      });
    } catch (error) {
      console.error("Error creating deal:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedProductName = () => {
    const selected = productOptions.find((p) => p._id === formData.productName);
    return selected ? selected.name : "Select product";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Create New Deal
          </h1>
          <div className="h-px bg-gray-200 mb-8" />

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-3"></i>
                <p className="text-green-700 font-medium">
                  Deal created successfully!
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIsProductDropdownOpen(!isProductDropdownOpen)
                  }
                  className={`w-full px-4 py-3 text-sm text-left border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors cursor-pointer ${
                    errors.productName ? "border-red-300" : "border-gray-300"
                  } ${
                    formData.productName ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {getSelectedProductName()}
                  <i
                    className={`fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform ${
                      isProductDropdownOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>

                {isProductDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    <div className="p-2 border-b border-gray-200 bg-gray-50">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search product..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded outline-none"
                      />
                    </div>
                    {filteredProducts.length ? (
                      filteredProducts.map((product) => (
                        <button
                          key={product._id}
                          type="button"
                          onClick={() => handleProductSelect(product)}
                          className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 focus:bg-gray-50 cursor-pointer whitespace-nowrap"
                        >
                          {product.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.productName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.productName}
                </p>
              )}
            </div>

            {/* Start/End Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.startDateTime ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.startDateTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startDateTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.endDateTime ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.endDateTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.endDateTime}
                  </p>
                )}
              </div>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="discount"
                  id="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className={`w-full px-4 py-3 pr-12 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.discount ? "border-red-300" : "border-gray-300"
                  }`}
                  style={{
                    MozAppearance: "textfield",
                    WebkitAppearance: "none",
                  }}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  %
                </span>
              </div>
              {errors.discount && (
                <p className="mt-1 text-sm text-red-600">{errors.discount}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Creating
                    Deal...
                  </div>
                ) : (
                  "Create Deal"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DealPage;

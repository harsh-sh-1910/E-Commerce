import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const URL = "https://e-commerce-4pcq.onrender.com";
  // const URL = "http://localhost:5000";
  const [currentPage, setCurrentPage] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    uName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?[\d\s\-\(\)]{10,}$/.test(phone);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (currentPage === "register") {
      if (!formData.uName.trim()) newErrors.uName = "Username is required";
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!validatePhone(formData.phone))
        newErrors.phone = "Invalid phone number";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!validateEmail(formData.email))
        newErrors.email = "Invalid email";
    }
    if (currentPage === "login" && !formData.uName.trim())
      newErrors.uName = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (currentPage === "register" && formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (currentPage === "register") {
        const payload = {
          uName: formData.uName,
          fName: formData.firstName,
          lName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        };
        const res = await axios.post(`${URL}/auth/`, payload);
        alert(res.data.message || "Registration successful!");
        setCurrentPage("login");
        setFormData({
          uName: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
        });
      } else {
        const payload = {
          uName: formData.uName,
          password: formData.password,
        };
        const res = await axios.post(`${URL}/auth/login`, payload, {
          withCredentials: true,
        });

        const accessToken = res.data.accessToken;
        if (!accessToken) {
          setApiError("Login failed: no token provided");
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(accessToken);

        // Store token securely (localStorage used here for example)
        localStorage.setItem("accessToken", accessToken);

        alert("Login successful!");

        if (decoded) navigate("/");
        else navigate("/login");
      }
    } catch (err) {
      console.error("Login/Register error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setApiError(err.response.data.error);
      } else {
        setApiError("Server error. Please try again.");
      }
    }
    setLoading(false);
  };

  // ✅ Handle Google Login success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await axios.post(`${URL}/auth/google-login`, { token });

      const accessToken = res.data?.accessToken;
      console.log(accessToken);

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        alert("Google login successful!");
        navigate("/");
      } else {
        setApiError("Google login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setApiError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8">
              {/* Toggle login/register */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
                <button
                  onClick={() => setCurrentPage("login")}
                  disabled={loading}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md cursor-pointer ${
                    currentPage === "login"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setCurrentPage("register")}
                  disabled={loading}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md cursor-pointer ${
                    currentPage === "register"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* API error message */}
              {apiError && (
                <div className="mb-4 text-red-600 text-center text-sm font-semibold">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.uName}
                    onChange={(e) => handleInputChange("uName", e.target.value)}
                    className={`w-full pl-3 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.uName ? "border-red-500" : "border-gray-300"
                    } ${
                      formData.uName && !errors.uName ? "border-green-500" : ""
                    }`}
                    placeholder="Enter username"
                    disabled={loading}
                    autoComplete="username"
                  />
                  {errors.uName && (
                    <p className="text-sm text-red-600 mt-1">{errors.uName}</p>
                  )}
                </div>

                {/* Register-only additional fields */}
                {currentPage === "register" && (
                  <>
                    {/* First/Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          className={`w-full pl-3 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.firstName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter first name"
                          disabled={loading}
                          autoComplete="given-name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          className={`w-full pl-3 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.lastName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter last name"
                          disabled={loading}
                          autoComplete="family-name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400 text-sm" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter email"
                          disabled={loading}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400 text-sm" />
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter phone number"
                          disabled={loading}
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 text-sm" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter password"
                      disabled={loading}
                      autoComplete={
                        currentPage === "login"
                          ? "current-password"
                          : "new-password"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      tabIndex={-1}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-gray-400 text-sm hover:text-gray-600" />
                      ) : (
                        <FaEye className="text-gray-400 text-sm hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 font-medium ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : currentPage === "login"
                    ? "Sign In"
                    : "Create Account"}
                </button>
                {/* ✅ Google Login Button */}
                {currentPage === "login" && (
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setApiError("Google Login Failed")}
                      size="large"
                      width="100%"
                      // theme="filled_blue"
                    />
                  </div>
                )}
              </form>

              {/* Toggle between login/register */}
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-600">
                  {currentPage === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                </span>
                <button
                  disabled={loading}
                  type="button"
                  onClick={() =>
                    setCurrentPage(
                      currentPage === "login" ? "register" : "login"
                    )
                  }
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {currentPage === "login" ? "Register here" : "Sign in here"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;

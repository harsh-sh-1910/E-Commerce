import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaRegUser } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { BsBarChartFill, BsHeart } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { HiHome, HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GiSoundWaves } from "react-icons/gi";
import { IoIosArrowForward } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { BsCameraVideo } from "react-icons/bs";
import { RiCellphoneLine } from "react-icons/ri";
import { RiComputerLine } from "react-icons/ri";
import { PiCampfireFill, PiMusicNotesSimpleBold } from "react-icons/pi";
import { PiDeviceTabletSpeaker } from "react-icons/pi";
import { PiSpeakerHighLight } from "react-icons/pi";
import { PiTelevisionBold } from "react-icons/pi";
import { RiHeadphoneFill } from "react-icons/ri";
import { LuRadioReceiver } from "react-icons/lu";
import { LuBoomBox } from "react-icons/lu";
import { Link, Links, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import axios from "axios";
import {
  getCartFromStorage,
  removeItemFromCart,
  setCartToStorage,
} from "../CartUtils/CartUtils";

const Header = () => {
  const URL = "https://e-commerce-4pcq.onrender.com";
  // const URL = "http://localhost:5000";
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [shopData, setShopData] = useState(false);
  const [blogData, setBlogData] = useState(false);
  const [audioData, setAudioData] = useState(false);
  const [cameraData, setCameraData] = useState(false);
  const [computerData, setComputerData] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [setFav, setShowFav] = useState(false);
  const [setCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Our Story", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Favourities", path: "/wishlistPage" },
    { name: "Account", path: "/login" },
    { name: "My Cart", path: "/checkout" },
  ];

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productOptions, setProductOptions] = useState([]);

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  console.log(showAll);
  const products = [
    {
      category: "Audio",
      name: "HomePod",
      price: "$299.00",
      image: "/header-audio.jpg",
    },
    {
      category: "iPad & Tablets",
      name: "JBL Go 2",
      price: "$38.48",
      image: "/jbl.jpg",
    },
    {
      category: "Smart Home",
      name: "NS-APMWH2",
      price: "$120.00",
      image: "/home-pod.jpg",
    },
  ];
  const toggleForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);
  const openFav = () => setShowFav(true);
  const CloseFav = () => setShowFav(false);
  const openCart = () => setShowCart(true);
  const CloseCart = () => setShowCart(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    closeForm();
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log(token);

    setIsLoggedIn(!!token); // true if token exists
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };
  const handleRemoveFromCart = (id) => {
    const updated = removeItemFromCart(id);
    setCartItems(updated); // assuming setCartItems is used here too
  };
  useEffect(() => {
    const stored = getCartFromStorage();
    setCartItems(stored);
  }, []);

  useEffect(() => {
    // Initial cart load
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(stored);

    // Listen to custom events
    const updateCart = () => {
      const updated = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(updated);
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("toggleCartOpen", openCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("toggleCartOpen", openCart);
    };
  }, []);
  const handleRemoveFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    setWishlist(updatedWishlist); // update your state
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // persist in localStorage
  };
  useEffect(() => {
    const updateWishlist = () => {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(savedWishlist);
    };

    // Initial load
    updateWishlist();

    // Listen to updates
    window.addEventListener("wishlistUpdated", updateWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlist);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${URL}/category`);
        setCategories(res.data); // Expecting: [{ name, image, count, ... }]
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);
  const searchProduct = [
    "Accessories",
    "Smartphones",
    "Electronics",
    "Speakers",
    "Laptops",
  ];
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
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % searchProduct.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <header className="w-full h-[22.5vh]">
        <div className="flex w-full px-5 pt-5 pb-2 justify-between xl:px-12">
          <Link
            to="/"
            className="w-24 sm:w-28 md:w-32 xl:w-40 pt-2 cursor-pointer"
          >
            <img
              src="Logo.jpeg"
              alt="Site Logo"
              className="w-full object-contain"
            />
          </Link>

          <div className="flex items-center gap-5">
            <div className="border-1 rounded-xl items-center gap-2 p-2 border-gray-200 xl:flex hidden hover:bg-gray-100 transition-all duration-300">
              <div className="text-[#00796B] text-4xl">
                <div>
                  <FaPhoneAlt />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Need help? Call us:</p>
                <p className=""> +1 1800 212 1234</p>
              </div>
            </div>
            {/* signin toggler */}
            <div className="relative">
              <div
                onClick={handleClick}
                className="flex flex-col items-center cursor-pointer"
              >
                <FaRegUser className="text-xl" />
                <p className="hidden xl:block">
                  {isLoggedIn ? "My Account" : "Sign In"}
                </p>
              </div>
            </div>

            {/* wishlist  */}
            <div className="flex flex-col items-center cursor-pointer relative">
              {/* Click Icon to Open Panel */}
              <div onClick={openFav} className="flex flex-col items-center">
                <FaRegHeart className="text-xl" />
                <p className="hidden xl:block">Favourities</p>
              </div>

              {/* Sliding Comparison Panel */}
              <div
                className={`fixed top-0 right-0 h-screen w-[350px] bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out ${
                  setFav ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-4 relative ">
                  <FaRegHeart className="w-5 h-5" />
                  <h2 className="text-gray-600 font-medium text-lg">
                    Favourities
                  </h2>

                  {/* Close Button */}
                  <span
                    className="text-3xl cursor-pointer absolute right-1 top-1"
                    onClick={CloseFav}
                    tabIndex={0}
                    role="button"
                    aria-label="Close Sign In"
                  >
                    <IoClose />
                  </span>
                </div>

                {/* Divider */}
                <hr className="mb-6" />

                {/* Message */}
                <div className="flex flex-col justify-between h-full pb-15">
                  <div className="text-gray-500 text-center mb-6">
                    {wishlist.length > 0 ? (
                      <div className="grid gap-4">
                        {wishlist.map((product) => (
                          <div
                            key={product._id}
                            className="bg-white shadow rounded py-4 px-8 flex gap-5 relative"
                          >
                            {/* ❌ Remove icon */}
                            <button
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                              onClick={() =>
                                handleRemoveFromWishlist(product._id)
                              }
                            >
                              <FaTimes />
                            </button>

                            <div className="w-20">
                              <img src={product.image} alt={product.title} />
                            </div>
                            <div className="flex flex-col items-start gap-2">
                              <p className="text-md">{product.title}</p>
                              <p>₹{product.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center">
                        No product in your favorites
                      </div>
                    )}
                  </div>

                  {/* Bottom Buttons */}
                  <div className="flex flex-col gap-5">
                    <button
                      className="px-8 py-3 bg-teal-600 rounded text-white"
                      onClick={CloseFav}
                    >
                      <Link to="/wishlistPage">View WishList</Link>
                    </button>
                    <button
                      className="px-8 py-3 bg-black rounded text-white"
                      onClick={CloseFav}
                    >
                      <Link to="/shop">Continue Shopping</Link>
                    </button>
                  </div>
                </div>

                {/* Button */}
              </div>
            </div>
            {/* cart toggler */}
            {/* Cart Icon Trigger */}
            <div
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center cursor-pointer relative"
            >
              <BsCart3 className="text-xl" />
              <p className="hidden xl:block">My Cart</p>
            </div>

            {/* Sliding Cart Panel */}
            <div
              className={`fixed top-0 right-0 h-screen w-[350px] bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out ${
                isCartOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex items-center gap-2 mb-4 relative">
                <BsCart3 className="w-5 h-5" />
                <h2 className="text-gray-600 font-medium text-lg">Cart</h2>
                <span
                  className="text-3xl cursor-pointer absolute right-1 top-1"
                  onClick={() => setIsCartOpen(false)}
                >
                  <IoClose />
                </span>
              </div>

              <hr className="mb-6" />

              {/* Cart Items */}
              <div className="flex flex-col justify-between h-full pb-15">
                <div className="text-gray-500 text-center mb-6">
                  {cartItems.length > 0 ? (
                    <div className="grid gap-4">
                      {cartItems.map((product, index) => (
                        <div
                          key={index}
                          className="relative bg-white shadow rounded py-4 px-8 flex gap-5"
                        >
                          {/* ❌ Delete icon */}
                          <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                            onClick={() => handleRemoveFromCart(product._id)}
                          >
                            <FaTimes />
                          </button>

                          <div className="w-20">
                            <img
                              src={`${URL}/${product.mainImage}`}
                              alt={product.name}
                            />
                          </div>
                          <div className="flex flex-col items-start gap-2">
                            <p className="text-md">{product.name}</p>
                            <p>${product.pricing?.salePrice}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-black text-center">
                      No product in your Cart
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col gap-5">
                  <button
                    className="px-8 py-3 bg-teal-600 rounded text-white"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <Link to="/checkout">View Cart</Link>
                  </button>
                  <button
                    className="px-8 py-3 bg-black rounded text-white"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <Link to="/shop">Continue Shopping</Link>
                  </button>
                </div>
              </div>
            </div>

            {/* menu */}
            <div className="relative xl:hidden">
              {/* Menu Icon */}
              <LuMenu
                className="text-2xl cursor-pointer"
                onClick={() => setIsMenuOpen(true)}
              />

              {/* Slide-in Sidebar */}
              <div
                className={`fixed top-0 right-0 h-screen w-[350px] bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out ${
                  isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {/* Close Button */}
                <IoClose
                  className="text-3xl absolute right-6 top-6 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                />

                {/* Logo */}
                <div className="text-center mt-4 mb-6 border-b-2 pb-5 px-15 border-gray-300">
                  <img src="./Logo.jpeg" alt="" className="w-full h-full" />
                </div>

                {/* Menu Links */}
                <div>
                  {menuLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-3 border-b border-gray-200 text-md font-medium text-gray-700 hover:text-black"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="xl:w-[44%] px-2 sm:block w-full xl:absolute top-6 left-60">
            <div className="flex border rounded-md overflow-hidden w-full border-gray-300">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search For"
                  className="px-4 py-2 w-full outline-none"
                />

                {/* Animated words wrapper */}
                <div className="absolute left-[96px] top-[17.5px] w-[100px] -translate-y-[10px] h-[24px] leading-[24px] overflow-hidden text-gray-500 pointer-events-none">
                  {searchProduct.map((item, i) => (
                    <span
                      key={i}
                      className={`absolute w-full transition-transform duration-700 ease-in-out
                ${i === index ? "translate-y-0 opacity-100" : ""}
                ${i < index ? "-translate-y-full opacity-0" : ""}
                ${i > index ? "translate-y-full opacity-0" : ""}
              `}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <button className="bg-teal-600 text-white px-4 flex items-center justify-center cursor-pointer">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
        <div className="px-12 mt-2 absolute top-15 left-52 xl:block hidden">
          <ul className="flex gap-4 text-sm text-gray-600 flex-wrap">
            <Link to="/shop" className="hover:text-teal-600 cursor-pointer">
              Bluetooth
            </Link>
            <Link to="/shop" className="hover:text-teal-600 cursor-pointer">
              Earphones
            </Link>
            <Link to="/shop" className="hover:text-teal-600 cursor-pointer">
              Laptop
            </Link>
            <Link to="/shop" className="hover:text-teal-600 cursor-pointer">
              Controller
            </Link>
            <Link to="/shop" className="hover:text-teal-600 cursor-pointer">
              Smartphone
            </Link>
          </ul>
        </div>

        <div className="bg-[#e6f6f6] px-12 mt-2 mb-2 xl:flex hidden h-15">
          <div className="flex items-center justify-between w-full">
            {/* Left - All Departments */}
            <div className="flex gap-20">
              <div
                className="flex items-center gap-2 relative" // ✅ keep relative here
                onMouseEnter={() => setShowAll(true)}
                onMouseLeave={() => setShowAll(false)}
              >
                <div className="relative group inline-flex items-center">
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-white px-5 py-2 rounded-md z-10 transition-colors duration-300 group-hover:bg-[#008080] group-hover:text-white"
                  >
                    <HiOutlineSquares2X2 className="text-3xl bg-[#008080] text-white p-[4px] rounded-md" />
                    <div className="relative h-6 w-36 overflow-hidden">
                      <span className="transition-transform duration-400 ease-out">
                        All Departments
                      </span>
                    </div>
                    <MdKeyboardArrowDown className="transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                </div>

                <div
                  className={`absolute top-[-15%] left-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 transition-all duration-400 transform
    ${showAll ? "opacity-100 " : "opacity-0 pointer-events-none"}
  `}
                >
                  <ul className="absolute top-[38px] left-0 bg-white mt-2 rounded-lg w-62">
                    <Link to="/shop">
                      {" "}
                      <li
                        className="flex gap-5 px-5 py-4 text-nowrap border-b-1 border-gray-300 justify-evenly"
                        onMouseEnter={() => setAudioData(true)}
                        onMouseLeave={() => setAudioData(false)}
                      >
                        <span className="">
                          <GiSoundWaves className="mt-[3px] text-xl" />
                        </span>
                        <span className="text-md">Audio Electronics</span>
                        <span className="">
                          <IoIosArrowForward className="mt-1" />
                        </span>
                        {audioData && (
                          <div className="absolute flex gap-10 px-6 py-10 bg-white w-[70vw] h-[70vh] top-[0px] rounded-xl left-62">
                            {/* Left Sidebar */}
                            <div className="w-full xl:w-1/4">
                              <h2 className="text-lg font-semibold mb-2 flex items-center gap-1">
                                All Catgeories
                                <span className="bg-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                                  HOT DEAL
                                </span>
                              </h2>
                              <ul className="space-y-2 text-sm text-gray-700 mb-6 text-nowrap">
                                {categories.slice(0, 5).map((cat, idx) => {
                                  const discount =
                                    Math.floor(Math.random() * 50) + 10; // random 10–59%
                                  return (
                                    <li
                                      key={idx}
                                      className="hover:underline cursor-pointer"
                                    >
                                      {discount}% off on {cat.name}
                                    </li>
                                  );
                                })}
                              </ul>

                              <h2 className="text-lg font-semibold mb-2">
                                Campaigns
                              </h2>
                              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                                <li className="hover:underline">
                                  {Math.floor(Math.random() * 50) + 10}% off and
                                  Free Deliveries
                                </li>
                                <li className="hover:underline">
                                  {Math.floor(Math.random() * 50) + 10}% off and
                                  Free Returns
                                </li>
                              </ul>
                              <Link to="/shop">
                                <button className="px-5 py-2 rounded-md border border-teal-600 text-teal-600 hover:bg-teal-50 transition">
                                  All Campaigns →
                                </button>
                              </Link>
                            </div>

                            {/* Product of the Week Section */}
                            <div className="w-full xl:w-3/4">
                              <h2 className="text-xl font-semibold mb-6">
                                Product of The{" "}
                                <span className="underline">Week</span>
                              </h2>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-white p-4 rounded-xl shadow-sm text-center flex flex-col items-center"
                                  >
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="h-40 object-contain mb-4"
                                    />
                                    <p className="text-sm text-gray-500">
                                      {item.category}
                                    </p>
                                    <h3 className="text-lg font-semibold">
                                      {item.name}
                                    </h3>
                                    <div className="text-green-600 text-sm mb-1">
                                      ★★★★★
                                    </div>
                                    <p className="text-md font-medium">
                                      {item.price}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    </Link>
                    <Link to="/shop">
                      <li
                        className="flex gap-5 px-5 justify-evenly py-4 text-nowrap border-b-1 border-gray-300"
                        onMouseEnter={() => setCameraData(true)}
                        onMouseLeave={() => setCameraData(false)}
                      >
                        <span>
                          <BsCameraVideo className="mt-[3px] text-lg" />
                        </span>
                        <span className="text-md px-[3px]">Camera & Drone</span>
                        <span className="">
                          <IoIosArrowForward className="mt-1 " />
                        </span>
                        {cameraData && (
                          <div className="absolute bg-white px-6 py-10 space-y-5 top-[0px] w-[80vw] left-62 h-[75vh] overflow-auto scroll-smooth no-scrollbar rounded-xl">
                            {/* Top Section - Blog Cards and Promo Banner */}
                            <div className="flex gap-5">
                              <div>
                                {" "}
                                <div className="flex gap-5">
                                  {/* Blog Card 1 */}
                                  <div className="rounded-xl overflow-hidden shadow-sm border">
                                    <img
                                      src="/article-01.jpg"
                                      alt="Blog 1"
                                      className="w-full h-56 object-cover"
                                    />
                                    <div className="p-4">
                                      <span className="text-xs font-medium text-white bg-emerald-700 px-2 py-1 rounded">
                                        Audio Electronics
                                      </span>
                                      <h3 className="mt-4 text-lg font-semibold">
                                        Announcing the new Fitbits Charge 6smart
                                        Fitness
                                      </h3>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Recently, I was invited by Nintendo of
                                        Canada to attend a very
                                      </p>
                                    </div>
                                  </div>
                                  {/* Blog Card 2 */}
                                  <div className="rounded-xl overflow-hidden shadow-sm border">
                                    <img
                                      src="/article-02.jpg"
                                      alt="Blog 2"
                                      className="w-full h-56 object-cover"
                                    />
                                    <div className="p-4">
                                      <span className="text-xs font-medium text-white bg-emerald-700 px-2 py-1 rounded">
                                        Audio Electronics
                                      </span>
                                      <h3 className="mt-4 text-lg font-semibold">
                                        Your Conversion Rate on Amazon
                                      </h3>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Recently, I was invited by Nintendo of
                                        Canada to attend a very
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {/* Bottom Section - Category Links */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10  pt-6">
                                  {/* Home Appliances */}
                                  <div className="ps-5">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                                      <HiHome className="text-xl" /> Home
                                      Appliances
                                    </h3>
                                    <ul className="mt-3 text-gray-700 space-y-1 text-sm">
                                      <li>Refrigerators</li>
                                      <li>Washing Machine</li>
                                      <li>Smart Home</li>
                                      <li>Security Device</li>
                                      <li className="text-black font-medium hover:underline cursor-pointer">
                                        View All Items →
                                      </li>
                                    </ul>
                                  </div>

                                  {/* Audio Electronics */}
                                  <div>
                                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                                      <PiMusicNotesSimpleBold className="text-xl" />{" "}
                                      Audio Electronics
                                    </h3>
                                    <ul className="mt-3 text-gray-700 space-y-1 text-sm">
                                      <li>Gaming Devices</li>
                                      <li>TVs and Avs</li>
                                      <li>Wearable Technology</li>
                                      <li>iPads and Tablets</li>
                                      <li className="text-black font-medium hover:underline cursor-pointer">
                                        View All Items →
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              {/* Promo Banner */}
                              <div className="relative rounded-xl overflow-hidden">
                                <img
                                  src="/Banner-9.jpeg"
                                  alt="Promo"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-6 left-6 text-white">
                                  <h2 className="text-2xl font-bold">
                                    Speakers
                                  </h2>
                                  <h1 className="text-4xl font-extrabold">
                                    45% Flat
                                  </h1>
                                  <p className="text-sm mt-1">
                                    On Selected Brands
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    </Link>
                    <Link to="/shop">
                      <li
                        className="flex gap-3 px-5 py-4 text-nowrap border-b-1 border-gray-300 justify-between"
                        onMouseEnter={() => setComputerData(true)}
                        onMouseLeave={() => setComputerData(false)}
                      >
                        <span className="flex gap-4">
                          <span>
                            <RiComputerLine className="mt-[3px] text-lg" />
                          </span>
                          <span className="text-md flex ml-3">Computers</span>
                        </span>
                        <span className="">
                          <IoIosArrowForward className="mt-1" />
                        </span>
                        {computerData && (
                          <div className="flex flex-col lg:flex-row items-start justify-between ps-5 py-16 gap-10 absolute w-[50vw] top-0 left-62 bg-white rounded-xl">
                            {/* Left Side - Categories */}
                            <div className="grid grid-cols-2 gap-10 flex-1">
                              {/* Map through parent categories */}
                              {categories.slice(0, 4).map((parent, idx) => (
                                <div key={idx}>
                                  {/* Parent Heading */}
                                  <h3 className="font-semibold text-lg text-gray-900 border-b-2 border-teal-500 inline-block mb-3">
                                    {parent.name}
                                  </h3>

                                  {/* Child Categories (only 3, & replaced with line break) */}
                                  <ul className="space-y-2 text-gray-700">
                                    {parent.children &&
                                    parent.children.length > 0 ? (
                                      parent.children
                                        .slice(0, 2)
                                        .map((child, i) => (
                                          <li
                                            key={i}
                                            className="hover:text-teal-600 hover:underline cursor-pointer transition-colors"
                                          >
                                            {child.name
                                              .split("&")
                                              .map((part, idx2) => (
                                                <span
                                                  key={idx2}
                                                  className="block"
                                                >
                                                  {part.trim()}
                                                </span>
                                              ))}
                                          </li>
                                        ))
                                    ) : (
                                      <li className="text-gray-400 italic">
                                        No subcategories
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              ))}
                            </div>

                            {/* Right Side - Image */}
                            <div className="relative flex-1 flex justify-center items-center">
                              <img
                                src="/header-xbox.jpeg" // replace with your image path
                                alt="Xbox Console"
                                className="max-w-full h-auto"
                              />

                              {/* Price tags */}
                              <span className="absolute top-[30%] left-[60%] bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                                &#8377;52000
                              </span>
                              <span className="absolute bottom-[20%] left-[30%] bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                                &#8377;5500
                              </span>
                            </div>
                          </div>
                        )}
                      </li>
                    </Link>
                    <Link to="/shop">
                      <li className="flex gap-3 px-5 py-4 text-nowrap border-b-1 border-gray-300 justify-between">
                        <span className="flex gap-4">
                          <span>
                            <RiCellphoneLine className="mt-[3px] text-lg" />
                          </span>
                          <span className="text-md flex ml-3">Cell Phones</span>
                        </span>
                      </li>
                    </Link>

                    <Link to="/shop">
                      <li className="flex gap-3 px-5 py-4 text-nowrap border-b-1 border-gray-300">
                        <span className="">
                          <PiCampfireFill className="mt-[3px] text-xl" />
                        </span>
                        <span className="text-md ml-3">Daily Deals</span>
                      </li>
                    </Link>
                    <Link to="/shop">
                      {" "}
                      <li className="flex gap-3 px-5 py-4 text-nowrap border-b-1 border-gray-300">
                        <span className="">
                          <PiDeviceTabletSpeaker className="mt-[3px] text-xl" />
                        </span>
                        <span className="text-md ml-3">ipad & Tablets</span>
                      </li>
                    </Link>
                    <Link to="/shop">
                      <li className="flex gap-3 px-5 py-4 text-nowrap border-b-1 border-gray-300">
                        <span className="">
                          <PiSpeakerHighLight className="mt-[3px] text-xl" />
                        </span>
                        <span className="text-md ml-3">Portable Speakers</span>
                      </li>
                    </Link>
                  </ul>
                </div>
              </div>
              {/* Center - Navigation */}
              <nav className="flex items-center gap-6 relative">
                <Link
                  to="/"
                  className="group relative inline-flex items-center rounded-md py-3 px-2 hover:bg-white hover:text-teal-700 transition-colors duration-300"
                >
                  <span className="relative block h-6 w-12 overflow-hidden">
                    {/* Default text */}
                    <span className="transition-transform duration-400 ease-out group-hover:translate-y-full h-6">
                      Home
                    </span>
                    {/* Hover text */}
                    {/* <span className="absolute inset-0 -translate-y-full transition-transform duration-400 ease-out group-hover:translate-y-0 h-6">
                      Home
                    </span> */}
                  </span>
                </Link>

                {/* Shop Dropdown */}
                <Link
                  to="/shop"
                  className="flex items-center gap-1 cursor-pointer rounded-md hover:text-teal-700 py-1 px-1 hover:bg-white group"
                  onMouseEnter={() => setShopData(true)}
                  onMouseLeave={() => setShopData(false)}
                >
                  <div className="group hover:text-teal-700 py-2 px-1 cursor-pointer">
                    <div className="overflow-hidden h-6">
                      <span className="flex items-center transition-transform duration-400 h-6">
                        Shop
                      </span>
                      {/* <span className="flex items-center absolute top-full left-0 transition-transform duration-400 group-hover:-translate-y-full h-6">
                        Shop
                      </span> */}
                    </div>
                  </div>
                  <MdKeyboardArrowDown className="transition-transform duration-300 group-hover:rotate-180" />

                  <div
                    className={`absolute translate-x-[-15%] top-[48px] z-50 bg-white px-6 py-10 flex gap-10 w-[70vw] h-[70vh] rounded-xl shadow-lg 
    transition-all duration-400 ease-in-out transform
    ${
      shopData
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }
  `}
                    onMouseEnter={() => setShopData(true)}
                    onMouseLeave={() => setShopData(false)}
                  >
                    {/* Left Sidebar */}
                    <div className="w-full xl:w-1/4">
                      <h2 className="text-lg font-semibold mb-2 flex items-center gap-1">
                        All Catgeories
                        <span className="bg-pink-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                          HOT DEAL
                        </span>
                      </h2>
                      <ul className="space-y-2 text-sm text-gray-700 mb-6 text-nowrap">
                        {categories.slice(0, 5).map((cat, idx) => {
                          const discount = Math.floor(Math.random() * 50) + 10; // random 10–59%
                          return (
                            <li
                              key={idx}
                              className="hover:underline cursor-pointer"
                            >
                              {discount}% off on {cat.name}
                            </li>
                          );
                        })}
                      </ul>

                      <h2 className="text-lg font-semibold mb-2">Campaigns</h2>
                      <ul className="space-y-2 text-sm text-gray-700 mb-6">
                        <li className="hover:underline">
                          {Math.floor(Math.random() * 50) + 10}% off and Free
                          Deliveries
                        </li>
                        <li className="hover:underline">
                          {Math.floor(Math.random() * 50) + 10}% off and Free
                          Returns
                        </li>
                      </ul>
                      <Link to="/shop">
                        <button className="px-5 py-2 rounded-md border border-teal-600 text-teal-600 hover:bg-teal-50 transition">
                          All Campaigns →
                        </button>
                      </Link>
                    </div>

                    {/* Product of the Week Section */}
                    <div className="w-full xl:w-3/4">
                      <h2 className="text-xl font-semibold mb-6">
                        Product of The <span className="underline">Week</span>
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-xl shadow-sm text-center flex flex-col items-center"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-40 object-contain mb-4"
                            />
                            <p className="text-sm text-gray-500">
                              {item.category}
                            </p>
                            <h3 className="text-lg font-semibold">
                              {item.name}
                            </h3>
                            <div className="text-green-600 text-sm mb-1">
                              ★★★★★
                            </div>
                            <p className="text-md font-medium">{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/about"
                  className="group hover:bg-white rounded-md hover:text-teal-700 py-3 px-2"
                >
                  <div className="overflow-hidden h-6 ">
                    <span className="flex items-center h-6 transition-transform duration-400 ">
                      Our Story
                    </span>
                    {/* <span className="flex items-center h-6 absolute top-full left-0 transition-transform duration-400 group-hover:-translate-y-full">
                      Our Story
                    </span> */}
                  </div>
                </Link>

                {/* Blog Dropdown */}
                <Link
                  to="/blog"
                  className="flex items-center gap-1 cursor-pointer rounded-md hover:text-teal-700 py-1 px-1 hover:bg-white group"
                  onMouseEnter={() => setBlogData(true)}
                  onMouseLeave={() => setBlogData(false)}
                >
                  <div className="group hover:text-teal-700 py-2 px-1 cursor-pointer">
                    <div className="overflow-hidden h-6">
                      <span className="block transition-transform duration-400 h-6">
                        Blog
                      </span>
                    </div>
                  </div>
                  <MdKeyboardArrowDown
                    className={`transition-transform duration-300 ${
                      blogData ? "rotate-180" : ""
                    }`}
                  />

                  {/* Dropdown - always rendered, smooth transition */}
                  <div
                    className={`absolute translate-x-[-28%] top-[48px] z-50 bg-white px-6 py-10 space-y-5 w-[80vw] h-[75vh] overflow-auto no-scrollbar rounded-xl shadow-lg transition-all duration-400 ease-in-out transform
    ${
      blogData
        ? "opacity-100 pointer-events-auto"
        : "opacity-0  pointer-events-none"
    }`}
                    onMouseEnter={() => setBlogData(true)}
                  >
                    {/* Top Section - Blog Cards and Promo Banner */}
                    <div className="flex gap-5">
                      <div>
                        <div className="flex gap-5">
                          {/* Blog Card 1 */}
                          <div className="rounded-xl overflow-hidden shadow-sm border">
                            <img
                              src="/article-01.jpg"
                              alt="Blog 1"
                              className="w-full h-56 object-cover"
                            />
                            <div className="p-4">
                              <span className="text-xs font-medium text-white bg-emerald-700 px-2 py-1 rounded">
                                Audio Electronics
                              </span>
                              <h3 className="mt-4 text-lg font-semibold">
                                Announcing the new Fitbits Charge 6smart Fitness
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Recently, I was invited by Nintendo of Canada to
                                attend a very
                              </p>
                            </div>
                          </div>
                          {/* Blog Card 2 */}
                          <div className="rounded-xl overflow-hidden shadow-sm border">
                            <img
                              src="/article-02.jpg"
                              alt="Blog 2"
                              className="w-full h-56 object-cover"
                            />
                            <div className="p-4">
                              <span className="text-xs font-medium text-white bg-emerald-700 px-2 py-1 rounded">
                                Audio Electronics
                              </span>
                              <h3 className="mt-4 text-lg font-semibold">
                                Your Conversion Rate on Amazon
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Recently, I was invited by Nintendo of Canada to
                                attend a very
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Section - Category Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                          {/* Home Appliances */}
                          <div className="ps-5">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                              <HiHome className="text-xl" /> Home Appliances
                            </h3>
                            <ul className="mt-3 text-gray-700 space-y-1 text-sm">
                              <li>Refrigerators</li>
                              <li>Washing Machine</li>
                              <li>Smart Home</li>
                              <li>Security Device</li>
                              <li className="text-black font-medium hover:underline cursor-pointer">
                                View All Items →
                              </li>
                            </ul>
                          </div>

                          {/* Audio Electronics */}
                          <div>
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                              <PiMusicNotesSimpleBold className="text-xl" />{" "}
                              Audio Electronics
                            </h3>
                            <ul className="mt-3 text-gray-700 space-y-1 text-sm">
                              <li>Gaming Devices</li>
                              <li>TVs and Avs</li>
                              <li>Wearable Technology</li>
                              <li>iPads and Tablets</li>
                              <li className="text-black font-medium hover:underline cursor-pointer">
                                View All Items →
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Promo Banner */}
                      <div className="relative rounded-xl overflow-hidden">
                        <img
                          src="/Banner-9.jpeg"
                          alt="Promo"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-6 left-6 text-white">
                          <h2 className="text-2xl font-bold">Speakers</h2>
                          <h1 className="text-4xl font-extrabold">45% Flat</h1>
                          <p className="text-sm mt-1">On Selected Brands</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/contact"
                  className="group relative hover:bg-white rounded-md hover:text-teal-700 py-3 px-2"
                >
                  <div className="relative overflow-hidden h-6">
                    <span className="block transition-transform duration-400 h-6">
                      Contact
                    </span>
                  </div>
                </Link>
              </nav>
            </div>

            {/* Right - Sale div */}
            <div className="flex items-center gap-4">
              <Link
                to="/shop"
                className="group relative bg-black text-white px-20 py-5 flex items-center justify-center rounded-xl font-medium overflow-hidden duration-300 hover:bg-white hover:text-black hover:border-transparent"
              >
                {/* Default text */}
                <span className="absolute inset-0 flex items-center justify-center translate-y-0 transition-transform duration-300 ease-out group-hover:translate-y-full">
                  Sale! 30% OFF!
                </span>

                {/* Hover text */}
                <span className="absolute inset-0 flex items-center justify-center -translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
                  Shop Now
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;

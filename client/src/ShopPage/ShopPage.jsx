import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaRegHeart,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoEye } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ShopPage = () => {
  const URL = "https://e-commerce-4pcq.onrender.com";
  // const URL = "http://localhost:5000";
  const [wishlistMsg, setWishlistMsg] = useState("");
  const [animateId, setAnimateId] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartMsg, setCartMsg] = useState("");
  const [animateCartId, setAnimateCartId] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState();

  const isInCart = (productId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.some((item) => item._id === productId);
  };

  const toggleCartItem = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((item) => item._id === product._id);

    if (index !== -1) {
      cart.splice(index, 1);
      setCartMsg(`${product.name} removed from cart`);
    } else {
      cart.push({ ...product, quantity: 1 });
      setCartMsg(`${product.name} added to cart`);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setAnimateCartId(product._id);
    setTimeout(() => setAnimateCartId(null), 300);

    setTimeout(() => setCartMsg(""), 2000);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleAddToWishlist = (product) => {
    const selectedItem = {
      _id: product._id,
      title: product.name,
      price: product.pricing?.salePrice,
      image: `${URL}/${product.mainImage}`,
    };

    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const itemIndex = existingWishlist.findIndex(
      (item) => item._id === selectedItem._id
    );

    if (itemIndex === -1) {
      existingWishlist.push(selectedItem);
      setWishlistMsg(`${selectedItem.title} added to wishlist`);
    } else {
      existingWishlist.splice(itemIndex, 1);
      setWishlistMsg(`${selectedItem.title} removed from wishlist`);
    }

    localStorage.setItem("wishlist", JSON.stringify(existingWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));

    setAnimateId(product._id);
    setTimeout(() => setAnimateId(null), 300);

    setTimeout(() => setWishlistMsg(""), 2000);
  };

  const handleViewProduct = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${URL}/product/`);
        setProducts(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const prices = [
    "₹0 - ₹5000",
    "₹5000 - ₹10,000",
    "₹10,000 - ₹50,000",
    "₹50,000 - ₹200,000",
  ];

  const productStatuses = [
    { label: "Product In stock" },
    { label: "Product On sale" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${URL}/category/`);
        let backendCategories = res.data;
        console.log(res.data);

        const staticCategories = [
          {
            label: "Shop All",
            tag: "ALL",
            tagColor: "bg-gray-100 text-black font-bold",
          },
          {
            label: "New Arrivals",
            tag: "NEW",
            tagColor: "bg-green-100 text-green-700 font-bold",
          },
          {
            label: "Sale",
            tag: "SALE",
            tagColor: "bg-red-100 text-red-600 font-bold",
          },
        ];

        setCategories([...staticCategories, ...backendCategories]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // ---------- apply filters (central, supports overrides) ----------
  const applyFilters = ({
    overrideCategories,
    overridePrices,
    overrideStatuses,
    overrideColors,
  } = {}) => {
    let filtered = [...products];

    const cats = overrideCategories ?? selectedCategories;
    const pr = overridePrices ?? selectedPrices;
    const sts = overrideStatuses ?? selectedStatuses;
    const cols = overrideColors ?? selectedColors;

    // --- CATEGORY(S) (treat as OR across selected categories) ---
    if (cats && cats.length > 0) {
      // If Shop All is selected, skip category narrowing
      if (!cats.includes("Shop All")) {
        filtered = filtered.filter((p) => {
          return cats.some((cat) => {
            if (!cat) return false;
            if (cat === "New Arrivals") {
              if (!p.createdAt) return false;
              const createdAt = new Date(p.createdAt);
              const today = new Date();
              const diffDays = (today - createdAt) / (1000 * 60 * 60 * 24);
              return diffDays <= 30; // within 30 days
            } else if (cat === "Sale") {
              return (
                typeof p.pricing?.salePrice === "number" &&
                typeof p.pricing?.mrp === "number" &&
                p.pricing.salePrice < p.pricing.mrp
              );
            } else {
              // backend category match - try both categoryName and nested category name
              return (
                (p.categoryName && p.categoryName === cat) ||
                (p.category &&
                  (p.category.name === cat || p.category.label === cat))
              );
            }
          });
        });
      } // else Shop All -> do nothing (keep all)
    }

    // --- STATUSES (OR among statuses, AND with previous) ---
    if (sts && sts.length > 0) {
      filtered = filtered.filter((p) =>
        sts.some((status) => {
          if (status === "Product In stock") {
            return (p.inventory?.stockQty ?? 0) > 0;
          } else if (status === "Product On sale") {
            return (
              typeof p.pricing?.salePrice === "number" &&
              typeof p.pricing?.mrp === "number" &&
              p.pricing.salePrice < p.pricing.mrp
            );
          }
          return false;
        })
      );
    }

    // --- PRICE RANGES (OR across ranges) ---
    if (pr && pr.length > 0) {
      filtered = filtered.filter((p) =>
        pr.some((range) => {
          if (!range || typeof range !== "string") return false;
          const parts = range
            .split("-")
            .map((s) => s.replace(/[₹, ]/g, "").trim());
          const min = Number(parts[0]) || 0;
          const max = Number(parts[1]) || Infinity;
          const price = p.pricing?.salePrice ?? p.pricing?.mrp ?? 0;
          return price >= min && price <= max;
        })
      );
    }

    // --- COLORS (OR across chosen colors) ---
    if (cols && cols.length > 0) {
      filtered = filtered.filter((p) => {
        // attempt to read color from common fields (p.color or variations/attributes)
        const productColor = p.color || p.variantColor || null;
        if (productColor) {
          return cols.includes(productColor);
        }
        // fallback: if product has variations with attribute 'color', check options
        if (Array.isArray(p.variations)) {
          return p.variations.some((v) => {
            if (
              typeof v.attribute === "string" &&
              v.attribute.toLowerCase() === "color"
            ) {
              return v.options?.some((opt) => cols.includes(opt?.value));
            }
            return false;
          });
        }
        return false;
      });
    }

    setFilteredProducts(filtered);
  };

  // re-run on relevant state changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    products,
    selectedCategories,
    selectedPrices,
    selectedStatuses,
    selectedColors,
  ]);

  const sectionRef = useRef(null);
  const imgRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(imgRef.current, {
        transformOrigin: "center center",
        willChange: "transform",
      });

      gsap.fromTo(
        imgRef.current,
        { scale: 1 }, // initial size
        {
          scale: 0.8, // shrink as you scroll down
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom", // when section enters viewport
            end: "bottom top", // until section leaves
            scrub: true,

            // markers: true,      // uncomment to debug
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="py-10">
      {/* Banner */}
      <div
        ref={sectionRef}
        className="w-full relative flex flex-col justify-center px-4"
      >
        <div className="flex flex-col gap-10 lg:flex-row items-center justify-between bg-teal-700 px-6 lg:px-16 py-10 rounded-xl text-white relative">
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <p className="text-sm">Find the right keyboard for you</p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Keyboards That Have <br /> You Covered.
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-15">
              <p className="text-sm flex flex-col gap-2">
                NOW ON SALE
                <span className="text-2xl font-bold text-yellow-400">
                  45% Flat
                </span>
              </p>
              <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900">
                Shop Now
              </button>
            </div>
          </div>

          {/* Animated Image */}
          <img
            ref={imgRef}
            src="/shop-img-01.png"
            alt="Keyboard with tablet"
            className="lg:absolute w-[300px] sm:w-[400px] lg:w-[520px] lg:h-[420px] h-auto top-[-40px] lg:right-5 xl:right-10"
          />
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="overflow-x-auto mt-10 scroll-smooth no-scrollbar px-6">
        <div className="flex gap-10 py-4 w-max">
          {categories.map((cat, index) => {
            const categoryName = cat.name || cat.label;
            const isActive = selectedCategories.includes(categoryName); // check if active

            const handleCategoryClick = () => {
              if (isActive) {
                // ✅ If already active → remove filter & reset
                setSelectedCategories([]);
                setFilteredProducts(products);
              } else {
                // ✅ If not active → apply filter
                setSelectedCategories([categoryName]);

                if (categoryName === "Shop All") {
                  setFilteredProducts(products);
                } else if (categoryName === "New Arrivals") {
                  const today = new Date();
                  const newProducts = products.filter((p) => {
                    const createdAt = new Date(p.createdAt);
                    const diffDays =
                      (today - createdAt) / (1000 * 60 * 60 * 24);
                    return diffDays <= 30;
                  });
                  setFilteredProducts(newProducts);
                } else if (categoryName === "Sale") {
                  const saleProducts = products.filter(
                    (p) => p.pricing?.salePrice < p.pricing?.mrp
                  );
                  setFilteredProducts(saleProducts);
                } else {
                  const filtered = products.filter(
                    (p) => p.categoryName === categoryName
                  );
                  setFilteredProducts(filtered);
                }
              }
            };

            return (
              <div
                key={index}
                className="flex flex-col items-center space-y-5 cursor-pointer"
                onClick={handleCategoryClick}
              >
                <div
                  className={`w-[120px] h-[120px] flex items-center justify-center rounded-full border transition ${
                    isActive ? "ring-4 ring-teal-500 scale-105" : ""
                  } ${cat.tagColor || "bg-gray-100"}`}
                >
                  {cat.tag ? (
                    <span className="text-sm hover:underline">{cat.tag}</span>
                  ) : (
                    <img
                      src={`${URL}/${encodeURI(
                        cat.image.replaceAll("\\", "/")
                      )}`}
                      alt={cat.label}
                      className="w-[75px] h-[75px] object-contain rounded-full hover:scale-110 transition"
                    />
                  )}
                </div>
                <p
                  className={`text-sm font-medium text-center ${
                    isActive ? "text-teal-600 font-semibold" : ""
                  }`}
                >
                  {cat.label || cat.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="px-4 mt-5 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-[250px] flex-col shadow-xl px-4 py-6 space-y-6 bg-white rounded">
          {/* Categories */}
          <div>
            <h2 className="font-bold mb-5 text-xl">All Categories</h2>
            {categories.slice(3).map((cat, i) => (
              <div key={i} className="flex justify-between items-center my-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    onChange={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(cat.name)
                          ? prev.filter((c) => c !== cat.name)
                          : [...prev, cat.name]
                      )
                    }
                  />
                  <span>{cat.name}</span>
                </label>
                <span className="text-gray-500 text-xs">{cat.count}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div>
            <h2 className="font-semibold mb-3 text-lg">Filter By Price</h2>
            {prices.map((price, i) => (
              <label key={i} className="flex items-center gap-2 my-2">
                <input
                  type="checkbox"
                  onChange={() =>
                    setSelectedPrices((prev) =>
                      prev.includes(price)
                        ? prev.filter((p) => p !== price)
                        : [...prev, price]
                    )
                  }
                />
                <span>{price}</span>
              </label>
            ))}
          </div>

          {/* Product By Stock */}
          <div>
            <h2 className="font-semibold mb-3 text-lg">Product By Stock</h2>
            {productStatuses.map((status, i) => (
              <div key={i} className="flex justify-between items-center mb-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    onChange={() =>
                      setSelectedStatuses((prev) =>
                        prev.includes(status.label)
                          ? prev.filter((s) => s !== status.label)
                          : [...prev, status.label]
                      )
                    }
                  />
                  <span>{status.label}</span>
                </label>
                <span className="text-gray-500 text-xs">{status.count}</span>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="pt-6 border-t">
            <h2 className="font-semibold mb-3 text-lg">Social Links</h2>
            <div className="flex space-x-4 text-teal-700 text-xl">
              <FaFacebookF />
              <FaXTwitter />
              <FaLinkedinIn />
              <FaYoutube />
            </div>
          </div>
        </aside>

        {/* Product Listing */}
        <div className="flex-1">
          <div className="flex justify-end items-center px-2 md:px-6 mb-4 border-b pb-3">
            <select
              className="border px-4 py-2 rounded"
              onChange={(e) => {
                const value = e.target.value;
                let sortedProducts = [...filteredProducts]; // work on filtered list (not all)

                if (value === "rating") {
                  sortedProducts.sort(
                    (a, b) => (b.rating || 0) - (a.rating || 0)
                  );
                } else if (value === "low") {
                  sortedProducts.sort(
                    (a, b) =>
                      (a.pricing?.salePrice || a.pricing?.mrp) -
                      (b.pricing?.salePrice || b.pricing?.mrp)
                  );
                } else if (value === "high") {
                  sortedProducts.sort(
                    (a, b) =>
                      (b.pricing?.salePrice || b.pricing?.mrp) -
                      (a.pricing?.salePrice || a.pricing?.mrp)
                  );
                } else if (value === "latest") {
                  sortedProducts.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  );
                } else {
                  sortedProducts = [...products]; // default → reset
                }

                setFilteredProducts(sortedProducts);
              }}
            >
              <option value="default">Default Sorting</option>
              <option value="rating">Sort by Rating</option>
              <option value="low">Price Low to High</option>
              <option value="high">Price High to Low</option>
              <option value="latest">Sort by Latest</option>
            </select>
          </div>

          {/* Toast Notifications */}
          {wishlistMsg && (
            <div className="fixed top-5 right-5 bg-white text-black px-4 py-2 rounded shadow-2xl z-50 transition-opacity duration-500 w-90">
              <div className="flex gap-5 items-center">{wishlistMsg}</div>
              <Link to="/wishlistPage">
                <button className="text-teal-600 underline">
                  View Wishlist
                </button>
              </Link>
            </div>
          )}
          {cartMsg && (
            <div className="fixed top-5 right-5 bg-white text-black px-4 py-2 rounded shadow-2xl z-50 transition-opacity duration-500 w-90">
              <div className="flex gap-5 items-center">{cartMsg}</div>
              <Link to="/checkout">
                <button className="text-teal-600 underline">View Cart</button>
              </Link>
            </div>
          )}

          {/* Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((item) => {
              const isInWishlist = wishlist.some((w) => w._id === item._id);
              return (
                <Link
                  to={`/product/${item.seo?.slug ?? ""}`}
                  key={item._id}
                  className="bg-white p-4 rounded shadow relative"
                >
                  <div className="h-[200px] flex items-center justify-center relative group">
                    <img
                      src={`${URL}/${item.mainImage}`}
                      alt={item.name}
                      className="object-contain w-full h-full"
                      onMouseEnter={(e) => {
                        if (item.gallery && item.gallery.length > 0) {
                          e.currentTarget.src = `${URL}/${item.gallery[0]}`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.src = `${URL}/${item.mainImage}`;
                      }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-opacity-30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="p-2 bg-white rounded-2xl hover:bg-gray-200 pointer-events-auto">
                        <FaRegHeart
                          className={`cursor-pointer transition-all duration-300 ${
                            isInWishlist ? "text-red-500" : "text-gray-400"
                          } ${
                            animateId === item._id ? "scale-125" : "scale-100"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleAddToWishlist(item);
                          }}
                        />
                      </span>
                      <span className="p-2 bg-white rounded-2xl hover:bg-gray-200 pointer-events-auto">
                        <BsCart3
                          className={`cursor-pointer transition-all duration-300 ${
                            isInCart(item._id)
                              ? "text-teal-600"
                              : "text-gray-400"
                          } ${
                            animateCartId === item._id
                              ? "scale-125"
                              : "scale-100"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            toggleCartItem(item);
                          }}
                        />
                      </span>
                      <span className="p-2 bg-white rounded-2xl hover:bg-gray-200 pointer-events-auto text-gray-400">
                        <IoEye
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleViewProduct(item);
                          }}
                        />
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-3">
                    {item.categoryName}
                  </p>
                  <h3 className="text-md font-semibold">{item.name}</h3>
                  <div className="mt-2 text-lg">
                    {item.pricing?.mrp && (
                      <span className="line-through text-gray-400 mr-2">
                        &#8377;{item.pricing.mrp}
                      </span>
                    )}
                    <span className="text-teal-600 font-semibold">
                      &#8377;{item.pricing?.salePrice ?? 0}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* === QUICK VIEW === */}
      {quickViewProduct && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-opacity-50 z-40 transition-opacity duration-500"
            onClick={closeQuickView}
          ></div>

          {/* Sidebar Panel */}
          <div
            className={`fixed right-0 top-0 h-full w-full md:w-[350px] bg-white z-50 shadow-lg p-6 overflow-y-auto transform transition-transform duration-300 ${
              quickViewProduct ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-xl text-gray-500 hover:text-gray-800 cursor-pointer"
              onClick={closeQuickView}
            >
              ✕
            </button>

            {/* Product Image */}
            {quickViewProduct?.mainImage && (
              <img
                src={`${URL}/${quickViewProduct.mainImage}`}
                alt={quickViewProduct?.name || "Product"}
                className="w-full h-64 object-contain rounded-lg mb-4"
              />
            )}

            {/* Product Title */}
            <h2 className="text-2xl font-bold mb-2">
              {quickViewProduct?.name || "Product Name"}
            </h2>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              {quickViewProduct?.pricing?.mrp && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{quickViewProduct.pricing.mrp}
                </span>
              )}
              <span className="text-2xl font-bold text-blue-600">
                ₹
                {quickViewProduct?.pricing?.salePrice ??
                  quickViewProduct?.pricing?.mrp ??
                  "N/A"}
              </span>
            </div>

            {/* Key Features */}
            {Array.isArray(quickViewProduct?.keyFeatures) &&
            quickViewProduct.keyFeatures.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="list-inside text-gray-600 space-y-1 ">
                  {quickViewProduct.keyFeatures.map((feature, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{feature.name}:</span>{" "}
                      {feature.value}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-600 mb-6">No key features available.</p>
            )}

            {/* Variations */}
            {Array.isArray(quickViewProduct?.variations) &&
              quickViewProduct.variations.map((variation, idx) => {
                const attrName =
                  typeof variation?.attribute === "string"
                    ? variation.attribute.toLowerCase()
                    : "";

                return (
                  <div key={idx} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                      {variation?.attribute || "Option"}
                    </h3>

                    <div className="flex gap-3 flex-wrap">
                      {Array.isArray(variation?.options) &&
                        variation.options.map((opt, i) => {
                          const isSelected =
                            selectedAttributes?.[variation?.attribute]
                              ?.value === opt?.value;

                          return (
                            <button
                              key={i}
                              type="button"
                              className={`cursor-pointer transition-all flex items-center justify-center text-xs ${
                                attrName === "color"
                                  ? `w-10 h-10 rounded-full border-2 ${
                                      isSelected
                                        ? "border-blue-500 ring-2 ring-blue-200"
                                        : "border-gray-300 hover:border-gray-400"
                                    }`
                                  : `px-4 py-2 rounded-lg border ${
                                      isSelected
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-300 hover:border-gray-400"
                                    }`
                              }`}
                              onClick={() =>
                                setSelectedAttributes((prev) => ({
                                  ...prev,
                                  [variation?.attribute]: opt,
                                }))
                              }
                              style={
                                attrName === "color"
                                  ? { backgroundColor: opt?.value || "#ccc" }
                                  : {}
                              }
                            >
                              {attrName !== "color" && (
                                <span className="font-semibold">
                                  {opt?.value || "N/A"}
                                </span>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                );
              })}

            <div>
              <p className="mb-2">
                <strong>Category:</strong>{" "}
                {quickViewProduct?.categoryName || "N/A"}
              </p>
              <p>
                <strong>SEO Title:</strong>{" "}
                {quickViewProduct?.seo?.title || "N/A"}
              </p>
              <p>
                <strong>SEO Description:</strong>{" "}
                {quickViewProduct?.seo?.desc || "N/A"}
              </p>
              <p>
                <strong>SEO Slug:</strong>{" "}
                {quickViewProduct?.seo?.slug || "N/A"}
              </p>

              <div className="pt-2 cursor-pointer">
                <Link
                  to={`/product/${quickViewProduct?.seo?.slug ?? ""}`}
                  className="font-semibold underline"
                >
                  See Details
                </Link>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              className="mt-6 w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-black"
              onClick={() => {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existing = cart.find(
                  (item) => item._id === quickViewProduct._id
                );

                if (existing) {
                  cart = cart.map((item) =>
                    item._id === quickViewProduct._id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  );
                } else {
                  cart.push({ ...quickViewProduct, quantity: 1 });
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                console.log("Cart updated:", cart);
              }}
            >
              Add to Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopPage;

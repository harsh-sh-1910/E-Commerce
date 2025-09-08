import React, { useEffect, useRef, useState, useContext } from "react";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router";
import { addToStorage } from "../localStorageUtils/localStorageUtils";
import { FaHeart } from "react-icons/fa6";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

import { LocationContext } from "../LocationContent/LocationContent";

const SingleProduct = () => {
  const token = localStorage.getItem("accessToken");
  const decodedUser = token ? jwtDecode(token) : null;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [rating, setRating] = useState(4.5);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [review, setReview] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productImages, setProductImages] = useState(null);
  const [newReview, setNewReview] = useState({
    name: decodedUser?.name || "",
    comment: "",
    rating: 0,
  });
  const [showZoom, setShowZoom] = useState(false);
  const [lensX, setLensX] = useState(0);
  const [lensY, setLensY] = useState(0);
  const imgRef = useRef(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [variation, setVariation] = useState();
  const [index, setIndex] = useState(0);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const { location, classification, error, classifyByPincode } =
    useContext(LocationContext);
  const [manualPincode, setManualPincode] = useState("");
  const [manualClassification, setManualClassification] = useState(null);

  const deliveryTimes = {
    Local: "2-3 days",
    Zonal: "4-6 days",
    International: "7-14 days",
  };

  const handleManualCheck = () => {
    const result = classifyByPincode(manualPincode);
    setManualClassification(result); // Update classification
  };

  const deliveryEstimate = manualClassification
    ? deliveryTimes[manualClassification]
    : null;

  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Clamp cursor inside image
    const clampedX = Math.max(0, Math.min(x, width));
    const clampedY = Math.max(0, Math.min(y, height));

    setLensX(clampedX);
    setLensY(clampedY);
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const payload = {
      userId: decodedUser.id,
      uName: newReview.name,
      productId: product._id,
      productName: product.name,
      rating: newReview.rating,
      comment: newReview.comment,
    };
    console.log(payload);

    try {
      const response = await axios.post(
        "http://localhost:5000/review/",
        payload
      );

      if (response.status === 201) {
        const newDate = new Date().toISOString().split("T")[0];
        const newId = review.length + 1;

        setReview([
          ...review,
          {
            id: newId,
            name: newReview.name,
            rating: newReview.rating,
            comment: newReview.comment,
            date: newDate,
            verifiedPurchase: true,
          },
        ]);

        setNewReview({ name: "", rating: 0, comment: "" });
        setIsModalOpen(false);
        alert(" Review submitted successfully!");
        console.log(payload);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        alert(" You must purchase this product to write a review.");
      } else if (error.response?.status === 400) {
        alert("error" + error.response.data.message);
      } else {
        alert("Something went wrong. Please try again later.");
        console.log(error);
      }
    }
  };

  const ratings =
    review.reduce((acc, r) => acc + r.rating, 0) / review.length || 0;
  const { slug } = useParams();

  const handleAddToCart = () => {
    const selectedItem = {
      ...product,
      selectedColor,
      quantity: 1,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if same product (with same color) already exists
    const existingIndex = existingCart.findIndex(
      (item) =>
        item._id === selectedItem._id &&
        item.selectedColor === selectedItem.selectedColor
    );

    if (existingIndex !== -1) {
      // Already in cart – increment quantity
      existingCart[existingIndex].quantity += 1;
    } else {
      // New item – add to cart
      existingCart.push(selectedItem);
    }

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Notify Header to refresh cart and open it
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("toggleCartOpen"));
  };

  const handleAddToWishlist = () => {
    const selectedItem = {
      _id: product._id,
      title: product.name,
      price: product.pricing?.salePrice,
      image: `http://localhost:5000/${product.mainImage}`,
    };

    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const itemIndex = existingWishlist.findIndex(
      (item) => item._id === selectedItem._id
    );

    if (itemIndex === -1) {
      //  Add to wishlist
      existingWishlist.push(selectedItem);
      setIsWishlisted(true);
    } else {
      //  Remove from wishlist
      existingWishlist.splice(itemIndex, 1);
      setIsWishlisted(false);
    }

    localStorage.setItem("wishlist", JSON.stringify(existingWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const [product, setProduct] = useState(null);
  const handleBuyNow = () => {
    const productToBuy = {
      ...product,
      quantity: 1,
    };

    // ✅ Save only this product in cart
    localStorage.setItem("cart", JSON.stringify([productToBuy]));

    // ✅ Redirect to checkout page
    navigate("/checkout");
  };

  useEffect(() => {
    const getProduct = async () => {
      const response = await fetch(`http://localhost:5000/product/${slug}`);
      const data = await response.json();

      setProduct(data);
      setVariation(data.variations);
      console.log(data.variations);

      // Ensure gallery is always an array
      setProductImages([
        data.mainImage,
        ...(Array.isArray(data.gallery) ? data.gallery : []),
      ]);
      console.log(data);
    };

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isAlreadyWishlisted = wishlist.some(
      (item) => item._id === product?._id
    );
    setIsWishlisted(isAlreadyWishlisted);

    getProduct();
  }, []);

  useEffect(() => {
    const getReviews = async () => {
      try {
        if (!product?._id) return;

        const res = await axios.get(
          `http://localhost:5000/review/${product._id}`
        );
        setReview(res.data);
      } catch (err) {
        console.error(
          "Failed to fetch reviews:",
          err.response?.data || err.message
        );
      }
    };

    getReviews();
  }, [product]);

  if (product)
    return (
      <div className="min-h-screen bg-white">
        {/* Main Product Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
            {/* Product Images Section */}
            <div className="flex gap-4">
              {/* Thumbnail Gallery */}
              <div className="flex flex-col gap-3">
                {[...productImages, ...variation[0].options[index].images].map(
                  (thumb, index) => (
                    <div
                      key={index}
                      className={`w-16 h-16 border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedImage === index
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={`http://localhost:5000/${thumb}`}
                        alt={`Product view ${index + 1}`}
                        className="w-full h-full object-contain object-top"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Main Image */}
              <div
                className="flex-1 relative aspect-square rounded-xl overflow-hidden"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  ref={imgRef}
                  src={`http://localhost:5000/${
                    [...productImages, ...variation[0].options[index].images][
                      selectedImage
                    ]
                  }`}
                  alt="Main product"
                  className="w-full h-full object-contain"
                />

                {/* Image Navigation Arrows */}
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg cursor-pointer"
                  onClick={() =>
                    setSelectedImage(
                      selectedImage > 0
                        ? selectedImage - 1
                        : [
                            ...productImages,
                            ...variation[0].options[index].images,
                          ].length - 1
                    )
                  }
                >
                  <IoIosArrowBack className="text-gray-700" />
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg cursor-pointer"
                  onClick={() =>
                    setSelectedImage(
                      selectedImage < productImages.length - 1
                        ? selectedImage + 1
                        : 0
                    )
                  }
                >
                  <IoIosArrowForward className="text-gray-700" />
                </button>
              </div>
            </div>

            {/* Product Information Section */}
            <div className="space-y-6 relative">
              {/* Brand and Title */}
              <div>
                <p className="text-teal-600 font-medium text-sm mb-2 cursor-pointer hover:underline">
                  {product.categoryName}
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {variation[0].options[index].productName}
                </h1>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-3 mb-4">
                  {/* Rating Section */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-600 ml-1 flex items-center gap-1">
                      <FaStar className="text-yellow-300" />
                      {reviewsCount > 0 ? rating.toFixed(1) : "–"}
                    </span>
                  </div>

                  {/* Review Text */}
                  {reviewsCount > 0 ? (
                    <span className="text-blue-600 text-sm cursor-pointer hover:underline">
                      ({reviewsCount.toLocaleString()} reviews)
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm italic">
                      No reviews yet
                    </span>
                  )}

                  {/* Divider */}
                  <span className="text-gray-400">|</span>

                  {/* Stock Status */}
                  <span
                    className={`text-sm font-medium ${
                      variation[0].options[index].stock > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {variation[0].options[index].stock > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    $ {variation[0].options[index].price}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.pricing.mrp}
                  </span>
                </div>
              </div>

              {product.variations.map((variation, idx) => (
                <div key={variation.attribute} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>{variation.attribute}:</span>

                    {selectedAttributes[variation.attribute] &&
                      variation.attribute.toLowerCase() === "color" && (
                        <span className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full border border-gray-300"
                            style={{
                              backgroundColor:
                                selectedAttributes[variation.attribute]?.value,
                            }}
                            onClick={() => {
                              console.log("Test");
                            }}
                          ></span>
                        </span>
                      )}

                    {selectedAttributes[variation.attribute] &&
                      variation.attribute.toLowerCase() !== "color" && (
                        <span className="text-sm text-gray-600">
                          {selectedAttributes[variation.attribute]?.value}
                        </span>
                      )}
                  </h3>

                  <div className="flex gap-3 flex-wrap">
                    {variation.options.map((opt, idx) => {
                      const isSelected =
                        selectedAttributes[variation.attribute]?.value ===
                        opt.value;

                      return (
                        <button
                          key={opt._id}
                          type="button"
                          className={`cursor-pointer transition-all flex flex-col items-center justify-center text-xs ${
                            variation.attribute.toLowerCase() === "color"
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
                          onClick={() => {
                            setSelectedAttributes((prev) => ({
                              ...prev,
                              [variation.attribute]: opt, // store full option object
                            }));
                            setIndex(idx);
                          }}
                          title={opt.value}
                          style={
                            variation.attribute.toLowerCase() === "color"
                              ? { backgroundColor: opt.value }
                              : {}
                          }
                        >
                          {variation.attribute.toLowerCase() !== "color" && (
                            <span className="font-semibold">{opt.value}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Key Features */}
              <div>
                <div className="">
                  <h2 className="my-3 font-bold text-xl underline">
                    Key Features
                  </h2>
                  {product.keyFeatures.map((feature, idx) => (
                    <div className="flex items-start mb-2" key={idx}>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {feature.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{feature.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {/* Action Buttons */}
                <div className="">
                  <Link>
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-teal-600 hover:bg-black text-white py-3 px-6 font-semibold transition-colors duration-200 cursor-pointer rounded"
                    >
                      Add to Cart
                    </button>
                  </Link>
                </div>
                <div>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-black hover:bg-teal-600 text-white py-3 px-6 font-semibold transition-colors cursor-pointer rounded"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 text-2xl">
                <button onClick={handleAddToWishlist}>
                  <FaHeart
                    className={`cursor-pointer transition-colors duration-300 ${
                      isWishlisted ? "text-red-500" : "text-gray-200"
                    }`}
                  />
                </button>
              </div>

              {/* Delivery Information */}
              <div className="bg-gray-100 p-4 rounded-lg space-y-3">
                {/* Pincode Input */}
                <div className="mt-3 flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={manualPincode}
                    onChange={(e) => setManualPincode(e.target.value)}
                    placeholder="Enter Pincode"
                    className="border-b border-gray-300 rounded px-5 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm w-full"
                  />
                  <button
                    onClick={handleManualCheck}
                    disabled={!manualPincode || manualPincode.length !== 6}
                    className={`text-sm font-medium px-7 py-3 rounded transition 
        ${
          !manualPincode || manualPincode.length !== 6
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-teal-600 hover:bg-teal-700 text-white"
        }`}
                  >
                    Check
                  </button>
                </div>

                {/* Delivery Section */}
                <div className="flex items-center gap-3 mt-4">
                  <i className="fas fa-undo text-blue-600"></i>
                  <div>
                    <p className="font-medium text-gray-900">
                      Estimated delivery:
                    </p>
                    {!manualClassification && !deliveryEstimate ? (
                      <p className="text-md text-gray-500">
                        Write pincode to check delivery
                      </p>
                    ) : (
                      <p className="text-md text-gray-500">
                        {deliveryEstimate}
                      </p>
                    )}
                  </div>
                </div>

                {/* 30-Day Returns Section */}
                <div className="flex items-center gap-3">
                  <i className="fas fa-undo text-blue-600"></i>
                  <div>
                    <p className="font-medium text-gray-900">30-Day Returns</p>
                    <p className="text-md text-gray-600">
                      Free returns within 30 days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ZOOM BOX (overlaps everything using z-50) */}
            {showZoom && (
              <span
                className=" absolute right-0 top-0 w-[50%] h-[80vh] border border-gray-200 rounded-xl overflow-hidden z-50 bg-white shadow-xl hidden lg:block"
                style={{
                  backgroundImage: `url('http://localhost:5000/${
                    [...productImages, ...variation[0].options[index].images][
                      selectedImage
                    ]
                  }')`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "200%", // Zoom level
                  backgroundPosition: `${
                    (lensX / imgRef.current.offsetWidth) * 100
                  }% ${(lensY / imgRef.current.offsetHeight) * 100}%`,
                }}
              ></span>
            )}
          </div>

          {/* Product Description and Details */}
          <div className="mt-16 space-y-12">
            {/* Product Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Product Description
              </h2>
              {product.longDesc.blocks.map((block) => {
                if (block.type === "header") {
                  const Tag = `h${block.data.level}`;

                  return (
                    <Tag className="text-xl font-bold mb-3">
                      {block.data.text}
                    </Tag>
                  );
                }
                if (block.type === "paragraph") {
                  return <p className=" mb-3">{block.data.text}</p>;
                }
              })}
            </div>

            {/* Technical Specifications */}
            <div className="">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 ">
                Technical Specifications
              </h2>
              {product.specification.map((spec, index) => (
                <div className="bg-gray-50 overflow-hidden" key={index}>
                  <table className="w-full">
                    <tbody className="w-full">
                      <tr className="border-b border-gray-400">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-300 w-40">
                          {spec.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {spec.value}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Customer Reviews */}
            <div className="p-6 bg-white rounded-lg shadow mt-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Reviews
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Write a Review
                </button>
              </div>

              {/* Rating Overview */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {rating.toFixed(1)}
                    </div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < Math.round(rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">
                      Based on {review.length} reviews
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = review.filter(
                        (r) => r.rating === stars
                      ).length;
                      const percent = ((count / review.length) * 100).toFixed(
                        0
                      );
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-8">
                            {stars}★
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">
                            {percent}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {review.length === 0 ? (
                  <p className="text-gray-500">No reviews yet.</p>
                ) : (
                  review.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-gray-200 pb-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {review.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`text-sm ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[5px] z-50">
                  <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h3 className="text-xl font-semibold mb-4">
                      Write a Review
                    </h3>

                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={newReview.name}
                        onChange={(e) =>
                          setNewReview({ ...newReview, name: e.target.value })
                        }
                        required
                      />

                      <textarea
                        placeholder="Your review"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                        required
                      ></textarea>

                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`cursor-pointer text-xl ${
                              i < newReview.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            onClick={() =>
                              setNewReview({ ...newReview, rating: i + 1 })
                            }
                          />
                        ))}
                      </div>

                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default SingleProduct;

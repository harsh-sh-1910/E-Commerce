import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { gsap } from "gsap";
import AOS from "aos";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import {
  FaAngleRight,
  FaBell,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaCreditCard,
  FaEye,
  FaGift,
  FaHeart,
  FaShieldAlt,
  FaShippingFast,
  FaStar,
  FaStarHalfAlt,
  FaStore,
  FaTags,
  FaTools,
  FaTruck,
} from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";
import { IoEye } from "react-icons/io5";

import { FaArrowRightLong } from "react-icons/fa6";

const MainPage = () => {
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const newArrivals = [
    {
      id: 1,
      title: "Ring Wi-Fi Video Doorbell",
      category: "iPad & Tablets",
      image: "/ring.jpg",
      rating: 5,
      price: "$2,770.00",
      oldPrice: null,
      available: 80,
      sold: 0,
      time: {
        start: "2025-08-05 10:00 AM",
        end: "2025-08-05 06:00 PM",
      },
    },
    {
      id: 2,
      title: "Ring Wi-Fi Video Doorbell",
      category: "iPad & Tablets",
      image: "/ring.jpg",
      rating: 5,
      price: "$2,770.00",
      oldPrice: null,
      available: 80,
      sold: 0,
      time: {
        start: "2025-08-05 10:00 AM",
        end: "2025-08-05 06:00 PM",
      },
    },
    {
      id: 3,
      title: "Ring Wi-Fi Video Doorbell",
      category: "iPad & Tablets",
      image: "/ring.jpg",
      rating: 5,
      price: "$2,770.00",
      oldPrice: null,
      available: 80,
      sold: 0,
      time: {
        start: "2025-08-05 10:00 AM",
        end: "2025-08-05 06:00 PM",
      },
    },
    {
      id: 4,
      title: "Ring Wi-Fi Video Doorbell",
      category: "iPad & Tablets",
      image: "/ring.jpg",
      rating: 5,
      price: "$2,770.00",
      oldPrice: null,
      available: 80,
      sold: 0,
      time: {
        start: "2025-08-05 10:00 AM",
        end: "2025-08-05 06:00 PM",
      },
    },
    {
      id: 5,
      title: "Ring Wi-Fi Video Doorbell",
      category: "iPad & Tablets",
      image: "/ring.jpg",
      rating: 5,
      price: "$2,770.00",
      oldPrice: null,
      available: 80,
      sold: 0,
    },
    {
      id: 6,
      title: "Ring Wi-Fi Video Doorbell",
      category: "iPad & Tablets",
      image: "/ring.jpg",
      rating: 5,
      price: "$2,770.00",
      oldPrice: null,
      available: 80,
      sold: 0,
    },
    {
      id: 7,
      title: "Ring Wi-Fi Video Doorbell",
      category: "iPad & Tablets",
      image: "/ring.jpg",
      rating: 5,
      price: "$2,770.00",
      oldPrice: null,
      available: 80,
      sold: 0,
    },
    {
      id: 8,
      title: "Ring Wi-Fi Video Doorbell",
      category: "iPad & Tablets",
      image: "/ring.jpg",
      rating: 5,
      price: "$2,770.00",
      oldPrice: null,
      available: 80,
      sold: 0,
    },
  ];

  const scrollSlider = (direction, sliderId) => {
    const slider = document.getElementById(sliderId);
    if (!slider) {
      console.warn(`No element found with id: ${sliderId}`);
      return;
    }

    const scrollAmount = slider.clientWidth * 0.8; // 80% of visible area

    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const articles = [
    {
      date: "14",
      month: "MAR",
      image: "/article-01.jpg",
      category: "Audio Electronics",
      title: "Success Story on Amazon",
      description:
        "Recently, I was invited by Nintendo of Canada to attend a very special Nintendo Holiday Showcase",
      leftIcon: true,
    },
    {
      date: "08",
      month: "APR",
      image: "/article-02.jpg",
      category: "Audio Electronics",
      title: "13 YouTube Ads Targeting Options",
      description:
        "Recently, I was invited by Nintendo of Canada to attend a very special Nintendo Holiday Showcase",
    },
    {
      date: "14",
      month: "MAY",
      image: "/article-03.jpg",
      category: "Audio Electronics",
      title: "Learn about the Google Pixel",
      description:
        "Recently, I was invited by Nintendo of Canada to attend a very special Nintendo Holiday Showcase",
    },
    {
      date: "06",
      month: "OCT",
      image: "/article-04.jpg",
      category: "Audio Electronics",
      title: "YouTube Ads targeting options",
      description:
        "Recently, I was invited by Nintendo of Canada to attend a very special Nintendo Holiday Showcase",
      rightIcon: true,
    },
  ];
  const banner1Ref = useRef(null);
  const banner2Ref = useRef(null);
  const banner3Ref = useRef(null);

  const handleAnimation = (el, direction) => {
    if (!el) return;

    el.classList.remove("animate-sweep-forward", "animate-sweep-reverse");

    // Force reflow
    void el.offsetWidth;

    el.classList.add(
      direction === "forward"
        ? "animate-sweep-forward"
        : "animate-sweep-reverse"
    );
  };
  function getRemainingTimeDetailed(endTime) {
    if (!endTime) return "";
    const now = new Date();
    const end = new Date(endTime);
    let diffMs = end - now;
    if (diffMs <= 0) return "0 days 0 hours 0 minutes left";

    // Calculate days, hours and minutes
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    diffMs -= days * 1000 * 60 * 60 * 24;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(diffMs / (1000 * 60));

    return `${days} days ${hours} hours ${minutes} minutes left`;
  }

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/deal");
        const updatedDeals = res.data.map((deal) => {
          const product = deal.productName;
          const discountPercent = deal.discount;
          console.log(product);
          const originalPrice = product.pricing.mrp;
          let price;
          if (discountPercent) {
            price =
              originalPrice -
              Math.round(originalPrice * (discountPercent / 100));
            console.log(price);
          } else {
            price = product.pricing.salePrice;
            console.log(price);
          }
          return {
            id: product._id,
            image: product.mainImage,
            title: product.name,
            category: product.categoryName,
            rating: product.rating,
            price,
            oldPrice: originalPrice,
            available: product.inventory.stockQty,
            time: {
              start: deal.time.start,
              end: deal.time.end,
            },
          };
        });

        setDeals(updatedDeals);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch deals", err);
      }
    };

    fetchDeals();
  }, []);
  const itemsRef = useRef([]);
  gsap.registerPlugin(ScrollTrigger);
  useEffect(() => {
    gsap.fromTo(
      itemsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: itemsRef.current[0]?.parentNode, // the container
          start: "top 80%", // when top of container hits 80% viewport height
          toggleActions: "play none none none", // only play once
        },
      }
    );
  }, []);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: cardsRef.current[0]?.parentNode, // container div
          start: "top 80%",
          toggleActions: "play none none none", // only play once
        },
      }
    );
  }, []);
  useEffect(() => {
    const section = document.querySelector(".brands-section");
    const cards = section.querySelectorAll(".brand-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.2,
              ease: "power3.out",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 100,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/category/");
        setCategories(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);
  return (
    <>
      <div className="py-4 px-4 lg:px-10 bg-gray-100">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left background image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative rounded-xl w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden flex items-center ps-5">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out hover:scale-110"
                style={{ backgroundImage: "url('/main-01.jpeg')" }}
              ></div>

              {/* Overlay + Text */}
              <div className="relative z-1 bg-opacity-40 p-4 rounded-xl text-white">
                <p className="text-4xl font-bold">Sony 5G Headphone</p>
                <p className="text-sm mt-4 font-semibold">
                  Only Music. Nothing Else.
                </p>
                <button className="mt-5 px-6 py-3 bg-teal-700 text-white text-sm rounded-xl hover:bg-white hover:text-teal-700 transition-colors duration-300">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-4">
            {/* Banner-2 (hide on mobile) */}
            <div className="w-full sm:w-1/2 hidden sm:block">
              <div
                ref={banner1Ref}
                onMouseEnter={() =>
                  handleAnimation(banner1Ref.current, "forward")
                }
                onMouseLeave={() =>
                  handleAnimation(banner1Ref.current, "reverse")
                }
                className="rounded-xl w-full h-[300px] md:h-[400px] lg:h-[500px] bg-cover bg-center flex justify-center mirror-animate"
                style={{ backgroundImage: "url('/Banner-2.jpeg')" }}
              >
                {/* text-banner2 */}
                <div className="bg-opacity-60 p-4 rounded-xl text-white text-center">
                  <p className="block text-4xl font-bold">Air Mavic 3</p>
                  <p className="block text-sm text-white mt-4 font-semibold">
                    As powerful as it is portable
                  </p>
                  <Link to="/shop">
                    <button className="mt-5 px-4 py-3 font-bold bg-black text-white text-sm rounded-xl hover:bg-white hover:text-teal-700 transition">
                      Shop now
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Banner-3 and Banner-4 */}
            <div className="w-full sm:w-1/2 flex flex-col gap-4">
              <div
                ref={banner2Ref}
                onMouseEnter={() =>
                  handleAnimation(banner2Ref.current, "forward")
                }
                onMouseLeave={() =>
                  handleAnimation(banner2Ref.current, "reverse")
                }
                className="rounded-xl w-full h-[150px] sm:h-[145px] md:h-[195px] lg:h-[242px] bg-cover bg-center flex items-center mirror-animate"
                style={{ backgroundImage: "url('/Banner-3.jpeg')" }}
              >
                {/* text-banner3 */}
                <div className="bg-opacity-60 ps-3 rounded-xl text-white ">
                  <p className="block text-2xl text-black font-bold">
                    Handheld
                  </p>
                  <p className="block text-lg text-black mt-2 font-semibold">
                    USB 3 Rechargeable
                  </p>
                  <Link to="/shop">
                    <button className=" mt-3 font-semibold text-sm rounded-xl hover:text-teal-700 transition text-black flex items-center gap-2">
                      Shop now <FaArrowRightLong className="mt-1 " />
                    </button>
                  </Link>
                </div>
              </div>
              <div
                className="rounded-xl w-full h-[150px] sm:h-[145px] md:h-[195px] lg:h-[242px] bg-cover bg-center flex items-center inner-border-frame"
                style={{ backgroundImage: "url('/Banner-4.jpeg')" }}
              >
                {/* text-banner4 */}
                <div className="bg-opacity-60 ps-3 rounded-xl text-white ">
                  <p className="block text-2xl text-black font-bold">Gearbox</p>
                  <p className="block text-sm text-black mt-2 font-semibold">
                    Upto 30% Discount
                  </p>
                  <Link to="/shop">
                    <button className=" mt-3 font-semibold text-sm rounded-xl hover:text-teal-700 transition text-black flex items-center gap-2">
                      Shop now <FaArrowRightLong className="mt-1 " />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-6">
          <div className="flex flex-wrap 2xl:flex-nowrap justify-between gap-4">
            {/* 1. Discounts */}
            <div
              ref={(el) => (itemsRef.current[0] = el)}
              className="w-full md:w-[48%] lg:w-[23%] 2xl:w-[19%] flex items-center gap-4 bg-white px-4 py-3 rounded-xl shadow-sm"
            >
              <FaTags size={20} className="text-black" />
              <p className="text-lg text-black">
                Log in{" "}
                <span className="text-teal-700 font-semibold">
                  get up to 50% discounts
                </span>
              </p>
            </div>

            {/* 2. Open stores */}
            <div
              ref={(el) => (itemsRef.current[1] = el)}
              className="w-full md:w-[48%] lg:w-[23%] 2xl:w-[19%] flex items-center gap-4 bg-white px-4 py-3 rounded-xl shadow-sm"
            >
              <FaStore size={20} className="text-black" />
              <p className="text-lg text-black">Open new stores in your city</p>
            </div>

            {/* 3. Fast delivery */}
            <div
              ref={(el) => (itemsRef.current[2] = el)}
              className="w-full md:w-[48%] lg:w-[23%] 2xl:w-[19%] flex items-center gap-4 bg-white px-4 py-3 rounded-xl shadow-sm"
            >
              <FaTruck size={20} className="text-black" />
              <p className="text-lg text-black">
                Free fast express delivery with tracking
              </p>
            </div>

            {/* 4. Insurance */}
            <div
              ref={(el) => (itemsRef.current[3] = el)}
              className="hidden md:flex w-full md:w-[48%] lg:w-[23%] 2xl:w-[19%] items-center gap-4 bg-white px-4 py-3 rounded-xl shadow-sm"
            >
              <FaShieldAlt size={20} className="text-black" />
              <p className="text-lg text-black">
                Equipment loose and damage insurance
              </p>
            </div>

            {/* 5. Installment */}
            <div
              ref={(el) => (itemsRef.current[4] = el)}
              className="hidden xl:flex w-full md:w-[48%] lg:w-[23%] 2xl:w-[19%] items-center gap-4 bg-white px-4 py-3 rounded-xl shadow-sm"
            >
              <FaCreditCard size={20} className="text-black" />
              <p className="text-lg text-black">
                Installment without overpayments
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* popular category */}
      <div className="relative py-10 px-8 md:px-12 ">
        <h2 className="text-4xl font-semibold mb-6 text-center">
          Popular Categories
        </h2>

        {/* Left Arrow */}
        <button
          onClick={() => scrollSlider("left", "slider")}
          className="hidden md:flex absolute left-5 top-[50%] -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <FaChevronLeft />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scrollSlider("right", "slider")}
          className="hidden md:flex absolute right-5 top-[50%] -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <FaChevronRight />
        </button>

        {/* Carousel Container */}
        <div
          className="overflow-x-auto no-scrollbar scroll-smooth "
          id="slider"
        >
          <div className="flex gap-6 w-max">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-gray-50 shadow-sm rounded-xl p-6 min-w-[160px] hover:shadow-md transition"
              >
                <img
                  src={`http://localhost:5000/${encodeURI(
                    cat.image.replaceAll("\\", "/")
                  )}`}
                  alt={cat.title || cat.name}
                  className="w-60 h-50 object-contain mb-4 hover:scale-110 transition-transform"
                />
                <h3 className="text-md font-medium">{cat.name}</h3>
                <p className="text-sm text-center text-gray-500">Products</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* new products */}
      <div>
        <div className="relative px-4 md:px-12 py-10">
          <h2 className="text-xl md:text-4xl font-semibold text-center mb-6">
            New Arrival Products
          </h2>

          {/* Arrows */}
          <button
            onClick={() => scrollSlider("left", "slider2")}
            className="hidden md:flex absolute left-2 top-[50%] -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={() => scrollSlider("right", "slider2")}
            className="hidden md:flex absolute right-2 top-[50%] -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
          >
            <FaChevronRight />
          </button>

          {/* Horizontal Scroll */}
          <div
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-10"
            id="slider2"
          >
            {newArrivals.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 lg:w-[250px] bg-white p-4 rounded-lg shadow-sm"
              >
                {/* Product Image */}
                <div
                  className="w-full h-[200px] flex items-center justify-center rounded-lg bg-cover group cursor-pointer"
                  style={{ backgroundImage: "url('/ring.jpg')" }}
                >
                  <div className="bg-opacity-60 p-4 rounded-xl group-hover:flex gap-3 hidden transition-all">
                    <span className="p-2 bg-white rounded-2xl hover:bg-gray-200">
                      <FaRegHeart />
                    </span>
                    <span className="p-2 bg-white rounded-2xl hover:bg-gray-200">
                      <LuRefreshCw />
                    </span>
                    <span className="p-2 bg-white rounded-2xl hover:bg-gray-200">
                      <IoEye />
                    </span>
                  </div>
                </div>

                {/* Category */}
                <p className="text-sm text-gray-500 mt-3">{item.category}</p>

                {/* Title */}
                <h3 className="text-md font-medium">{item.title}</h3>

                {/* Rating */}
                <div className="flex text-teal-600 mt-1 text-sm">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                {/* Price */}
                <div className="mt-2 text-sm">
                  {item.oldPrice && (
                    <span className="text-gray-400 line-through mr-2">
                      {item.oldPrice}
                    </span>
                  )}
                  <span
                    className={`${
                      item.oldPrice
                        ? "text-teal-600 font-semibold"
                        : "text-black"
                    }`}
                  >
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* advantages section */}
      <div className="mt-5 px-8 ">
        <h2 className="text-4xl font-semibold text-center mb-10">
          Our Advantages
        </h2>
        <div className="flex flex-wrap justify-center">
          {/* Card 1 */}
          <div
            className="w-full sm:w-1/2 lg:w-1/4 p-2"
            ref={(el) => (cardsRef.current[0] = el)}
          >
            <div className="flex items-center gap-3 bg-gray-100 text-gray-800 px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-full">
              <span className="text-xl text-teal-800">
                <FaTags />
              </span>
              <span className="font-medium">Fee-Free Installment</span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="w-full sm:w-1/2 lg:w-1/4 p-2"
            ref={(el) => (cardsRef.current[1] = el)}
          >
            <div className="flex items-center gap-3 bg-gray-100 text-gray-800 px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-full">
              <span className="text-xl text-teal-800">
                <FaShieldAlt />
              </span>
              <span className="font-medium">Best Price Guarantee</span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="w-full sm:w-1/2 lg:w-1/4 p-2"
            ref={(el) => (cardsRef.current[2] = el)}
          >
            <div className="flex items-center gap-3 bg-gray-100 text-gray-800 px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-full">
              <span className="text-xl text-teal-800">
                <FaGift />
              </span>
              <span className="font-medium">Bonus Program XStore</span>
            </div>
          </div>

          {/* Card 4 */}
          <div
            className="w-full sm:w-1/2 lg:w-1/4 p-2"
            ref={(el) => (cardsRef.current[3] = el)}
          >
            <div className="flex items-center gap-3 bg-gray-100 text-gray-800 px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-full">
              <span className="text-xl text-teal-800">
                <FaClock />
              </span>
              <span className="font-medium">Pickup in 15 minutes</span>
            </div>
          </div>

          {/* Card 5 */}
          <div
            className="w-full sm:w-1/2 lg:w-1/4 p-2 hidden sm:block"
            ref={(el) => (cardsRef.current[4] = el)}
          >
            <div className="flex items-center gap-3 bg-gray-100 text-gray-800 px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-full">
              <span className="text-xl text-teal-800">
                <FaShippingFast />
              </span>
              <span className="font-medium">Convenient Delivery</span>
            </div>
          </div>

          {/* Card 6 */}
          <div
            className="w-full sm:w-1/2 lg:w-1/4 p-2 hidden sm:block"
            ref={(el) => (cardsRef.current[5] = el)}
          >
            <div className="flex items-center gap-3 bg-gray-100 text-gray-800 px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-full">
              <span className="text-xl text-teal-800">
                <FaTools />
              </span>
              <span className="font-medium">Services and Services</span>
            </div>
          </div>

          {/* Card 7 */}
          <div
            className="w-full sm:w-1/2 lg:w-1/4 p-2 hidden sm:block"
            ref={(el) => (cardsRef.current[6] = el)}
          >
            <div className="flex items-center gap-3 bg-gray-100 text-gray-800 px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-full">
              <span className="text-xl text-teal-800">
                <FaShippingFast />
              </span>
              <span className="font-medium">Express Delivery in 2 Hours</span>
            </div>
          </div>

          {/* Card 8 */}
          <div
            className="w-full sm:w-1/2 lg:w-1/4 p-2 hidden sm:block"
            ref={(el) => (cardsRef.current[7] = el)}
          >
            <div className="flex items-center gap-3 bg-gray-100 text-gray-800 px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-full">
              <span className="text-xl text-teal-800">
                <FaCheckCircle />
              </span>
              <span className="font-medium">Equipment Acceptance</span>
            </div>
          </div>
        </div>
      </div>
      {/* deal Section */}
      <div className="flex flex-col lg:flex-row gap-5 px-4 md:px-6 lg:px-8 mt-10 mb-2">
        {/* Left Section - Deals of the Day */}
        <div className="w-full lg:w-1/2 border-gray-200 border rounded-lg pt-5 text-xl">
          <h3 className="font-semibold text-center mb-4">Deals Of The Day</h3>
          <div className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-4 px-2">
            {deals.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[250px] bg-white shadow rounded-lg flex flex-col justify-between"
              >
                <div className="p-4">
                  {/* Product Image */}
                  <div className="w-full h-[200px] relative rounded-lg group cursor-pointer">
                    <img
                      src={`http://localhost:5000/${item.image}`}
                      alt={item.title}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  {/* Category */}
                  <p className="text-sm text-gray-500 mt-3">{item.category}</p>

                  {/* Title */}
                  <h3 className="text-md font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  {/* Price */}
                  <div className="mt-2 text-sm">
                    {item.oldPrice && (
                      <span className="text-gray-400 line-through mr-2">
                        $ {item.oldPrice}
                      </span>
                    )}
                    <span
                      className={`${
                        item.oldPrice
                          ? "text-teal-600 font-semibold"
                          : "text-black font-medium"
                      }`}
                    >
                      $ {item.price}
                    </span>
                  </div>

                  {/* Availability & Sold */}
                  <div className="flex justify-between mt-3">
                    <p className="text-sm text-teal-600">
                      <span className="text-gray-500">Available:</span>{" "}
                      {item.available}
                    </p>
                  </div>
                </div>

                {/* Time Info */}
                {item.time && (
                  <div className="mt-2 bg-gray-100 p-2 rounded text-xs text-gray-700">
                    <p>{getRemainingTimeDetailed(item.time.end)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Banners */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          {/* Large Top Banner */}
          <div
            className="w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-1/2 rounded-xl bg-cover bg-center flex items-center ps-5 inner-border-frame"
            style={{ backgroundImage: "url('/Banner-5.jpeg')" }}
          >
            <div className=" bg-opacity-40 p-4 rounded-xl text-white">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Headphones
              </p>
              <p className="text-sm sm:text-lg mt-2 font-semibold">
                Integrated Control and Mode
              </p>
              <button className="mt-4 px-5 py-2 bg-teal-700 text-white text-sm rounded-xl hover:bg-white hover:text-teal-700 transition">
                View Details
              </button>
            </div>
          </div>

          {/* Bottom 2 Banners */}
          <div className="flex flex-col sm:flex-row gap-5 h-[200px] sm:h-[250px] md:h-[280px] lg:h-1/2">
            {/* Left Small Banner */}
            <div
              className="w-full sm:w-1/2 h-full rounded-xl bg-cover bg-center flex items-center ps-5 zoom-hover"
              style={{ backgroundImage: "url('/Banner-6.jpeg')" }}
            >
              <div className="bg-opacity-40 p-4 rounded-xl text-white group">
                <p className="text-xl sm:text-2xl font-bold">
                  Wireless Charger
                </p>
                <p className="text-sm sm:text-md mt-2 font-semibold">
                  Qi-Certified Fast Charging Pad
                </p>
                <Link to="/shop">
                  <button className="opacity-0 mt-3 px-4 py-2 bg-white text-black text-sm rounded-xl transition group-hover:opacity-100">
                    See More
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Small Banner */}
            <div
              className="w-full sm:w-1/2 h-full rounded-xl bg-cover bg-center flex items-center ps-5 zoom-hover"
              style={{ backgroundImage: "url('/Banner-7.jpeg')" }}
            >
              <div className=" bg-opacity-40 p-4 rounded-xl text-white group">
                <p className="text-xl sm:text-2xl font-bold">
                  Protection Cover
                </p>
                <p className="text-sm sm:text-md mt-2 font-semibold">
                  Premium Transparent Hybrid Soft
                </p>
                <Link to="/shop">
                  <button className="opacity-0 mt-3 px-4 py-2 bg-white text-black text-sm rounded-xl transition group-hover:opacity-100">
                    Buy Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* recentlty launched */}
      <div className="bg-gray-100 mt-15">
        <h2 className="font-semibold text-3xl text-center pt-10">
          Recently Launched
        </h2>
        <div className="flex flex-wrap xl:flex-nowrap px-6 py-10 gap-6 ">
          {/* ✅ Left Sidebar */}
          <div className="w-full xl:w-1/3 bg-white">
            <div
              ref={banner3Ref}
              onMouseEnter={() =>
                handleAnimation(banner3Ref.current, "forward")
              }
              onMouseLeave={() =>
                handleAnimation(banner3Ref.current, "reverse")
              }
              className="w-full h-[300px] sm:h-[350px] md:h-[450px] md:w-[100%] lg:h-[400px] bg-cover bg-center flex justify-center pt-5 text-center rounded-xl mirror-animate"
              style={{ backgroundImage: "url('/Banner-8.jpeg')" }}
            >
              <div className="p-6 rounded-xl text-white max-w-md">
                <p className="text-3xl md:text-4xl font-bold">
                  Sony 5G Headphone
                </p>
                <p className="mt-4 text-sm md:text-base font-semibold">
                  Only Music. Nothing Else.
                </p>
                <button className="mt-5 px-6 py-3 bg-teal-700 text-white text-sm rounded-xl hover:bg-white hover:text-teal-700 transition">
                  View Details
                </button>
              </div>
            </div>

            {/* Bottom: Category Links */}
            <div className="py-10 px-5 bg-white text-black">
              <div className="flex flex-wrap gap-y-3">
                {/* Column 1 */}
                <div className="w-1/2 flex flex-col gap-2">
                  {categories
                    .slice(0, Math.ceil(categories.length / 2))
                    .map((cat, i) => (
                      <div
                        key={i}
                        className="flex items-center text-sm cursor-pointer hover:text-teal-600"
                      >
                        <FaAngleRight className="mr-1 mt-[2px]" />
                        {cat.name || cat.label}
                      </div>
                    ))}
                </div>

                {/* Column 2 */}
                <div className="w-1/2 flex flex-col gap-2 ">
                  {categories
                    .slice(Math.ceil(categories.length / 2))
                    .map((cat, i) => (
                      <div
                        key={i}
                        className="flex items-center text-sm cursor-pointer hover:text-teal-600"
                      >
                        <FaAngleRight className="mr-1 mt-[2px]" />
                        {cat.name || cat.label}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Right Product */}
          <div className="w-full xl:w-[75%] flex flex-wrap gap-4 md:gap-6 lg:gap-8">
            {newArrivals.map((_, index) => (
              <div
                key={index}
                className="w-[47%] sm:w-[30%] lg:w-[22%] bg-white p-4 rounded-xl shadow-sm relative group transition-all"
              >
                {/* Image */}
                <div className="relative w-full h-40 flex items-center justify-center rounded-lg overflow-hidden gap-5">
                  <img
                    src="/ring.jpg"
                    alt="product"
                    className="max-h-full object-contain"
                  />
                  <div className="absolute inset-0 hidden group-hover:flex items-center justify-center gap-2 transition">
                    <span className="p-2 bg-white rounded-full hover:bg-gray-200">
                      <FaRegHeart />
                    </span>
                    <span className="p-2 bg-white rounded-full hover:bg-gray-200">
                      <LuRefreshCw />
                    </span>
                    <span className="p-2 bg-white rounded-full hover:bg-gray-200">
                      <IoEye />
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-sm font-medium">
                  Product {index + 1}
                </h3>

                {/* Rating */}
                <div className="flex text-teal-600 mt-1 text-sm">
                  {[...Array(5)].map((_, i) =>
                    index === 5 && i === 4 ? (
                      <FaStarHalfAlt key={i} />
                    ) : (
                      <FaStar key={i} />
                    )
                  )}
                </div>

                {/* Price */}
                <div className="mt-2 text-sm font-semibold text-gray-700">
                  ${(Math.random() * 300 + 20).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* brand section */}
      <div className="brands-section text-center py-10 mt-10">
        <h2 className="text-3xl font-semibold mb-8">Popular Brands</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 px-4 sm:px-10">
          {[
            "/amazon.png",
            "/amd.png",
            "/apper.png",
            "/facebook.png",
            "/fedex.png",
            "/hooli.png",
            "/logitech.png",
            "/netflix.png",
            "/paypal.png",
            "/spotify.png",
          ].map((src, index) => (
            <div
              key={index}
              className="h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden transition-colors hover:bg-gray-200"
            >
              <img
                src={src}
                alt="brand"
                className="grayscale hover:grayscale-0 transform transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* megamarket section */}
      <div className="mt-16">
        <h2 className="font-semibold text-3xl text-center pt-10">
          XStore Elementor Electronic Mega Market
        </h2>

        <div className="flex flex-col xl:flex-row px-4 sm:px-8 lg:px-12 py-10 gap-6">
          {/* Left Product Section */}
          <div
            className="w-full xl:w-[75%] flex flex-wrap gap-4 md:gap-6 lg:gap-8"
            data-aos="fade-right"
          >
            {newArrivals.map((_, index) => (
              <div
                key={index}
                className="w-[47%] sm:w-[30%] lg:w-[22%] bg-white p-4 rounded-xl shadow-sm relative group transition-all"
              >
                {/* Image */}
                <div className="relative w-full h-40 flex items-center justify-center rounded-lg overflow-hidden">
                  <img
                    src="/ring.jpg"
                    alt="product"
                    className="max-h-full object-contain"
                  />
                  <div className="absolute inset-0 hidden group-hover:flex items-center justify-center gap-2 transition">
                    <span className="p-2 bg-white rounded-full hover:bg-gray-200">
                      <FaRegHeart />
                    </span>
                    <span className="p-2 bg-white rounded-full hover:bg-gray-200">
                      <LuRefreshCw />
                    </span>
                    <span className="p-2 bg-white rounded-full hover:bg-gray-200">
                      <IoEye />
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-sm font-medium">
                  Product {index + 1}
                </h3>

                {/* Rating */}
                <div className="flex text-teal-600 mt-1 text-sm">
                  {[...Array(5)].map((_, i) =>
                    index === 5 && i === 4 ? (
                      <FaStarHalfAlt key={i} />
                    ) : (
                      <FaStar key={i} />
                    )
                  )}
                </div>

                {/* Price */}
                <div className="mt-2 text-sm font-semibold text-gray-700">
                  ${(Math.random() * 300 + 20).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Right Banner Section */}
          <div
            className="hidden xl:flex w-full xl:w-[25%] h-[300px] sm:h-[350px] md:h-[450px] xl:h-[600px] items-end justify-center rounded-xl relative overflow-hidden"
            data-aos="fade-left"
          >
            {/* Background Image */}
            <div
              className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-transform duration-500 ease-in-out hover:scale-110"
              style={{ backgroundImage: "url('/Banner-9.jpeg')" }}
            ></div>

            {/* Text Overlay */}
            <div className="relative z-10 p-6 rounded-xl text-white text-center  bg-opacity-40 w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              <p className="text-2xl md:text-3xl font-bold">Ultra Portable</p>
              <p className="mt-3 text-sm md:text-base font-semibold">
                Vibrant Colors with Rugged Fabric Design
              </p>
              <button className="mt-5 px-6 py-3 bg-teal-700 text-white text-sm rounded-xl hover:bg-white hover:text-teal-700 transition-colors duration-300">
                Explore More
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* article section */}
      <div className="px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">
          From Our Articles
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="w-full sm:w-[48%] md:w-[45%] lg:w-[22%] bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Image and Date */}
              <div className="relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-[180px] object-cover rounded-lg shadow-md transition-transform duration-500 hover:scale-108"
                />

                {/* Date Badge */}
                <div className="absolute top-3 left-3 bg-white w-14 h-14 flex flex-col items-center justify-center rounded-full shadow">
                  <span className="font-bold text-lg">{article.date}</span>
                  <span className="text-xs text-gray-500">{article.month}</span>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-3 left-4 bg-teal-600 text-white text-sm px-2 py-1 rounded">
                  {article.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{article.title}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {article.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* bottom section */}
      <div className="flex flex-col lg:flex-row gap-5 px-5 sm:px-10 my-5">
        {/* Left Box */}
        <div
          className="w-full lg:w-1/3 h-[250px] sm:h-[300px] md:h-[400px] lg:h-[250px] bg-cover bg-center flex items-center ps-5 rounded-xl"
          style={{ backgroundImage: "url('/bootom-01.jpeg')" }}
          data-aos="fade-right"
        >
          <div className="bg-opacity-60 p-4 rounded-xl text-black">
            <p className="text-2xl sm:text-3xl font-bold">
              Didn't find anything interesting?
            </p>
            <p className="text-sm sm:text-md text-gray-500 mt-4">
              Perhaps you will find something among our promotions!
            </p>
            <p className="text-sm sm:text-md text-teal-700 mt-4 font-semibold">
              All Promotions.
            </p>
          </div>
        </div>

        {/* Right Box */}
        <div
          className="w-full lg:w-2/3 h-[250px] sm:h-[300px] md:h-[400px] lg:h-[250px] bg-cover bg-center flex items-center rounded-xl"
          style={{ backgroundImage: "url('/bootom-01.jpeg')" }}
          data-aos="fade-left"
        >
          <div className="bg-opacity-60 p-4 rounded-xl text-black flex flex-col gap-5 ps-5 w-full max-w-md">
            <p className="text-xl sm:text-2xl font-bold">
              Get the most interesting offers first to you!
            </p>
            <input
              type="email"
              className="bg-white p-2 rounded-md outline-none"
              placeholder="Your Email"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;

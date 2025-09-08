import React, { useLayoutEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // HERO — fade in on load (no ScrollTrigger)

      // SERVICES — each card animates as it enters
      gsap.fromTo(
        gsap.utils.toArray(".js-service"),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.3, // delay between items
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".js-service",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // ABOUT — image and text as a single timeline
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".js-about",
            start: "top 80%",
            once: true,
            invalidateOnRefresh: true,
          },
        })
        .from(
          ".js-about-img",
          {
            x: -80,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
          },
          0 // start immediately
        )
        .from(
          ".js-about-text h3",
          {
            x: 80,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
          },
          0.2 // slightly after image starts
        )
        .from(
          ".js-about-text p",
          {
            x: 80,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.3, // one by one
          },
          "-=0.5" // overlaps with heading animation
        );

      // STATS — each stat pops in
      gsap.fromTo(
        gsap.utils.toArray(".js-stat"),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".js-stats",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // PRIORITY — image & text slide in together
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".js-priority",
            start: "top 80%",
            once: true,
            invalidateOnRefresh: true,
          },
        })
        .from(
          ".js-priority-img",
          {
            x: -80,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
          },
          0
        )
        .from(
          ".js-priority-text h3, .js-priority-text p",
          {
            x: 80,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.25,
          },
          0.2
        )
        .from(
          ".js-priority-btn button",
          {
            scale: 0.85, // adds a subtle pop
            y: 40, // comes from below
            opacity: 0,
            duration: 0.7,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        ); // overlaps slightly for smoothness

      // Ensure layout is measured after images/fonts load
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        window.removeEventListener("load", onLoad);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="text-gray-800">
      {/* Hero Section */}
      <div className="bg-teal-700 text-white text-center px-4 py-10 md:py-16 rounded-xl mx-4 md:mx-6 lg:mx-10 mt-5 js-hero-in">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug mb-6">
          Electronics Store XStore — <br className="block sm:hidden" />
          Maximum Opportunities
        </h1>
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl mt-6 leading-relaxed">
          XStore is the most modern electronics and accessories store. The
          modern format, instant customer service allowed the company to quickly
          gain confidence in the market of gadgets and electronic devices.
        </p>
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl mt-6 leading-relaxed hidden sm:flex">
          For each client, a convenient opportunity to purchase on the website
          has been created, which allows you to pick up equipment in the
          selected store, get free courier delivery.
        </p>
      </div>

      {/* Services Section */}
      <section className="text-center py-12 px-4 max-w-6xl mx-auto flex flex-col gap-10">
        <h2 className="text-4xl font-semibold mb-8">
          A Complete List of Services of the XStore
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            "Wide network of outlets",
            "Convenient site and delivery",
            "Authorized service centers",
            "Original goods with a guarantee",
          ].map((title, i) => (
            <div
              key={i}
              className="js-service flex gap-3 items-start will-change-transform"
            >
              <FaCheckCircle className="text-teal-600 mt-1 text-5xl" />
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="js-about flex flex-col lg:flex-row gap-12 px-4 py-10 max-w-7xl mx-auto">
        <img
          src="/about-01.jpeg"
          alt="user with product"
          className="js-about-img rounded-xl w-full lg:w-1/2 object-cover will-change-transform"
        />
        <div className="js-about-text lg:w-1/2 flex flex-col gap-10 mt-12 lg:mt-0 will-change-transform pt-15">
          <h3 className="text-4xl font-semibold">
            Serving People for More Than 12 Years With Over 95% Satisfied
            Customers.
          </h3>
          <div className="flex flex-col gap-5">
            <p className="text-gray-600 text-md">
              Nullam accumsan nulla in arcu condimentum imperdiet. Class aptent
              taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Curabitur lacinia purus vitae lorem porttitor
              fermentum. In in mattis erat, eu mattis libero.
            </p>
            <p className="text-gray-600 text-md">
              Sociosqu ad litora torquent per conubia nostra, per inceptos
              himenaeo. Curabitur lacinia purus vitae lorem porttitor fermentum.
              In in mattis erat, eu mattis libero. Donec volutpat faucibus elit
              cursus interdum.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="js-stats py-20 px-4 text-center bg-gray-100">
        <h2 className="text-2xl font-semibold mb-10">We Reached So Far</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
          {[
            { num: "4+", text: "Retail stores opened all over the world" },
            {
              num: "0M",
              text: "Products sold till date through all platforms",
            },
            {
              num: "7K",
              text: "Products sold till date through all platforms",
            },
            { num: "14+", text: "Registered users on all platforms" },
            {
              num: "24/7",
              text: "Quick shipping platforms for fastest transfers",
            },
          ].map((item, i) => (
            <div key={i} className="js-stat will-change-transform">
              <h3 className="text-4xl font-bold">{item.num}</h3>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service Priority Section */}
      <section className="js-priority flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto py-10 px-4">
        <img
          src="/about-02.jpeg"
          alt="support"
          className="js-priority-img rounded-xl w-full md:w-1/2 object-cover will-change-transform"
        />
        <div className="js-priority-text md:w-1/2 space-y-8 will-change-transform">
          <h3 className="js-priority-heading text-4xl font-semibold">
            Service is Our Top Priority
          </h3>
          <p className="js-priority-para text-sm text-gray-600">
            We are available 24/7/365 for you! Do you want to surprise someone?
            Take advantage of our gift service. Do you need advice? One of our
            private shoppers will be happy to help you put together an ideal
            time give priority and get more packages.
          </p>
          <Link to="/contact">
            <button className="js-priority-btn bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition">
              Contact Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;

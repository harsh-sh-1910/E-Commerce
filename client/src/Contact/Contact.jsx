import React, { useEffect, useRef } from "react";
import { FaStore } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // GSAP context ensures animations are scoped and cleaned up
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".js-contact",
          start: "top 80%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      tl.from(".contact-map", {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      })
        .from(
          ".contact-showroom",
          { x: -80, opacity: 0, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        )
        .from(
          ".contact-help",
          { x: 80, opacity: 0, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        )
        .from(
          ".contact-form",
          { y: 50, opacity: 0, duration: 1, ease: "power2.out" },
          "-=0.2"
        );

      ScrollTrigger.refresh(); // ensure positions are correct
    }, containerRef);

    return () => ctx.revert(); // cleanup on unmount
  }, []);

  return (
    <>
      <section
        ref={containerRef}
        className="js-contact flex flex-col lg:flex-row"
      >
        {/* Google Map */}
        <div className="contact-map w-full lg:w-1/2 p-5">
          <iframe
            className="w-full h-[400px] sm:h-[500px] lg:h-screen"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2579687581056!2d77.06528147495638!3d28.622029584558554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d05c881c1a611%3A0xd3b3dde00288fd1e!2sWayramart!5e0!3m2!1sen!2sin!4v1753092258743!5m2!1sen!2sin"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        {/* Contact Info + Form */}
        <div className="w-full lg:w-1/2 px-4 sm:px-8 py-10 lg:py-16 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Showroom Info */}
            <div className="contact-showroom">
              <div className="flex items-center gap-2 mb-4">
                <FaStore className="text-green-600 text-xl" />
                <h2 className="text-2xl font-semibold">Our Showroom</h2>
              </div>
              <p className="text-gray-700 mb-2">
                551 Water Color Green Ball St, New York, NY 2041, USA
              </p>
              <p className="text-gray-700">(+44) 1800 5555 3535</p>
              <p className="text-gray-700">(+44) 1800 9999 6969</p>
            </div>

            {/* Quick Help */}
            <div className="contact-help">
              <div className="flex items-center gap-2 mb-4">
                <FiPhoneCall className="text-green-600 text-xl" />
                <h2 className="text-2xl font-semibold">Quick Help</h2>
              </div>
              <p className="text-gray-700 mb-2">
                You can ask anything you want to know about our products
              </p>
              <p className="text-gray-800 font-medium">support24@xstore.com</p>
              <p className="text-gray-800 font-medium">
                information@xstore.com
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form">
            <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full border rounded-lg p-3 focus:outline-none border-gray-300"
              />
              <input
                type="email"
                placeholder="Your E-mail"
                className="w-full border rounded-lg p-3 focus:outline-none border-gray-300"
              />
              <select className="w-full border rounded-lg p-3 focus:outline-none border-gray-300">
                <option>Technical Help</option>
                <option>Pre-Sale Questions</option>
                <option>Partnerships</option>
              </select>
              <textarea
                rows="5"
                placeholder="Message"
                className="w-full border rounded-lg p-3 focus:outline-none border-gray-300"
              ></textarea>
              <button
                type="submit"
                className="bg-teal-700 text-white px-6 py-3 rounded-xl mt-3 hover:bg-teal-800 transition-all"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

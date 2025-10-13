import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  let classification = null;
  const warehouseCity = "Delhi";
  const warehouseCountry = "India";

  // 🔹 Auto detect location (optional)
  useEffect(() => {
    axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        const loc = {
          city: res.data.city,
          state: res.data.region,
          country: res.data.country_name,
        };
        setLocation(loc);
      })
      .catch(() => setError("Unable to auto-detect location"));
  }, []);

  // 🔹 Fetch location by pincode
  const fetchLocationByPincode = async (pincode) => {
    // ✅ Normal variable, not state

    try {
      if (!pincode || !/^\d{3,10}$/.test(pincode)) {
        setError("❌ Invalid pincode format (must be 3–10 digits)");
        setLocation(null);
        return null;
      }

      setLoading(true);
      setError(null);

      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = res.data?.[0];

      let newLoc = null;

      if (data && data.Status === "Success" && data.PostOffice?.length) {
        const office = data.PostOffice[0];
        newLoc = {
          pincode,
          city: office.District,
          state: office.State,
          country: "India",
        };
      } else {
        const fallback = await axios
          .get(`https://api.zippopotam.us/in/${pincode}`)
          .catch(() => null);

        if (fallback?.data) {
          const place = fallback.data.places?.[0];
          newLoc = {
            pincode,
            city: place["place name"],
            state: place["state"],
            country: fallback.data.country,
          };
        } else {
          setError("Pincode not found. Please check and try again.");
          setLocation(null);
          return null;
        }
      }

      setLocation(newLoc);

      // 🔹 Set classification based on newLoc
      if (newLoc.country.toLowerCase() !== warehouseCountry.toLowerCase()) {
        classification = "International";
      } else if (
        newLoc.city.toLowerCase().includes(warehouseCity.toLowerCase())
      ) {
        classification = "Local";
      } else {
        classification = "Zonal";
      }

      return classification; // ✅ Return it immediately
    } catch (err) {
      console.error("Error fetching pincode info:", err);
      setError("⚠ Failed to fetch location data");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        error,
        loading,
        fetchLocationByPincode,
        setLoading,
        setError,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

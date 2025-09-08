import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [classification, setClassification] = useState(null);
  const [error, setError] = useState(null);

  // Suppose your warehouse is in Delhi, India (change as per your setup)
  const warehouseCity = "Delhi";
  const warehouseCountry = "India";

  useEffect(() => {
    axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        setLocation(res.data);
        setClassification(getClassification(res.data));
      })
      .catch((err) => {
        console.error("Error fetching location:", err);
        setError("Unable to auto-detect location");
      });
  }, []);

  const getClassification = (loc) => {
    if (!loc) return null;
    if (loc.country_name !== warehouseCountry) return "International";
    if (loc.city === warehouseCity) return "Local";
    return "Zonal";
  };

  // For manual pincode input, mock classification logic
  const classifyByPincode = (pincode) => {
    // You can replace this with real API or your own mapping
    if (pincode.startsWith("11")) return "Local"; // Example: Delhi
    if (pincode.startsWith("1")) return "Zonal"; // Example: Same country
    return "International"; // Everything else
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        classification,
        error,
        classifyByPincode,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

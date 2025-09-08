// const axios = require("axios");

// // ======================
// // Get Shiprocket Pickup Locations
// // ======================
// async function getShiprocketPickupLocations(token) {
//   const url = "https://apiv2.shiprocket.in/v1/external/settings/company/pickup";
//   const headers = {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };

//   console.log("=== Fetching Shiprocket Pickup Locations ===");
//   try {
//     const res = await axios.get(url, { headers });
//     console.log("=== Pickup Locations Fetched Successfully ===");
//     console.log("Response Data:", res.data);

//     // Return locations array directly
//     return res.data || [];
//   } catch (error) {
//     console.error(
//       "Error fetching pickup locations:",
//       error.response?.data || error.message
//     );
//     console.error(error);
//     throw new Error("Failed to fetch pickup locations.");
//   }
// }

// // ======================
// // Create Shiprocket Order
// // ======================
// async function createShiprocketOrder(token, orderData) {
//   const url = "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc";
//   const headers = {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };

//   // Get valid pickup locations from Shiprocket
//   const locations = await getShiprocketPickupLocations(token);
//   console.log(locations.data.shipping_address);
//   if (
//     !Array.isArray(locations.data.shipping_address) ||
//     locations.data.shipping_address.length === 0
//   ) {
//     throw new Error(
//       "No pickup locations configured in your Shiprocket account."
//     );
//   }

//   // Validate pickup location
//   let pickupLocation = orderData.pickup_location;
//   const validLocationNames = locations.data.shipping_address.map(
//     (loc) => loc.pickup_location || loc.pickup_location_name
//   );

//   if (!pickupLocation || !validLocationNames.includes(pickupLocation)) {
//     console.warn(
//       `Provided pickup location "${pickupLocation}" is invalid. Using default: "${validLocationNames[0]}"`
//     );
//     pickupLocation = validLocationNames[0];
//   }

//   const payload = {
//     order_id: orderData.order_id,
//     order_date: orderData.order_date,
//     pickup_location: pickupLocation,
//     billing_customer_name: orderData.name,
//     billing_last_name: orderData.lastName || "",
//     billing_address: orderData.address,
//     billing_city: orderData.city,
//     billing_pincode: orderData.pincode,
//     billing_state: orderData.state,
//     billing_country: "India",
//     billing_email: orderData.email,
//     billing_phone: orderData.phone,
//     shipping_is_billing: true,
//     order_items: orderData.items.map((item) => ({
//       name: item.name,
//       sku: item.sku,
//       units: item.qty,
//       selling_price: item.price,
//       discount: 0,
//       tax: 0,
//     })),
//     payment_method: "Prepaid",
//     sub_total: orderData.sub_total,
//     length: 10,
//     breadth: 10,
//     height: 10,
//     weight: 1,
//   };

//   console.log("=== Creating Shiprocket Order ===");
//   console.log("Request Payload:", payload);

//   try {
//     const res = await axios.post(url, payload, { headers });
//     console.log("=== Shiprocket Order Response ===");
//     console.log("Response Data:", res.data);
//     return res.data;
//   } catch (error) {
//     console.error(
//       "Error creating Shiprocket order:",
//       error.response?.data || error.message
//     );
//     throw new Error("Shiprocket order creation failed.");
//   }
// }

// // ======================
// // Assign AWB to Shipment
// // ======================
// async function assignShiprocketAWB(token, shipmentId, courierId = null) {
//   const url = "https://apiv2.shiprocket.in/v1/external/courier/assign/awb";
//   const headers = {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };

//   const payload = { shipment_id: shipmentId };
//   if (courierId) payload.courier_id = courierId;

//   console.log("=== Assigning AWB ===");
//   console.log("Request Payload:", payload);

//   try {
//     const res = await axios.post(url, payload, { headers });
//     console.log("=== AWB Assigned Successfully ===");
//     console.log("Response Data:", res.data);
//     return res.data;
//   } catch (error) {
//     console.error(
//       "Error assigning AWB:",
//       error.response?.data || error.message
//     );
//     throw new Error("Failed to assign AWB.");
//   }
// }

// // ======================
// // Track Shipment
// // ======================
// async function trackShiprocketShipment(token, shipmentId) {
//   const url = `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`;
//   const headers = { Authorization: `Bearer ${token}` };

//   console.log("=== Tracking Shipment ===");
//   try {
//     const res = await axios.get(url, { headers });
//     console.log("=== Shipment Tracking Data ===");
//     console.log("Response Data:", res.data);
//     return res.data;
//   } catch (error) {
//     console.error(
//       "Error tracking shipment:",
//       error.response?.data || error.message
//     );
//     throw new Error("Failed to track shipment.");
//   }
// }

// module.exports = {
//   getShiprocketPickupLocations,
//   createShiprocketOrder,
//   assignShiprocketAWB,
//   trackShiprocketShipment,
// };

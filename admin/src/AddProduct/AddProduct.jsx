import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import EditorJS from "../Components/Editor";
import { Link } from "react-router-dom";

const INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        text: "",
        level: 1,
      },
    },
  ],
};

// const URL = "http://localhost:5000";
const URL = "https://e-commerce-4pcq.onrender.com";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [data, setData] = useState(INITIAL_DATA);

  const [gtinType, setGtinType] = useState("");
  const [gtinValue, setGtinValue] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [mrp, setMrp] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [tax, setTax] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });

  const [upsellProducts, setUpsellProducts] = useState("");
  const [crosssellProducts, setCrosssellProducts] = useState("");
  const [customAttributes, setCustomAttributes] = useState([
    { name: "", value: [], newValue: "" },
  ]);
  const [mainImage, setMainImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [activeTab, setActiveTab] = useState("pricing");
  const [formData, setFormData] = useState({
    title: "",
    keywords: "",
    desc: "",
    slug: "",
  });
  const [shipment, setShipment] = useState({
    local: "",
    zonal: "",
    international: "",
  });
  const [keyFeatures, setKeyFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ key: "", value: "" });
  const [specifications, setSpecifications] = useState([]);
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  const [variations, setVariations] = useState([
    { attributeType: "", options: [] },
  ]);
  // console.log(variations);

  const addVariation = () => {
    setVariations([...variations, { attributeType: "", options: [] }]);
  };

  const removeVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariation = (index, field, value) => {
    const updated = [...variations];
    updated[index][field] = value;
    setVariations(updated);
  };

  const addVariationOption = (vIdx) => {
    const updated = [...variations];
    updated[vIdx].options.push({
      value: "",
      price: "",
      stock: "",
      sku: "",
      image: null,
    });
    setVariations(updated);
  };

  const updateVariationOption = (vIdx, oIdx, field, value) => {
    const updated = [...variations];
    updated[vIdx].options[oIdx][field] = value;
    setVariations(updated);
  };

  const removeVariationOption = (vIdx, oIdx) => {
    const updated = [...variations];
    updated[vIdx].options.splice(oIdx, 1);
    setVariations(updated);
  };
  // Fetch all categories
  const getCategory = async () => {
    try {
      const response = await axios.get(`${URL}/category`);
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Add a new category
  // const handleAddCategory = async () => {
  //   if (newCategory.trim()) {
  //     try {
  //       await axios.post(`${URL}/category`, {
  //         name: newCategory,
  //         parentId: null,
  //       });
  //       getCategory();
  //       setNewCategory("");
  //     } catch (err) {
  //       alert("Category add failed");
  //     }
  //   }
  // };

  // Product CRUD
  const handleProductCreate = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();

      // --- Basic info
      form.append("name", productName);
      form.append("longDesc", JSON.stringify(data));
      form.append(
        "keyFeatures",
        JSON.stringify(
          keyFeatures
            .filter((f) => f.key?.trim() && f.value?.trim())
            .map((f) => ({ name: f.key.trim(), value: f.value.trim() }))
        )
      );
      form.append(
        "specification",
        JSON.stringify(
          specifications
            .filter((s) => s.key?.trim() && s.value?.trim())
            .map((s) => ({ name: s.key.trim(), value: s.value.trim() }))
        )
      );

      // --- Inventory
      form.append(
        "inventory",
        JSON.stringify({
          sku,
          stockQty: stock,
          productType: gtinType,
          productValue: gtinValue,
        })
      );

      // --- Pricing
      form.append(
        "pricing",
        JSON.stringify({ mrp, salePrice, tax, shippingWeight: weight })
      );

      // --- Shipment & Dimensions
      form.append("shipmentCharge", JSON.stringify(shipment));
      form.append("dimension", JSON.stringify(dimensions));

      // --- Relations
      form.append("upsellProducts", upsellProducts);
      form.append("crosssellProducts", crosssellProducts);

      // --- Variations (JSON + files with correct field names)
      const variationsPayload = variations.map((variation, vIndex) => ({
        attribute: variation.attributeType,
        options: variation.options.map((opt, oIndex) => {
          const imageNames = [];

          if (Array.isArray(opt.images)) {
            opt.images.forEach((file, fileIndex) => {
              if (file instanceof File) {
                // ✅ Use the correct field name format expected by backend
                const fieldName = `variationImages[${vIndex}][${oIndex}]`;
                form.append(fieldName, file);
                imageNames.push(file.name);
              } else if (typeof file === "string") {
                imageNames.push(file);
              }
            });
          }

          return {
            productName: opt.productName || "",
            value: opt.value,
            price: opt.price,
            stock: opt.stock,
            sku: opt.sku,
            images: imageNames, // These names are just placeholders
          };
        }),
      }));

      form.append("variations", JSON.stringify(variationsPayload));

      // --- Category & SEO
      form.append("category", selectedCategory);
      form.append("seo", JSON.stringify(formData));

      // --- Main Image
      if (mainImage) form.append("mainImage", mainImage);

      // --- Gallery Images
      galleryImages.forEach((file) => {
        form.append("gallery", file);
      });

      // Debug log
      for (let [key, value] of form.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }

      // --- Send request
      await axios.post(`${URL}/product`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product added!");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message ===
          "A product with this name already exists."
      ) {
        alert("⚠️ Product already exists with this name!");
      } else {
        alert("❌ Failed to create product.");
        console.error(error.response?.data?.message || error.message);
      }
    }
  };

  // Remove main image preview
  const removeImage = () => {
    setMainImage(null);
    setPreviewUrl(null);
  };

  // Gallery
  const addGalleryImage = () => fileInputRef.current.click();

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages((prev) => [...prev, ...files]);
  };

  const removeGalleryImage = (indexToRemove) => {
    setGalleryImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Category expand/collapse
  const toggleCategory = (id) => {
    const newExpanded = new Set(expandedCategories);
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
    setExpandedCategories(newExpanded);
  };

  // Key features logic
  const addKeyFeature = () => {
    if (!newFeature.key || !newFeature.value) return;
    setKeyFeatures([...keyFeatures, newFeature]);
    setNewFeature({ key: "", value: "" });
  };

  const removeKeyFeature = (index) => {
    const updated = keyFeatures.filter((_, i) => i !== index);
    setKeyFeatures(updated);
  };
  const addSpecification = () => {
    if (!newSpec.key || !newSpec.value) return;
    setSpecifications([...specifications, newSpec]);
    setNewSpec({ key: "", value: "" });
  };

  const removeSpecification = (index) => {
    const updated = specifications.filter((_, i) => i !== index);
    setSpecifications(updated);
  };
  // Custom attributes logic
  const addCustomAttribute = () =>
    setCustomAttributes([
      ...customAttributes,
      { name: "", value: [], newValue: "" },
    ]);
  const updateCustomAttribute = (index, field, value) => {
    setCustomAttributes(
      customAttributes.map((attr, i) =>
        i === index ? { ...attr, [field]: value } : attr
      )
    );
  };
  const addAttributeValuesFromComma = (index) => {
    const updated = [...customAttributes]; // clone the array
    const rawInput = updated[index].newValue.trim(); // get input and trim it
    if (rawInput) {
      const newValues = rawInput
        .split(",") // split on commas
        .map((v) => v.trim()) // trim each value
        .filter((v) => v && !updated[index].value.includes(v)); // remove empty/duplicates
      updated[index].value = [...updated[index].value, ...newValues]; // add new ones
      updated[index].newValue = ""; // reset input field
      setCustomAttributes(updated); // update state
    }
  };

  const removeAttributeValue = (index, valueIndex) => {
    const updated = [...customAttributes];
    updated[index].value.splice(valueIndex, 1);
    setCustomAttributes(updated);
  };

  // Category tree rendering
  const renderCategoryTree = (cats, level = 0) =>
    cats.map((category) => (
      <div key={category._id} className="mb-2 ml-4">
        <div className="flex items-center justify-between bg-white border px-4 py-2 rounded shadow-sm">
          <div className="flex items-center gap-3">
            {category.children?.length > 0 && (
              <button
                onClick={() => toggleCategory(category._id)}
                className="text-gray-500"
              >
                {expandedCategories.has(category._id) ? "▼" : "▶"}
              </button>
            )}
            <input
              type="radio"
              name="category"
              value={category._id}
              checked={selectedCategory === category._id}
              onChange={() => setSelectedCategory(category._id)}
              className="form-radio text-blue-600"
            />
            <span>{category.name}</span>
          </div>
        </div>
        {expandedCategories.has(category._id) &&
          category.children?.length > 0 && (
            <div className="ml-6 mt-1">
              {renderCategoryTree(category.children, level + 1)}
            </div>
          )}
      </div>
    ));

  // Image selector
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setMainImage(file);
      // ✅ Make sure to use window.URL to avoid conflicts
      setPreviewUrl(window.URL.createObjectURL(file));
    } else {
      alert("Only PNG/JPG images under 5MB are allowed");
    }
  };

  // Slug logic
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };
    if (name === "title" && !formData.isSlugEdited) {
      updatedData.slug = generateSlug(value);
    }
    if (name === "slug") {
      updatedData.isSlugEdited = true;
    }
    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle SEO data submit here if needed.
    console.log("SEO form data:", formData);
  };
  // Initial data load
  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="px-5 pt-10 text-4xl font-bold">Add Product</h1>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* left section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter product name"
                  />
                </div>
                {/* Inventory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inventory
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* SKU */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Enter SKU"
                      />
                    </div>

                    {/* GTIN Type Selector */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Select Product Code Type
                      </label>
                      <select
                        value={gtinType}
                        onChange={(e) => setGtinType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select Type</option>
                        <option value="GTIN">GTIN</option>
                        <option value="UPC">UPC</option>
                        <option value="EAN">EAN</option>
                        <option value="EAN">ISBN</option>
                      </select>
                    </div>

                    {/* GTIN Input Field (conditional) */}
                    {gtinType && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          {gtinType} Number
                        </label>
                        <input
                          type="text"
                          value={gtinValue}
                          onChange={(e) => setGtinValue(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder={`Enter ${gtinType}`}
                        />
                      </div>
                    )}

                    {/* Stock Quantity */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Enter stock quantity"
                      />
                    </div>
                  </div>
                </div>
                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Features
                  </label>

                  <div className="space-y-3">
                    {/* Render existing readonly features */}
                    {keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature.key}
                          readOnly
                          className="w-1/3 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                        />
                        <input
                          type="text"
                          value={feature.value}
                          readOnly
                          className="w-2/3 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                        />
                        <button
                          onClick={() => removeKeyFeature(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <MdDeleteOutline size={18} />
                        </button>
                      </div>
                    ))}

                    {/* Add new feature inputs */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newFeature.key}
                        onChange={(e) =>
                          setNewFeature({ ...newFeature, key: e.target.value })
                        }
                        className="w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Feature Key"
                      />
                      <input
                        type="text"
                        value={newFeature.value}
                        onChange={(e) =>
                          setNewFeature({
                            ...newFeature,
                            value: e.target.value,
                          })
                        }
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Feature Value"
                      />
                      <button
                        onClick={addKeyFeature}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <i className="fas fa-plus mr-1"></i>Add
                      </button>
                    </div>
                  </div>
                </div>
                {/* long description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Long Description
                  </label>
                  <div className="border rounded-sm border-gray-300">
                    <EditorJS
                      data={data}
                      onChange={setData}
                      editorBlock="editorjs-container"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* General Desc*/}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab("pricing")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                      activeTab === "pricing"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Pricing & Shipping
                  </button>
                  <button
                    onClick={() => setActiveTab("relations")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                      activeTab === "relations"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Product Relations
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "pricing" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        MRP (Maximum Retail Price)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500 text-sm">
                          &#8377;
                        </span>
                        <input
                          type="text"
                          value={mrp}
                          onChange={(e) => setMrp(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sale Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500 text-sm">
                          &#8377;
                        </span>
                        <input
                          type="text"
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax (%)
                      </label>
                      <input
                        type="text"
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Weight (kg)
                      </label>
                      <input
                        type="text"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="0.0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dimensions (L × W × H)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={dimensions.length}
                          onChange={(e) =>
                            setDimensions({
                              ...dimensions,
                              length: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Length"
                        />
                        <input
                          type="text"
                          value={dimensions.width}
                          onChange={(e) =>
                            setDimensions({
                              ...dimensions,
                              width: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Width"
                        />
                        <input
                          type="text"
                          value={dimensions.height}
                          onChange={(e) =>
                            setDimensions({
                              ...dimensions,
                              height: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Height"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipment Charges (₹)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          value={shipment.local}
                          onChange={(e) =>
                            setShipment({
                              ...shipment,
                              local: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Local"
                        />
                        <input
                          type="number"
                          value={shipment.zonal}
                          onChange={(e) =>
                            setShipment({
                              ...shipment,
                              zonal: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Zonal"
                        />
                        <input
                          type="number"
                          value={shipment.international}
                          onChange={(e) =>
                            setShipment({
                              ...shipment,
                              international: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="International"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "relations" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Linked Upsell Products
                      </label>
                      <input
                        type="text"
                        value={upsellProducts}
                        onChange={(e) => setUpsellProducts(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Search and select products"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Linked Cross-sell Products
                      </label>
                      <input
                        type="text"
                        value={crosssellProducts}
                        onChange={(e) => setCrosssellProducts(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Search and select products"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* specification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Specifications
              </label>

              <div className="space-y-3">
                {/* Existing specifications (readonly) */}
                {specifications.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={spec.key}
                      readOnly
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      readOnly
                      className="w-2/3 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                    />
                    <button
                      onClick={() => removeSpecification(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <MdDeleteOutline size={18} />
                    </button>
                  </div>
                ))}

                {/* New specification input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSpec.key}
                    onChange={(e) =>
                      setNewSpec({ ...newSpec, key: e.target.value })
                    }
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Specification Key"
                  />
                  <input
                    type="text"
                    value={newSpec.value}
                    onChange={(e) =>
                      setNewSpec({ ...newSpec, value: e.target.value })
                    }
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Specification Value"
                  />
                  <button
                    onClick={addSpecification}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <i className="fas fa-plus mr-1"></i>Add
                  </button>
                </div>
              </div>
            </div>
            {/* product variations */}
            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Product Variations
              </label>
              <div className="space-y-5">
                {variations.map((variation, vIdx) => (
                  <div key={vIdx} className="space-y-3 border p-4 rounded-lg">
                    {/* Attribute Name */}
                    <input
                      type="text"
                      value={variation.attributeType}
                      onChange={(e) =>
                        updateVariation(vIdx, "attributeType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Attribute type (e.g. Color, Size)"
                    />

                    {/* Add new option */}
                    {variation.attributeType && (
                      <button
                        type="button"
                        onClick={() => addVariationOption(vIdx)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                      >
                        + Add Option
                      </button>
                    )}

                    {/* List of options */}
                    {variation.options.length > 0 && (
                      <div className="space-y-3 mt-3">
                        {variation.options.map((opt, oIdx) => {
                          const fileInputRef =
                            opt.fileInputRef || React.createRef();

                          return (
                            <div
                              key={oIdx}
                              className="flex flex-col gap-3 border-b pb-3"
                            >
                              {/* Row 1: Inputs */}
                              <div className="flex flex-wrap gap-3 items-center">
                                <input
                                  type="text"
                                  value={opt.value}
                                  onChange={(e) =>
                                    updateVariationOption(
                                      vIdx,
                                      oIdx,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 px-3 py-2 border rounded text-sm"
                                  placeholder="Option value (e.g. Red)"
                                />

                                <input
                                  type="text"
                                  value={opt.productName || ""}
                                  onChange={(e) =>
                                    updateVariationOption(
                                      vIdx,
                                      oIdx,
                                      "productName",
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 px-3 py-2 border rounded text-sm"
                                  placeholder="Product Name"
                                />

                                <input
                                  type="number"
                                  value={opt.price || ""}
                                  onChange={(e) =>
                                    updateVariationOption(
                                      vIdx,
                                      oIdx,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  className="w-28 px-3 py-2 border rounded text-sm"
                                  placeholder="Price"
                                />

                                <input
                                  type="number"
                                  value={opt.stock || ""}
                                  onChange={(e) =>
                                    updateVariationOption(
                                      vIdx,
                                      oIdx,
                                      "stock",
                                      e.target.value
                                    )
                                  }
                                  className="w-24 px-3 py-2 border rounded text-sm"
                                  placeholder="Stock"
                                />

                                <input
                                  type="text"
                                  value={opt.sku || ""}
                                  onChange={(e) =>
                                    updateVariationOption(
                                      vIdx,
                                      oIdx,
                                      "sku",
                                      e.target.value
                                    )
                                  }
                                  className="w-32 px-3 py-2 border rounded text-sm"
                                  placeholder="SKU"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeVariationOption(vIdx, oIdx)
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <MdDeleteOutline size={18} />
                                </button>
                              </div>

                              {/* Row 2: Image picker (gallery style, multiple images) */}
                              <div className="bg-white rounded-lg">
                                <div className="grid grid-cols-2 gap-3">
                                  {opt.images && opt.images.length > 0
                                    ? opt.images.map((img, imgIdx) => (
                                        <div key={imgIdx} className="relative">
                                          <img
                                            src={
                                              typeof img === "string"
                                                ? img
                                                : window.URL.createObjectURL(
                                                    img
                                                  )
                                            }
                                            alt={`Variation ${imgIdx + 1}`}
                                            className="w-full h-24 object-cover !rounded-button"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newImages =
                                                opt.images.filter(
                                                  (_, i) => i !== imgIdx
                                                );
                                              updateVariationOption(
                                                vIdx,
                                                oIdx,
                                                "images",
                                                newImages
                                              );
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 !rounded-button hover:bg-red-600 cursor-pointer"
                                          >
                                            <MdDeleteOutline />
                                          </button>
                                        </div>
                                      ))
                                    : null}

                                  {/* Add button */}
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="w-full border-2 border-dashed border-gray-300 !rounded-button p-4 text-center hover:border-gray-400 cursor-pointer whitespace-nowrap"
                                  >
                                    <i className="fas fa-plus text-gray-400 mr-2"></i>
                                    <span className="text-sm text-gray-600">
                                      Add Option Image
                                    </span>
                                  </button>
                                </div>

                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  ref={fileInputRef}
                                  onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    const newImages = opt.images
                                      ? [...opt.images, ...files]
                                      : files;
                                    updateVariationOption(
                                      vIdx,
                                      oIdx,
                                      "images",
                                      newImages
                                    );
                                  }}
                                  style={{ display: "none" }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Delete whole attribute */}
                    <button
                      type="button"
                      onClick={() => removeVariation(vIdx)}
                      className="text-red-600 hover:text-red-800 text-xs mt-2"
                    >
                      Remove Attribute
                    </button>
                  </div>
                ))}

                {/* Add new variation */}
                <button
                  type="button"
                  onClick={addVariation}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4"
                >
                  + Add Attribute
                </button>
              </div>
            </div>
          </div>
          {/* right section */}
          <div className="space-y-6">
            {/* Main Img */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Main Product Image
              </h3>

              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Main product"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <MdDeleteOutline size={20} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="mainImageInput"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer block"
                >
                  <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-3"></i>
                  <p className="text-sm text-gray-600">
                    Click to upload main image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                  <input
                    id="mainImageInput"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleMainImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {/* Gallery Img */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Gallery
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover !rounded-button"
                    />
                    <button
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 !rounded-button hover:bg-red-600 cursor-pointer"
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addGalleryImage}
                className="w-full border-2 border-dashed border-gray-300 !rounded-button p-4 text-center hover:border-gray-400 cursor-pointer whitespace-nowrap"
              >
                <i className="fas fa-plus text-gray-400 mr-2"></i>
                <span className="text-sm text-gray-600">Add Gallery Image</span>
              </button>

              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleGalleryUpload}
                style={{ display: "none" }}
              />
            </div>
            {/* Category */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Category
              </h3>
              <div className="space-y-2">
                {categories.length > 0 ? (
                  renderCategoryTree(categories)
                ) : (
                  <p className="text-gray-500">No categories yet</p>
                )}
              </div>
              <Link to="/category">
                <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap">
                  <i className="fas fa-plus mr-1"></i>
                  Add New Category
                </button>
              </Link>
            </div>
            {/* slug section */}
            <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
              <h2 className="text-xl font-bold mb-4">SEO </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. headphones, bluetooth, wireless"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter description"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="slug-url-format"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 mt-5 !rounded-button hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer "
          onClick={handleProductCreate}
        >
          <i className="fas fa-save mr-2"></i>
          Save & Publish
        </button>
      </div>
    </div>
  );
};

export default AddProduct;

const Category = require("../models/Category");
const Product = require("../models/Product");

// Helper to safely parse JSON
const safeParse = (jsonStr, fallback) => {
  try {
    return JSON.parse(jsonStr || fallback);
  } catch (err) {
    console.log("Failed to parse JSON:", err.message);
    return fallback.startsWith("[") ? [] : {};
  }
};

// --- Create Product ---
const createProduct = async (req, res) => {
  try {
    const { name, category } = req.body;

    // --- Duplicate check
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "A product with this name already exists.",
      });
    }

    // --- Validate category
    const isCategory = await Category.findById(category);
    if (!isCategory) {
      return res.status(400).json({ message: "CATEGORY NOT FOUND" });
    }

    // --- Parse fields safely
    const longDesc = safeParse(req.body.longDesc, "{}");
    const keyFeatures = safeParse(req.body.keyFeatures, "[]")
      .filter((f) => f?.name?.trim() && f?.value?.trim())
      .map((f) => ({ name: f.name.trim(), value: f.value.trim() }));

    const specification = safeParse(req.body.specification, "[]")
      .filter((s) => s?.name?.trim() && s?.value?.trim())
      .map((s) => ({ name: s.name.trim(), value: s.value.trim() }));

    const variationsRaw = JSON.parse(req.body.variations);
    const inventory = safeParse(req.body.inventory, "{}");
    const pricing = safeParse(req.body.pricing, "{}");
    const dimension = safeParse(req.body.dimension, "{}");
    const shipmentCharge = safeParse(req.body.shipmentCharge, "{}");
    const seo = safeParse(req.body.seo, "{}");

    // --- Relation parsing
    const relation = {
      upsell: req.body.upsellProducts
        ? req.body.upsellProducts
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean)
        : [],
      crossSell: req.body.crosssellProducts
        ? req.body.crosssellProducts
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean)
        : [],
    };

    // console.log("Files received:", req.files);

    // --- Categorize files manually because of upload.any()
    let mainImage = "";
    const gallery = [];
    const fileMap = {}; // For variation images

    (req.files || []).forEach((file) => {
      if (file.fieldname === "mainImage") {
        mainImage = file.filename;
      } else if (file.fieldname === "gallery") {
        gallery.push(file.filename);
      } else if (file.fieldname.startsWith("variationImages")) {
        // Expect field name like: variationImages[0][1]
        const match = file.fieldname.match(/variationImages\[(\d+)\]\[(\d+)\]/);
        if (match) {
          const vIdx = match[1];
          const oIdx = match[2];
          if (!fileMap[vIdx]) fileMap[vIdx] = {};
          if (!fileMap[vIdx][oIdx]) fileMap[vIdx][oIdx] = [];
          fileMap[vIdx][oIdx].push(file.filename);
        }
      }
    });

    // --- Merge uploaded variation images into variations JSON
    variationsRaw.forEach((variation, vIdx) => {
      variation.options.forEach((opt, oIdx) => {
        if (fileMap[vIdx]?.[oIdx]) {
          opt.images = fileMap[vIdx][oIdx]; // assign array of images
        } else {
          opt.images = opt.images || []; // ensure it's always an array
        }
        opt.productName = opt.productName?.trim() || "";
        opt.price = Number(opt.price) || 0;
        opt.stock = Number(opt.stock) || 0;
      });
    });

    // --- Ensure required fields
    if (!mainImage) {
      return res
        .status(400)
        .json({ success: false, message: "Main image is required." });
    }
    if (!inventory.sku || !inventory.stockQty) {
      return res.status(400).json({
        success: false,
        message: "SKU and Stock Quantity are required.",
      });
    }
    if (!seo.title || !seo.keywords || !seo.desc || !seo.slug) {
      return res
        .status(400)
        .json({ success: false, message: "SEO fields are required." });
    }

    // --- Save product
    const newProduct = new Product({
      name,
      category,
      categoryName: isCategory.name,
      inventory: {
        sku: inventory.sku,
        stockQty: Number(inventory.stockQty),
        productType: inventory.productType || "",
        productValue: inventory.productValue || "",
      },
      longDesc,
      keyFeatures,
      specification,
      variations: variationsRaw,
      pricing: {
        mrp: Number(pricing.mrp) || 0,
        salePrice: Number(pricing.salePrice) || 0,
        tax: Number(pricing.tax) || 0,
        shippingWeight: Number(pricing.shippingWeight) || 0,
      },
      shipmentCharge: {
        local: Number(shipmentCharge.local) || 0,
        zonal: Number(shipmentCharge.zonal) || 0,
        international: Number(shipmentCharge.international) || 0,
      },
      dimension: {
        length: Number(dimension.length) || 0,
        width: Number(dimension.width) || 0,
        height: Number(dimension.height) || 0,
      },
      relation,
      seo,
      mainImage,
      gallery,
    });
    console.log(newProduct);

    const savedProduct = await newProduct.save();
    console.log("Saved product:", savedProduct);

    return res.status(201).json({ success: true, product: savedProduct });
  } catch (err) {
    console.error("Product creation failed:", err);
    return res.status(400).json({
      success: false,
      message: `Product creation failed: ${err.message}`,
    });
  }
};

// --- Get All Products ---
const getAllProducts = async (req, res) => {
  try {
    const data = await Product.find({});
    if (!data.length) {
      return res.status(400).json({ message: "NO PRODUCT EXISTS" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Get Single Product by Slug ---
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ "seo.slug": id });
    if (!product) {
      return res.status(400).json({ message: "PRODUCT NOT FOUND" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Get Products by Category ---
const getProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const product = await Product.find({ category: categoryId });
    if (!product.length) {
      return res.status(400).json({ message: "PRODUCT NOT FOUND" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Update Product ---
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ message: "PRODUCT NOT FOUND" });
    }

    // Parse all incoming fields (similar to createProduct)
    const inventory = safeParse(req.body.inventory, "{}");
    const pricing = safeParse(req.body.pricing, "{}");
    const longDesc = safeParse(req.body.longDesc, "{}");
    const relation = safeParse(req.body.relation, "{}");
    const seo = safeParse(req.body.seo, "{}");
    const keyFeatures = safeParse(req.body.keyFeatures, "[]");
    const specification = safeParse(req.body.specification, "[]");
    const variations = safeParse(req.body.variations, "[]");
    const dimension = safeParse(req.body.dimension, "{}");
    const shipmentCharge = safeParse(req.body.shipmentCharge, "{}");

    // Update fields
    product.name = req.body.name || product.name;
    product.inventory = inventory || product.inventory;
    product.longDesc = longDesc || product.longDesc;
    product.keyFeatures = keyFeatures || product.keyFeatures;
    product.specification = specification || product.specification;
    product.variations = variations || product.variations;
    product.pricing = pricing || product.pricing;
    product.relation = relation || product.relation;
    product.seo = seo || product.seo;
    product.dimension = dimension || product.dimension;
    product.shipmentCharge = shipmentCharge || product.shipmentCharge;

    // Handle new images if uploaded
    if (req.files?.mainImage?.[0]) {
      product.mainImage = req.files.mainImage[0].filename;
    }
    if (req.files?.gallery?.length) {
      product.gallery = req.files.gallery.map((file) => file.filename);
    }

    await product.save();
    return res.status(200).json({ message: "PRODUCT UPDATED SUCCESSFULLY" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Delete Product ---
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ message: "PRODUCT NOT FOUND" });
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "PRODUCT DELETED SUCCESSFULLY" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getProductByCategory,
  updateProduct,
  deleteProduct,
};

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    inventory: {
      sku: { type: String, required: true },
      stockQty: { type: Number, required: true },
      productType: { type: String, required: true },
      productValue: { type: String, required: true },
    },

    keyFeatures: {
      type: [
        {
          name: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      default: [],
    },

    specification: {
      type: [
        {
          name: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      default: [],
    },

    longDesc: { type: Object, required: true },

    pricing: {
      mrp: { type: Number, required: true },
      salePrice: { type: Number, required: true },
      tax: { type: Number, required: true },
      shippingWeight: { type: Number, required: true },
    },

    shipmentCharge: {
      local: { type: Number, required: true, default: 0 },
      zonal: { type: Number, required: true, default: 0 },
      international: { type: Number, required: true, default: 0 },
    },

    dimension: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },

    relation: {
      upsell: {
        type: [String], // or [mongoose.Schema.Types.ObjectId]
        default: [],
      },
      crossSell: {
        type: [String], // or [mongoose.Schema.Types.ObjectId]
        default: [],
      },
    },

    variations: [
      {
        attribute: { type: String },
        options: [
          {
            value: { type: String },
            images: [{ type: String }],
            price: { type: Number },
            productName: { type: String, trim: true },
            stock: { type: Number, default: 0 },
            sku: { type: String, trim: true },
          },
        ],
      },
    ],

    mainImage: { type: String, required: true },
    gallery: { type: [String], default: [] },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    categoryName: { type: String, required: true },

    seo: {
      title: { type: String, required: true },
      keywords: { type: String, required: true },
      desc: { type: String, required: true },
      slug: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

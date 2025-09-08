const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");
const Order = require("../models/Order");
const mongoose = require("mongoose");

const createReview = async (req, res) => {
  try {
    const { userId, productId, uName, productName, rating, comment } = req.body;

    // 1. Check all fields
    if (
      !userId ||
      !productId ||
      !uName ||
      !productName ||
      !rating ||
      !comment
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if user has purchased the product
    const userOrder = await Order.findOne({
      "customerInfo.userId": userId,
    });

    console.log(userOrder);
    if (!userOrder) {
      return res
        .status(403)
        .json({ message: "You must purchase this product to write a review." });
    }

    // 3. Check for duplicate review
    const duplicate = await Review.findOne({ uName, productName });
    if (duplicate) {
      return res.status(400).json({ message: "Review already exists" });
    }

    // 4. Create new review
    const newReview = new Review({
      userId,
      productId,
      uName,
      productName,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json({ message: "Successfully created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const data = await Review.find({});
    if (!data.length) {
      return res.status(400).json({ message: "NO REVIEWS EXISTS" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewByProductId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    console.log(id);
    const reviews = await Review.find({ productId: id }).sort({
      createdAt: -1,
    });

    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this product" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error while fetching reviews" });
  }
};
const getSingleReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(400).json({ message: "NO REVIEW EXIST" });
    }
    req.json(review);
  } catch (error) {
    res.statu(500).json({ message: error.message });
  }
};
const updateReview = async (req, res) => {
  try {
    const { id } = req.param;
    const { userId, productId, uName, productName, rating, comment } = req.body;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(400).json({ message: "NO REVIEW EXIST" });
    }
    review.userId = userId;
    review.productId = productId;
    review.uName = uName;
    review.productName = productName;
    review.rating = rating;
    review.comment = comment;

    await review.save();
    return res.status(200).json({ mesage: "REVIEW SUCCESSFULLY UPDATED" });
  } catch (error) {
    res.staus(500).json({ message: error.message });
  }
};
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(400).json({ message: "NO REVIEW EXIST" });
    }
    await Review.findByIdAndDelete(id);
    return res.status(200).json({ message: "REVIEW SUCCESSFULLY DELETED" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  getReviewByProductId,
  updateReview,
  deleteReview,
};

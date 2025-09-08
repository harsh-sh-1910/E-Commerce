const Category = require("../models/Category");
// create a new category
// desc post
const createCategory = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "ALL FIELDS ARE REQUIRED" });
    }

    // Check if parent category exists
    if (parentId) {
      const parentExist = await Category.findOne({ _id: parentId });
      if (!parentExist) {
        return res.status(400).json({ message: "PARENT CATEGORY NOT FOUND" });
      }
    }

    //  Check for duplicate category name
    const duplicate = await Category.findOne({ name });
    if (duplicate) {
      return res.status(400).json({ message: "CATEGORY ALREADY EXISTS" });
    }

    // ✅ Build category object
    const categoryObj = { name };

    if (parentId) {
      categoryObj.parentId = parentId;
    }

    if (req.file) {
      categoryObj.image = req.file.path;
    }

    const category = new Category(categoryObj);
    await category.save();

    if (category) {
      res.status(200).json({
        message: "CATEGORY CREATED SUCCESSFULLY",
        data: category,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all categories
// desc get
const getAllCategory = async (req, res) => {
  try {
    const data = await Category.find({}).lean();

    if (!data.length) {
      return res.status(400).json({ message: "NO CATEGORY EXISTS" });
    }

    const buildCategoryTree = (categories, parentId = null) => {
      return categories
        .filter((cat) => String(cat.parentId) === String(parentId))
        .map((cat) => ({
          ...cat,
          children: buildCategoryTree(categories, cat._id),
        }));
    };

    const categoryTree = buildCategoryTree(data);

    res.json(categoryTree);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// update category
// desc put
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    category.name = name;

    if (typeof parentId !== "undefined") {
      category.parentId = parentId === "none" ? null : parentId;
    }

    await category.save();

    res.status(200).json({ message: "Category Successfully Updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// delete category
// desc delete
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "CATEGORY NOT FOUND" });
    }

    await Category.deleteMany({ parentId: id });

    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "CATEGORY DELETED SUCCESSFULLY" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};

import React, { useState, useEffect } from "react";
import axios from "axios";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [titleInput, setTitleInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // const URL = "http://localhost:5000";
  const URL = "https://e-commerce-4pcq.onrender.com";

  // 🟡 Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${URL}/category`);
      setCategories(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Helper function to find parent category ID
  const findParentCategory = (categoryId, cats, parentId = null) => {
    for (const category of cats) {
      if (category._id === categoryId) {
        return parentId;
      }
      if (category.children?.length > 0) {
        const found = findParentCategory(
          categoryId,
          category.children,
          category._id
        );
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  };

  // Helper function to expand parent categories up to the selected category
  const expandPathToCategory = (categoryId, cats, path = []) => {
    for (const category of cats) {
      const currentPath = [...path, category._id];
      if (category._id === categoryId) {
        return currentPath.slice(0, -1); // Return path without the target category itself
      }
      if (category.children?.length > 0) {
        const found = expandPathToCategory(
          categoryId,
          category.children,
          currentPath
        );
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  // Enhanced category selection handler
  const handleCategorySelection = (categoryId) => {
    if (categoryId === "none" || categoryId === "") {
      setSelectedCategory(categoryId);
      return;
    }

    // Find and expand parent categories
    const parentPath = expandPathToCategory(categoryId, categories);
    if (parentPath) {
      const newExpanded = new Set(expandedCategories);
      parentPath.forEach((parentId) => newExpanded.add(parentId));
      setExpandedCategories(newExpanded);
    }

    setSelectedCategory(categoryId);
  };

  // 🟢 Add category
  const handleAddCategory = async () => {
    if (!titleInput.trim()) return;

    const formData = new FormData();
    formData.append("name", titleInput);
    formData.append(
      "parentId",
      selectedCategory === "none" ? "" : selectedCategory
    );
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${URL}/category`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchCategories();
      setTitleInput("");
      setSelectedCategory("");
      setCategoryImage(null);
    } catch (error) {
      console.error("Create error", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Update category
  const handleUpdateCategory = async (id, name) => {
    const updatedName = prompt("Enter new category name:", name);
    if (!updatedName) return;

    try {
      await axios.patch(`${URL}/category/${id}`, { name: updatedName });
      fetchCategories();
    } catch (err) {
      console.error("Update error", err);
    }
  };

  // 🔴 Delete category
  const handleDeleteCategory = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${URL}/category/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  // Enhanced tree rendering with selection highlighting
  const renderCategoryTree = (cats, level = 0) =>
    cats.map((category) => {
      const isSelected = selectedCategory === category._id;
      const hasSelectedChild = checkIfHasSelectedChild(category);

      return (
        <div key={category._id} className="mb-2 ml-4">
          <div
            className={`flex items-center justify-between border px-4 py-2 rounded shadow-sm cursor-pointer transition-colors ${
              isSelected
                ? "bg-blue-100 border-blue-300"
                : hasSelectedChild
                ? "bg-blue-50 border-blue-200"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => handleCategorySelection(category._id)}
          >
            <div className="flex items-center gap-3">
              {category.children?.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(category._id);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedCategories.has(category._id) ? "▼" : "▶"}
                </button>
              )}
              {category.image && (
                <img
                  src={`${URL}/${encodeURI(
                    category.image.replaceAll("\\", "/")
                  )}`}
                  className="w-10 h-10 object-cover rounded"
                  alt={category.name}
                />
              )}
              <span className={isSelected ? "font-semibold text-blue-700" : ""}>
                {category.name}
              </span>
              {isSelected && (
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  Selected
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(category._id);
                }}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          {expandedCategories.has(category._id) &&
            category.children?.length > 0 && (
              <div className="ml-6 mt-1">
                {renderCategoryTree(category.children, level + 1)}
              </div>
            )}
        </div>
      );
    });

  // Helper function to check if a category has a selected child
  const checkIfHasSelectedChild = (category) => {
    if (!category.children || category.children.length === 0) return false;

    for (const child of category.children) {
      if (child._id === selectedCategory || checkIfHasSelectedChild(child)) {
        return true;
      }
    }
    return false;
  };

  // Toggle expand/collapse
  const toggleCategory = (id) => {
    const newExpanded = new Set(expandedCategories);
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
    setExpandedCategories(newExpanded);
  };

  // Flatten category list
  const getAllCategories = (cats) => {
    let result = [];
    cats.forEach((cat) => {
      result.push(cat);
      if (cat.children?.length > 0) {
        result = result.concat(getAllCategories(cat.children));
      }
    });
    return result;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Category Manager</h1>

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Category name"
              className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategorySelection(e.target.value)}
              className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Parent Category</option>
              <option value="none">None (Parent)</option>
              {getAllCategories(categories).map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCategoryImage(e.target.files[0])}
              className="border px-4 py-2 rounded w-full col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddCategory}
            disabled={!titleInput.trim() || loading}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>

        {/* Tree */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Category Tree</h2>
          <div className="mb-4 text-sm text-gray-600">
            Click on any category to select it. Parent categories will
            automatically expand when child categories are selected.
          </div>
          {categories.length > 0 ? (
            renderCategoryTree(categories)
          ) : (
            <p className="text-gray-500">No categories yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;

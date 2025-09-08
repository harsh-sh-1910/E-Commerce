import React, { useState, useEffect } from "react";
import axios from "axios";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [titleInput, setTitleInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:5000";

  // 🟡 Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/category`);
      setCategories(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
      const res = await axios.post(`${BASE_URL}/category`, formData, {
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
      await axios.patch(`${BASE_URL}/category/${id}`, { name: updatedName });
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
      await axios.delete(`${BASE_URL}/category/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  // 🔁 Helper to render tree
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
            {category.image && (
              <img
                src={`${BASE_URL}/${encodeURI(
                  category.image.replaceAll("\\", "/")
                )}`}
                className="w-10 h-10 object-cover rounded"
                alt={category.name}
              />
            )}
            <span>{category.name}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleDeleteCategory(category._id)}
              className="text-red-500 text-sm"
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
    ));

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
    <div className="min-h-screen p-6">
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
              className="border px-4 py-2 rounded w-full"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border px-4 py-2 rounded w-full"
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
              className="border px-4 py-2 rounded w-full col-span-2"
            />
          </div>
          <button
            onClick={handleAddCategory}
            disabled={!titleInput.trim() || loading}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>

        {/* Tree */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Category Tree</h2>
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

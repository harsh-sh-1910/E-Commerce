import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Sidebar from "./Sidebar/Sidebar";
import Dashboard from "./Dashboard/Dashboard";
import Orders from "./Orders/Orders";
import Products from "./Products/Products";
import Settings from "./Settings/Settings";
import Customers from "./Customers/Customers";
import AddProduct from "./AddProduct/AddProduct";
import Reviews from "./Reviews/Reviews";
import SingleOrderPage from "./SingleOrderPage/SingleOrderPage";
import Category from "./Category/Category";
import Login from "./Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import DealPage from "./DealPage/DealPage";

// This Layout wraps only protected routes
const Layout = ({ isSidebarOpen, toggleSidebar, children }) => {
  const location = useLocation();
  const hideSidebarRoutes = ["/login"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen bg-gray-100">
      {!shouldHideSidebar && (
        <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      )}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

const AppRoutes = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addProduct"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/singleOrder"
          element={
            <ProtectedRoute>
              <SingleOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dealpage"
          element={
            <ProtectedRoute>
              <DealPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <AppRoutes
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </Router>
  );
};

export default App;

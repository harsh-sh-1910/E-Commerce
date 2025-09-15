import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import MainPage from "./MainPage/MainPage";
import ShopPage from "./ShopPage/ShopPage";
import About from "./About/About";
import Contact from "./Contact/Contact";
import BlogPage from "./BlogPage/BlogPage";
import SingleBlogPage from "./SingleBlogPage/SingleBlogPage";
import BlogCategory from "./BlogCategory/BlogCategory";
import SingleProduct from "./SingleProduct/SingleProduct";
import CheckoutPage from "./CheckoutPage/CheckoutPage";
import CheckoutFormPage from "./CheckoutFormPage/CheckoutFormPage";
import WishlistPage from "./WishlistPage/WishlistPage";
import Login from "./Login/Login";
import Profile from "./Profile/Profile";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoutes";
import UserAddress from "./UserAddress/UserAddress";
import UserReview from "./UserReview/UserReview";
import UpdateUser from "./UpdateUser/UpdateUser";
import UserOrders from "./UserOrders/UserOrders";
import ScrollTop from "./ScrollTop/ScrollTop";

import { LocationProvider } from "./LocationContent/LocationContent";

const App = () => {
  return (
    <GoogleOAuthProvider clientId="1091483560078-tafio8k122bpuklpmok439ohdlm940ls.apps.googleusercontent.com">
      <LocationProvider>
        <div>
          <Router>
            <ScrollTop />
            <Header />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/userAddress" element={<UserAddress />} />
              <Route path="/userOrder" element={<UserOrders />} />
              <Route path="/updateuser" element={<UpdateUser />} />
              <Route path="/userreview" element={<UserReview />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/singleblogPage" element={<SingleBlogPage />} />
              <Route path="/blogcatgeory" element={<BlogCategory />} />
              <Route path="/product/:slug" element={<SingleProduct />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/checkoutForm"
                element={
                  <ProtectedRoute>
                    <CheckoutFormPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/wishlistPage" element={<WishlistPage />} />
            </Routes>
            <Footer />
          </Router>
        </div>
      </LocationProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

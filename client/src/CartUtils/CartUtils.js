// utils/cartUtils.js
export const getCartFromStorage = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const setCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeItemFromCart = (id) => {
  const cart = getCartFromStorage();
  const updatedCart = cart.filter((item) => item._id !== id);
  setCartToStorage(updatedCart);
  return updatedCart;
};
